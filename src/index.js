import cardHbs from './templates/card.hbs';
import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { PixebayApi } from './js/pixebayApi';

const searchFormEl = document.querySelector('#search-form');
const loadMoreBtnel = document.querySelector('.load-more');
const galleryEl = document.querySelector('.gallery');

const pixebayApi = new PixebayApi();

const Simple = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const onSearchFormSubmit = event => {
  event.preventDefault();

  const inputValue = event.currentTarget.elements.searchQuery.value;
  console.log(inputValue);

  pixebayApi.query = inputValue;
  pixebayApi.page = 1;

  pixebayApi
    .fetchPhotosByQuery()
    .then(response => {
      if (response.data.hits.length === 0 || inputValue === '') {
        galleryEl.innerHTML = '';
        loadMoreBtnel.classList.add('is-hidden');

        Notiflix.Notify.failure(
          `Sorry, there are no images matching your search query "${inputValue}". Please try again.`
        );
        return;
      } else {
        Notiflix.Notify.info(
          `Hooray! We found ${response.data.totalHits} images.`
        );
      }

      galleryEl.innerHTML = cardHbs(response.data.hits);
      loadMoreBtnel.classList.remove('is-hidden');
      Simple.refresh();

      console.log(response);
    })
    .catch(err => {
      console.log(err);
    });
};

const onLoadMoreBtnClick = event => {
  pixebayApi.page += 1;

  pixebayApi
    .fetchPhotosByQuery()
    .then(response => {
      if (response.data.hits.length < 40) {
        loadMoreBtnel.classList.add('is-hidden');
        Notiflix.Notify.info(
          'We are sorry, but you have reached the end of search results.'
        );
      }
      galleryEl.insertAdjacentHTML('beforeend', cardHbs(response.data.hits));
      Simple.refresh();
      
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
      console.log(response);
    })
    .catch(err => {
      console.log(err);
    });
};

searchFormEl.addEventListener('submit', onSearchFormSubmit);
loadMoreBtnel.addEventListener('click', onLoadMoreBtnClick);
