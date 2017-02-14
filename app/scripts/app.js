import localforage from 'localforage';

import { app, loadedPromise } from './appCore';
import { init as appThemeInit } from './appTheme';

import { WeatherService } from './Services/WeatherServiceMock';
import CityWeatherDetails from './Model/CityWeatherDetails';


appThemeInit();

// localforage.config({
//   name: 'Vresh'
// });

app.WeatherService = WeatherService;
app.localforage = localforage;
app.CityWeatherDetails = CityWeatherDetails;

app.cities = [];


app.displayInstalledToast = function() {
  // Check to make sure caching is actually enabled—it won't be in the dev environment.
  if (!Polymer.dom(document).querySelector('platinum-sw-cache').disabled) {
    Polymer.dom(document).querySelector('#caching-complete').show();
  }
};

app.displayUpdatedToast = function() {
  // Check to make sure caching is actually enabled—it won't be in the dev environment.
  if (!Polymer.dom(document).querySelector('platinum-sw-cache').disabled) {
    Polymer.dom(document).querySelector('#caching-updated').show();
  }
};

// Scroll page to top and expand header
app.scrollPageToTop = function() {
  app.$.headerPanelMain.scrollToTop(true);
};

app.closeDrawer = function() {
  app.$.paperDrawerPanel.closeDrawer();
};

app.reloadPage = function() {
  if (app.crntPageElement && typeof app.crntPageElement.refresh === 'function') {
    app.crntPageElement.refresh();
  }
};

app.dataItemsLoaded = false;
var citiesOnLoadPromise = localforage.getItem('data.items').then(items => {
    if (!Array.isArray(items)) {
      items = [];
    }

    items = items.map(repo => Object.assign(new CityWeatherDetails(), repo));

    console.log('LOADED!', items);
    return items;
}).catch(() => []);

loadedPromise.then(() => {
  console.log('loadedPromise');
  return citiesOnLoadPromise.then(cities => {
    // app.$.datacitiesStorage.set('autoSaveDisabled', false);
    app.set('dataItemsLoaded', true);
    app.set('cities', cities || []);
    console.log('LOADED & SET cities', cities);

    if (cities && cities.length) {
      setTimeout(() => {
        app.route = 'cities';
        app.reloadPage();
      }, 0);
    }
  });

  // return getUserAndOrgcities('thgreasi');

});
