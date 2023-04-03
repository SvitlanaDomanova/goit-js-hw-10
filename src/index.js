import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';
import { refs } from './refs';
const DEBOUNCE_DELAY = 300;

refs.input.addEventListener('input', debounce(OnInputValue, DEBOUNCE_DELAY));

function OnInputValue(e) {
  e.preventDefault();
  const inputValue = e.target.value.trim();
  if (inputValue) {
    fetchCountries(inputValue)
      .then(response => inputValueSetings(response))
      .catch(() => Notify.failure('Oops, there is no country with that name'));
  } else {
    clearMarkup();
  }
}

function inputValueSetings(response) {
  response.length === 1 && createCartInfo(response);
  response.length < 2 && createCartInfo(response);
  response.length < 11 && response.length > 1 && createList(response);
  response.length > 10 &&

    Notify.info('Too many matches found. Please enter a more specific name.');
}

function createList(response) {
  clearMarkup();
  let markup = response.map(({ name, flags: { svg } }) => {
    return `
      <li class="country-list__item">
        <img class="country-list__flag" src="${svg}" alt="Flag of mp${name}"/>
        <p class="country-list__name">${name}</p>
      </li>`;
  });
  refs.countryList.insertAdjacentHTML('beforeend', markup.join(''));
}

function createCartInfo(response) {
  clearMarkup();
  let markup = response.map(
    ({ name, capital, population, flags: { svg }, languages}) => {
      return `
        <ul class="country-info__list">
          <li class="country-info__item">
            <img class="country-info__flag" src='${svg}' alt='flag' />
            <span class="country-info__name">${name}</span>
          </li>
          <li class="country-info__item">
            <h2 class="country-info__title">Capital:</h2><p class="country-info__text">${capital}</p>
          </li>
          <li class="country-info__item">
            <h2 class="country-info__title">Population:</h2><p class="country-info__text">${population}</p>
          </li>
          <li class="country-info__item">
            <h2 class="country-info__title">Languages:</h2><p class="country-info__text">${object.values(languages).join(", ")}</p>
          </li>
        </ul>`;
    }
  );
  refs.countryInfo.innerHTML = markup
}

function clearMarkup() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
