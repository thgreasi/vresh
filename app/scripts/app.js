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

var citiesOnLoadPromise = localforage.getItem('data.cities').then(cities => {
    if (!Array.isArray(cities)) {
      cities = [];
    }

    cities = cities.map(repo => Object.assign(new CityWeatherDetails(), repo));

    console.log('LOADED!', cities);
    return cities;
}).catch(() => []);

loadedPromise.then(() => {
  console.log('loadedPromise');
  return citiesOnLoadPromise.then(cities => {
    // app.$.datacitiesStorage.set('autoSaveDisabled', false);
    app.set('cities', cities);
    console.log('SET cities', cities);

    if (cities.length) {
      setTimeout(() => {
        app.route = 'citiesitories';
        app.reloadPage();
      }, 0);
    }
  });

  // return getUserAndOrgcities('thgreasi');

});

function getUserAndOrgcities(username) {
  var usercitiesPromise = GithubService.getUsercities(username);
  var orgsPromise = GithubService.getUserOrgs(username);

  var overallPromises = [processRepoInfosPromise(usercitiesPromise)];

  overallPromises.push(orgsPromise.then(orgs => {
    return Promise.all(orgs.map(o => processRepoInfosPromise(GithubService.getUsercities(o.login))));
  }));

  return Promise.all([overallPromises]);
}


function processRepoInfos (cities) {
  cities.forEach((repo) => {
    repo.setStargazers(repo.stargazers_count);
    repo.setDownloads(repo.downloads);
  });
  
  if (cities.length) {
    app.cities.push.apply(app.cities, cities);
    app.set('cities', app.cities.slice());
  }

  // let args = cities.slice();
  // args.unshift('app.cities');
  // console.log(args);
  // app.push.apply(app, args);
}

function processRepoInfosPromise (citiesPromise) {
  return citiesPromise.then(cities => processRepoInfos(cities));
}
