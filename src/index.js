import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';
import { refs } from './refs';

const DEBOUNCE_DELAY = 300;


const cleanMarkup = ref => (ref.innerHTML = '');

const inputHandler = e => {
  const textInput = e.target.value.trim();

  if (!textInput) {
    cleanMarkup(refs.countryList);
    cleanMarkup(refs.countryInfo);
    return;
  }

  fetchCountries(textInput)
    .then(response => {
      console.log(response);
      if (response.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name'
        );
        return;
      }
      renderMarkup(response);
    })
    .catch(err => {
      cleanMarkup(refs.countryList);
      cleanMarkup(refs.countryInfo);
      Notify.failure('Oops, there is no country with that name');
    });
};

const renderMarkup = response => {
  if (response.length ===  1) {
    cleanMarkup(refs.countryList);
    const markupInfo = createInfoMarkup(response);
    refs.countryInfo.innerHTML = markupInfo;
  } else {
    cleanMarkup(refs.countryInfo);
    const markupList = createListMarkup(response);
    refs.countryList.innerHTML = markupList;
  }
};

const createListMarkup = response => {
  return response
    .map(
      ({ name, flags }) =>
        `
        <li class="country-list__item">
        <img class="country-list__flag" src="${flags.png}" alt="${name.official}" width="60" height="40"/>
        <p class="country-list__name">${name.official}</p>
      </li>`
    )
    .join('');
};

const createInfoMarkup = response => {
  return response.map(
    ({ name, capital, population, flags, languages }) =>
      `<ul class="country-info__list">
          <li class="country-info__item">
          <img src="${flags.png}" alt="${name.official}" width="200" height="100">
            <span class="country-info__name">${name.official}</span>
          </li>
          <li class="country-info__item">
            <h2 class="country-info__title">Capital:</h2><p class="country-info__text">${capital}</p>
          </li>
          <li class="country-info__item">
            <h2 class="country-info__title">Population:</h2><p class="country-info__text">${population}</p>
          </li>
          <li class="country-info__item">
            <h2 class="country-info__title">Languages:</h2><p class="country-info__text">${Object.values(languages)}
          </li>
        </ul>`
  );
};

refs.input.addEventListener('input', debounce(inputHandler, DEBOUNCE_DELAY));