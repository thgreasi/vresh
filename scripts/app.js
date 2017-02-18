(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('localforage'), require('location')) :
    typeof define === 'function' && define.amd ? define(['localforage', 'location'], factory) :
    (factory(global.localforage,global.location));
}(this, function (localforage,location) { 'use strict';

    localforage = 'default' in localforage ? localforage['default'] : localforage;
    location = 'default' in location ? location['default'] : location;

    var babelHelpers = {};

    babelHelpers.classCallCheck = function (instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    };

    babelHelpers.createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }

      return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
      };
    }();

    babelHelpers;

    // Grab a reference to our auto-binding template
    // and give it some initial binding values
    // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
    var app = document.querySelector('#app');

    // Sets app default base URL
    app.baseUrl = '/';
    if (window.location.port === '') {
      // if production
      // Uncomment app.baseURL below and
      // set app.baseURL to '/your-pathname/' if running from folder in production
      app.baseUrl = '/vresh/';
    }

    var loadedPromise = new Promise(function (resolve) {
      // Listen for template bound event to know when bindings
      // have resolved and content has been stamped to the page
      app.addEventListener('dom-change', function () {
        resolve();
      });
    });

    function init() {
      initPageHeader();
    }

    function initPageHeader() {
      // Main area's paper-scroll-header-panel custom condensing transformation of
      // the appName in the middle-container and the bottom title in the bottom-container.
      // The appName is moved to top and shrunk on condensing. The bottom sub title
      // is shrunk to nothing on condensing.
      window.addEventListener('paper-header-transform', function (e) {
        var appName = Polymer.dom(document).querySelector('#mainToolbar .app-name');
        var middleContainer = Polymer.dom(document).querySelector('#mainToolbar .middle-container');
        var bottomContainer = Polymer.dom(document).querySelector('#mainToolbar .bottom-container');
        var detail = e.detail;
        var heightDiff = detail.height - detail.condensedHeight;
        var yRatio = Math.min(1, detail.y / heightDiff);
        // appName max size when condensed. The smaller the number the smaller the condensed size.
        var maxMiddleScale = 0.50;
        var auxHeight = heightDiff - detail.y;
        var auxScale = heightDiff / (1 - maxMiddleScale);
        var scaleMiddle = Math.max(maxMiddleScale, auxHeight / auxScale + maxMiddleScale);
        var scaleBottom = 1 - yRatio;

        // Move/translate middleContainer
        Polymer.Base.transform('translate3d(0,' + yRatio * 100 + '%,0)', middleContainer);

        // Scale bottomContainer and bottom sub title to nothing and back
        Polymer.Base.transform('scale(' + scaleBottom + ') translateZ(0)', bottomContainer);

        // Scale middleContainer appName
        Polymer.Base.transform('scale(' + scaleMiddle + ') translateZ(0)', appName);
      });
    }

    var CORS_SERVICE_URL_PREFIX = 'https://cors-anywhere.herokuapp.com/';

    var isHttps = location && location.href.toLowerCase().startsWith('https:');
    var OpenWeatherMap_WS_Prefix = isHttps ? CORS_SERVICE_URL_PREFIX : '';

    var OpenWeatherMap_WS_BASE_URL = OpenWeatherMap_WS_Prefix + 'http://api.openweathermap.org/data/2.5/';
    var OpenWeatherMap_WS_AppId = '6bd9686d6698729a80ce12d387467d60';

    var CityWeatherDetails = function () {
        function CityWeatherDetails() {
            babelHelpers.classCallCheck(this, CityWeatherDetails);
        }

        babelHelpers.createClass(CityWeatherDetails, [{
            key: 'setTemperatures',
            value: function setTemperatures() {
                if (this.main) {
                    this.main.tempc = Math.round(this.main.temp - 273);
                    // this.main.tempc = Math.round(CityWeatherDetails.fToC(this.main.temp));
                    this.main.tempf = Math.round(CityWeatherDetails.cToF(this.main.tempc));
                }
            }
        }, {
            key: 'updateDetails',
            value: function updateDetails(setPathFn) {
                var _this = this;

                var searchProvider = document.createElement('iron-meta').byKey('WeatherService');
                return searchProvider.getCityWeatherByID(this.id).then(function (data) {
                    console.log('asdf', data);
                    if (!data || !data.id) {
                        return;
                    }
                    Object.keys(data).forEach(function (key) {
                        var newProp = data[key];
                        if (_this[key] !== newProp) {
                            // this.set(`items.#${index}.${key}`, newProp);
                            if (typeof setPathFn === 'function') {
                                setPathFn('.' + key, newProp);
                            } else {
                                _this[key] = newProp;
                            }
                        }
                    });
                    return data;
                });
            }
        }], [{
            key: 'fToC',
            value: function fToC(f) {
                return (f - 32) * 5 / 9;
            }
        }, {
            key: 'cToF',
            value: function cToF(c) {
                return c * 9 / 5 + 32;
            }
        }]);
        return CityWeatherDetails;
    }();

    var WeatherService = function () {
        function WeatherService() {
            babelHelpers.classCallCheck(this, WeatherService);
        }

        babelHelpers.createClass(WeatherService, null, [{
            key: 'getCityWeather',


            // http://samples.openweathermap.org/data/2.5/weather?q=London,uk&appid=b1b15e88fa797225412429c1c50c122a1
            value: function getCityWeather(cityname) {
                return fetch(OpenWeatherMap_WS_BASE_URL + 'weather?q=' + cityname + '&appid=' + OpenWeatherMap_WS_AppId).then(function (response) {
                    return response.json();
                }).then(function (response) {
                    var result = Object.assign(new CityWeatherDetails(), response);
                    result.setTemperatures();
                    return result;
                }).catch(function (err) {
                    console.log(err);
                    return Promise.reject(err);
                });
            }
        }, {
            key: 'getCityWeatherByID',
            value: function getCityWeatherByID(cityID) {
                return fetch(OpenWeatherMap_WS_BASE_URL + 'weather?id=' + cityID + '&appid=' + OpenWeatherMap_WS_AppId).then(function (response) {
                    return response.json();
                }).then(function (response) {
                    var result = Object.assign(new CityWeatherDetails(), response);
                    result.setTemperatures();
                    return result;
                }).catch(function (err) {
                    console.log(err);
                    return Promise.reject(err);
                });
            }

            // http://samples.openweathermap.org/data/2.5/weather?lat=35&lon=139&appid=b1b15e88fa797225412429c1c50c122a1

        }, {
            key: 'getLocationWeather',
            value: function getLocationWeather(lat, lon) {
                return fetch(OpenWeatherMap_WS_BASE_URL + 'weather?lat=' + lat + '&lon=' + lon + '&appid=' + OpenWeatherMap_WS_AppId).then(function (response) {
                    return response.json();
                }).then(function (response) {
                    var result = Object.assign(new CityWeatherDetails(), response);
                    result.setTemperatures();
                    return result;
                }).catch(function (err) {
                    console.log(err);
                    return Promise.reject(err);
                });
            }
        }]);
        return WeatherService;
    }();

    init();

    // localforage.config({
    //   name: 'Vresh'
    // });

    app.WeatherService = WeatherService;
    app.localforage = localforage;
    app.CityWeatherDetails = CityWeatherDetails;

    app.cities = [];

    app.displayInstalledToast = function () {
      // Check to make sure caching is actually enabled—it won't be in the dev environment.
      if (!Polymer.dom(document).querySelector('platinum-sw-cache').disabled) {
        Polymer.dom(document).querySelector('#caching-complete').show();
      }
    };

    app.displayUpdatedToast = function () {
      // Check to make sure caching is actually enabled—it won't be in the dev environment.
      if (!Polymer.dom(document).querySelector('platinum-sw-cache').disabled) {
        Polymer.dom(document).querySelector('#caching-updated').show();
      }
    };

    // Scroll page to top and expand header
    app.scrollPageToTop = function () {
      app.$.headerPanelMain.scrollToTop(true);
    };

    app.closeDrawer = function () {
      app.$.paperDrawerPanel.closeDrawer();
    };

    app.reloadPage = function () {
      if (app.crntPageElement && typeof app.crntPageElement.refresh === 'function') {
        app.crntPageElement.refresh();
      }
    };

    app.dataItemsLoaded = false;
    var citiesOnLoadPromise = localforage.getItem('data.items').then(function (items) {
      if (!Array.isArray(items)) {
        items = [];
      }

      items = items.map(function (repo) {
        return Object.assign(new CityWeatherDetails(), repo);
      });

      console.log('LOADED!', items);
      return items;
    }).catch(function () {
      return [];
    });

    loadedPromise.then(function () {
      console.log('loadedPromise');
      return citiesOnLoadPromise.then(function (cities) {
        // app.$.datacitiesStorage.set('autoSaveDisabled', false);
        app.set('dataItemsLoaded', true);
        app.set('cities', cities || []);
        console.log('LOADED & SET cities', cities);

        if (cities && cities.length) {
          setTimeout(function () {
            app.page.show('/cities');
            app.reloadPage();
          }, 0);
        }
      });

      // return getUserAndOrgcities('thgreasi');
    });

}));
//# sourceMappingURL=app.js.map
