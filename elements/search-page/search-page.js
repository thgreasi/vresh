'use strict';

(function () {
  'use strict';

  Polymer({
    is: 'search-page',

    properties: {
      searchTermUnDebounced: {
        type: String,
        observer: '_searchTermUnDebouncedChangedObserver'
      },

      searchTerm: {
        type: String,
        // value: 'Welcome!',
        notify: true
      },

      searchTermTmp: {
        type: String,
        // value: 'Welcome!',
        notify: false
      },

      searchCoords: {
        type: Object,
        notify: true,
        value: function value() {
          return null;
        }
      },

      searchObject: {
        type: Object,
        notify: true,
        value: function value() {
          return null;
        }
      },

      // observer: '_searchObjectValueObserver',
      savedItems: {
        type: Array,
        notify: true
      },

      hasGeolocation: {
        type: Boolean,
        value: function value() {
          return !!navigator.geolocation;
        }
      }
    },

    observers: ['_searchObjectValueObserver(searchTerm, searchCoords)'],

    _searchObjectValueObserver: function _searchObjectValueObserver(searchTerm, searchCoords) {
      if (!searchTerm && !searchCoords) {
        this.set('searchObject', null);
      }
      // this.set('searchObject', {
      //   searchTerm: searchTerm,
      //   searchCoords: searchCoords
      // });
    },

    _searchTermUnDebouncedChangedObserver: function _searchTermUnDebouncedChangedObserver(newValue) {
      var _this = this;

      this.debounce('searchTermChanged', function () {
        _this.set('searchTerm', newValue);
      }, 500);
    },

    setSearchTerm: function setSearchTerm() {
      this.set('searchTerm', this.searchTermTmp || '');
      this.set('searchObject', {
        searchTerm: this.searchTerm,
        searchCoords: null
      });
    },

    getGeoLocation: function getGeoLocation() {
      var _this2 = this;

      navigator.geolocation.getCurrentPosition(function (position) {
        _this2.set('searchCoords', position.coords);
        _this2.set('searchObject', {
          searchTerm: null,
          searchCoords: _this2.searchCoords
        });
        // {
        //   "latitude": 38.4636,
        //   "longitude": 23.5994,
        //   "altitude": 0,
        //   "accuracy": 25000,
        //   "altitudeAccuracy": 0,
        //   "heading": "NaN",
        //   "speed": "NaN"
        // }
      });
    },

    ready: function ready() {
      var _this3 = this;

      this.$.searchForm.addEventListener('iron-form-presubmit', function (event) {
        event.preventDefault();
        _this3.setSearchTerm();
      });

      // we should use the promise returned by LF if the polymer package gets ever updated
      var lastValueLoadedFn = function lastValueLoadedFn() {
        if (_this3.searchTermTmp === undefined && _this3.searchTerm !== undefined) {
          _this3.$.lastSearchTermStorage.removeEventListener('value-changed', lastValueLoadedFn);
          _this3.set('searchTermTmp', _this3.searchTerm || '');
          _this3.setSearchTerm();
          _this3.$.searchInput.value = _this3.searchTermTmp;
        }
      };
      this.$.lastSearchTermStorage.addEventListener('value-changed', lastValueLoadedFn);

      this.$.lastSearchTermStorage.load();
    }
  });
})();