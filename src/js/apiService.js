import axios from 'axios';
import { genres } from './genres';

// Ключ API (v3 auth)
// 93fd20970d74d9a3f9466d8d6c9e6297

// Ключ доступа к API (v4 auth)
// eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5M2ZkMjA5NzBkNzRkOWEzZjk0NjZkOGQ2YzllNjI5NyIsInN1YiI6IjYxOTNhYjExNDJmMTlmMDA0MzFlZTkzYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.z6zVAqAKYmCRhBa4xmofDsVBFw9-x8O5I_GnOqiw-F8

const AUTH_KEY =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5M2ZkMjA5NzBkNzRkOWEzZjk0NjZkOGQ2YzllNjI5NyIsInN1YiI6IjYxOTNhYjExNDJmMTlmMDA0MzFlZTkzYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.z6zVAqAKYmCRhBa4xmofDsVBFw9-x8O5I_GnOqiw-F8';
axios.defaults.headers.common['Authorization'] = `Bearer ${AUTH_KEY}`;

//форматирует жанры фильмов
function formatGenres(idArray) {
  const resArr = [];
  idArray.forEach(id => {
    for (let i = 0; i < genres.length; i++) {
      genres[i].id === id ? resArr.push(genres[i].name) : undefined;
    }
  });

  if (resArr.length > 2) {
    resArr.splice(2, resArr.length, 'Other');
  }
  return resArr.join(', ');
}

//форматирует дату выпуска фильмов
function formatYear(date) {
  return date ? date.slice(0, 4) : undefined;
}

//форматирует оценку фильма
function formatVote(voteNumber) {
  return voteNumber.toFixed(1);
}

//экспорт функций запросов
export default {
  //запрос на фильмы по ключевому слову или самые популярные
  async getMovies(query) {
    let response;
    try {
      if (query) {
        response = await axios.get(
          `https://api.themoviedb.org/3/search/movie?language=en-US&query=${query}&page=1&include_adult=false`,
        );
      } else {
        response = await axios.get('https://api.themoviedb.org/3/trending/movie/week');
      }

      const movies = await response.data;

      //форматируем объект с фильмами
      movies.results.forEach(movie => {
        movie.genre_ids = formatGenres(movie.genre_ids);
        movie.release_date = formatYear(movie.release_date);
        movie.vote_average = formatVote(movie.vote_average);
      });

      //возвращаем фильмы
      return movies;
    } catch (error) {
      console.error(error);
    }
  },

  //запрос на фильм по по ID
  async getMovieById(movieId) {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`);
      const movie = await response.data;

      //форматируем поле с жанрами фильма
      const movieGenres = movie.genres.map(element => element.name).join(', ');
      movie.genres = movieGenres;

      //возвращаем фильм
      return movie;
    } catch (error) {
      console.error(error);
    }
  },
};
