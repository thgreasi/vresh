'use strict';

(function () {
  'use strict';

  Polymer({
    is: 'openweathermap-search',

    properties: {
      // searchTerm: {
      //   type: String,
      //   // value: 'Welcome!',
      //   notify: true,
      //   observer: '_debounced_searchTermChanged'
      // },

      searchParams: {
        type: Object,
        // value: 'Welcome!',
        notify: true,
        observer: '_debounced_searchParamsChanged'
      },

      savedItems: {
        type: Array,
        notify: true
      },

      cityWeather: {
        type: Object,
        default: function _default(f) {
          return null;
        },
        notify: true,
        readOnly: true
      },

      activeCityWeatherPromise: {
        type: Object,
        default: function _default(f) {
          return null;
        },
        notify: true,
        readOnly: true
      }
    },

    // _debounced_searchTermChanged: function() {
    //   this.debounce('_searchTermChanged', function() {
    //    this._searchTermChanged();
    //   }, 500);
    // },

    // _searchTermChanged: function () {
    //   if (!this.searchTerm || this.searchTerm.length < 3) {
    //     this._setCityWeather([]);
    //     this._setActiveCityWeatherPromise(null);
    //   }

    //   var searchProvider = document.createElement('iron-meta').byKey('WeatherService');
    //   var promise = searchProvider.getCityWeather(this.searchTerm);
    //   this._setActiveCityWeatherPromise(promise);
    //   promise.then(data => {
    //     // ensure that the user hasn't initiated
    //     // a new search
    //     if (this.activeCityWeatherPromise === promise) {
    //       if (data && data.name) {
    //         this._setCityWeather(data);
    //       } else {
    //         this._setCityWeather(null);
    //       }
    //       this._setActiveCityWeatherPromise(null);
    //     }
    //   }, () => {
    //     this._setCityWeather(null);
    //   });
    // },

    _debounced_searchParamsChanged: function _debounced_searchParamsChanged() {
      this.debounce('_searchParamsChanged', function () {
        this._searchParamsChanged();
      }, 500);
    },

    _searchParamsChanged: function _searchParamsChanged() {
      var _this = this;

      if (!this.searchParams || !this.searchParams.searchTerm && !this.searchParams.searchCoords) {
        this._setCityWeather([]);
        this._setActiveCityWeatherPromise(null);
        return;
      }

      var searchProvider = document.createElement('iron-meta').byKey('WeatherService');
      var promise = this.searchParams.searchTerm ? searchProvider.getCityWeather(this.searchParams.searchTerm) : searchProvider.getLocationWeather(this.searchParams.searchCoords.latitude, this.searchParams.searchCoords.longitude);
      this._setActiveCityWeatherPromise(promise);
      promise.then(function (data) {
        // ensure that the user hasn't initiated
        // a new search
        if (_this.activeCityWeatherPromise === promise) {
          if (data && data.name) {
            _this._setCityWeather(data);
            // let savedItem = this.savedItems.filter(x => x.id === data.id).shift();
            // if (savedItem) {
            //   let index = this.savedItems.indexOf(savedItem);
            //   this.splice('savedItems', index, 1, data);

            //   // Object.assign(savedItem, data);
            //   // this.notifyPath(`savedItems.#${index}`, data);
            // }
          } else {
              _this._setCityWeather(null);
            }
          _this._setActiveCityWeatherPromise(null);
        }
      }, function () {
        _this._setCityWeather(null);
      });
    },

    toggleCityListItemsSelection: function toggleCityListItemsSelection(e, detail) {
      var button = e.currentTarget || e.target;
      var items = Array.prototype.slice.apply(document.querySelectorAll(button.dataset.targetContainer + ' search-cities-list-item'));

      if (button.dataset.targetType) {
        (function () {
          var invertFilter = button.dataset.targetType.indexOf('!') === 0;
          var filterPropName = button.dataset.targetType;
          if (invertFilter) {
            filterPropName = filterPropName.replace('!', '');
          }

          items = items.filter(function (element) {
            return element.item && !element.item[filterPropName] === invertFilter;
          });
        })();
      }
      this._toggleCityListItemsSelection(items);
    },

    _toggleCityListItemsSelection: function _toggleCityListItemsSelection(items) {
      var selected = [];
      var unselected = [];

      items.forEach(function (element) {
        if (element.isSaved) {
          selected.push(element);
        } else {
          unselected.push(element);
        }
      });

      if (selected.length === items.length) {
        selected.forEach(function (element) {
          element.toggleSaveUserCity();
        });
      } else {
        unselected.forEach(function (element) {
          element.toggleSaveUserCity();
        });
      }
    },

    ready: function ready() {}
  });
})();