(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('localforage')) :
    typeof define === 'function' && define.amd ? define(['localforage'], factory) :
    (factory(global.localforage));
}(this, function (localforage) { 'use strict';

    localforage = 'default' in localforage ? localforage['default'] : localforage;

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

    var OpenWeatherMap_WS_BASE_URL = 'http://api.openweathermap.org/data/2.5/';
    var OpenWeatherMap_WS_AppId = '6bd9686d6698729a80ce12d387467d60';

    var mockCityData = {};
    mockCityData['London'] = {
      "coord": {
        "lon": -0.13,
        "lat": 51.51
      },
      "weather": [{
        "id": 300,
        "main": "Drizzle",
        "description": "light intensity drizzle",
        "icon": "09d"
      }],
      "base": "stations",
      "main": {
        "temp": 280.32,
        "pressure": 1012,
        "humidity": 81,
        "temp_min": 279.15,
        "temp_max": 281.15
      },
      "visibility": 10000,
      "wind": {
        "speed": 4.1,
        "deg": 80
      },
      "clouds": {
        "all": 90
      },
      "dt": 1485789600,
      "sys": {
        "type": 1,
        "id": 5091,
        "message": 0.0103,
        "country": "GB",
        "sunrise": 1485762037,
        "sunset": 1485794875
      },
      "id": 2643743,
      "name": "London",
      "cod": 200
    };

    mockCityData['London2'] = {
      "coord": {
        "lon": -0.13,
        "lat": 51.51
      },
      "weather": [{
        "id": 721,
        "main": "Haze",
        "description": "haze",
        "icon": "50d"
      }, {
        "id": 520,
        "main": "Rain",
        "description": "light intensity shower rain",
        "icon": "09d"
      }, {
        "id": 310,
        "main": "Drizzle",
        "description": "light intensity drizzle rain",
        "icon": "09d"
      }, {
        "id": 701,
        "main": "Mist",
        "description": "mist",
        "icon": "50d"
      }, {
        "id": 600,
        "main": "Snow",
        "description": "light snow",
        "icon": "13d"
      }],
      "base": "stations",
      "main": {
        "temp": 274.56,
        "pressure": 1023,
        "humidity": 93,
        "temp_min": 273.15,
        "temp_max": 275.15
      },
      "visibility": 4600,
      "wind": {
        "speed": 4.6,
        "deg": 30
      },
      "clouds": {
        "all": 90
      },
      "dt": 1486893000,
      "sys": {
        "type": 1,
        "id": 5091,
        "message": 0.0114,
        "country": "GB",
        "sunrise": 1486883941,
        "sunset": 1486919473
      },
      "id": 2643743,
      "name": "London",
      "cod": 200
    };

    var mockLocationData = [];
    mockLocationData.push({
      "coord": {
        "lon": 139.01,
        "lat": 35.02
      },
      "weather": [{
        "id": 800,
        "main": "Clear",
        "description": "clear sky",
        "icon": "01n"
      }],
      "base": "stations",
      "main": {
        "temp": 285.514,
        "pressure": 1013.75,
        "humidity": 100,
        "temp_min": 285.514,
        "temp_max": 285.514,
        "sea_level": 1023.22,
        "grnd_level": 1013.75
      },
      "wind": {
        "speed": 5.52,
        "deg": 311
      },
      "clouds": {
        "all": 0
      },
      "dt": 1485792967,
      "sys": {
        "message": 0.0025,
        "country": "JP",
        "sunrise": 1485726240,
        "sunset": 1485763863
      },
      "id": 1907296,
      "name": "Tawarano",
      "cod": 200
    });

    var WeatherService$1 = function () {
        function WeatherService() {
            babelHelpers.classCallCheck(this, WeatherService);
        }

        babelHelpers.createClass(WeatherService, null, [{
            key: 'getCityWeather',


            // http://samples.openweathermap.org/data/2.5/weather?q=London,uk&appid=b1b15e88fa797225412429c1c50c122a1
            value: function getCityWeather(cityname) {
                console.log('Mock request: ${BASE_URL}weather?q=' + cityname + '&appid=${appid}');
                return new Promise(function (resolve) {
                    setTimeout(function () {
                        var result = Object.assign(new CityWeatherDetails(), mockCityData[cityname]);
                        result.setTemperatures();
                        resolve(result);
                    }, 700);
                });
            }

            // http://samples.openweathermap.org/data/2.5/weather?lat=35&lon=139&appid=b1b15e88fa797225412429c1c50c122a1

        }, {
            key: 'getLocationWeather',
            value: function getLocationWeather(lat, lon) {
                console.log('Mock request: ${BASE_URL}weather?lat=' + lat + '&lon=' + lon + '&appid=${appid}');
                return new Promise(function (resolve) {
                    setTimeout(function () {
                        resolve(mockLocationData[0]);
                    }, 700);
                });
            }
        }]);
        return WeatherService;
    }();

    var CityWeatherDetails = function () {
        function CityWeatherDetails() {
            babelHelpers.classCallCheck(this, CityWeatherDetails);

            this.stargazersHistory = this.stargazersHistory || [];
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
            key: 'setStargazers',
            value: function setStargazers(value) {
                if (value !== +value) {
                    return;
                }

                var date = new Date();
                this.stargazersHistory = this.stargazersHistory || [];
                if (!this.stargazersHistory.length || this.stargazers_count !== value) {
                    this.stargazersHistory.push({
                        date: date,
                        value: value
                    });
                }

                if (this.stargazers_count !== value) {
                    this.stargazers_count = value;
                    this.stargazers_count_lastUpdateDate = date;
                }
            }
        }, {
            key: 'updateDetails',
            value: function updateDetails() {
                var _this = this;

                return WeatherService$1.getRepoDetails(this.owner.login, this.name).then(function (repo) {
                    _this.setStargazers(repo.stargazers_count);
                    Object.keys(repo).filter(function (k) {
                        return typeof repo[k] !== 'function' && k !== 'stargazersHistory' && k !== 'downloadsHistory';
                    }).forEach(function (k) {
                        _this[k] = repo[k];
                    });
                    return repo;
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

            // http://samples.openweathermap.org/data/2.5/weather?lat=35&lon=139&appid=b1b15e88fa797225412429c1c50c122a1

        }, {
            key: 'getLocationWeather',
            value: function getLocationWeather(lat, lon) {
                return fetch(OpenWeatherMap_WS_BASE_URL + 'weather?lat=' + lat + '&lon=' + lon + '&appid=' + OpenWeatherMap_WS_AppId).then(function (response) {
                    return response.json();
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

    var citiesOnLoadPromise = localforage.getItem('data.cities').then(function (cities) {
      if (!Array.isArray(cities)) {
        cities = [];
      }

      cities = cities.map(function (repo) {
        return Object.assign(new CityWeatherDetails(), repo);
      });

      console.log('LOADED!', cities);
      return cities;
    }).catch(function () {
      return [];
    });

    loadedPromise.then(function () {
      console.log('loadedPromise');
      return citiesOnLoadPromise.then(function (cities) {
        // app.$.datacitiesStorage.set('autoSaveDisabled', false);
        app.set('cities', cities);
        console.log('SET cities', cities);

        if (cities.length) {
          setTimeout(function () {
            app.route = 'citiesitories';
            app.reloadPage();
          }, 0);
        }
      });

      // return getUserAndOrgcities('thgreasi');
    });

}));
//# sourceMappingURL=app.js.map
