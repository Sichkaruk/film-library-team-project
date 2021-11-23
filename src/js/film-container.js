import debounce from 'lodash.debounce';
import card from '../templates/film-card-template.hbs';
import SearchAPI from './apiService.js';
import { refs } from './refs.js';

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';

const apiService = new SearchAPI();

getData();

async function getData() {
  try {
    const movies = await apiService.getMovies();
    // console.log(movies);
    showMovies(movies.results);
  } catch (error) {
    console.error(error);
  }
}

function showMovies(movies) {
  refs.galleryList.innerHTML = card(movies);
}

/*******************поиск по запросу******************************* */
const DEBOUNCE_DELAY = 700;
refs.inputSearch.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));

async function onInputSearch(event) {
  apiService.searchQuery = event.target.value.trim();

  if (!apiService.searchQuery) {
    Loading.standard();
    getData();
    Loading.remove();
    return;
  }

  try {
    Loading.standard();
    const movies = await apiService.getMovies();
    Loading.remove();

    if (movies.total_results > 0) {
      showMovies(movies.results);
      Notify.success(`Hooray! We found ${movies.total_results} movies.`);
    } else {
      refs.galleryList.innerHTML = '';
      Notify.failure('Oops, there is no movies with that name.');
    }
  } catch (error) {
    console.error(error);
  }
}
