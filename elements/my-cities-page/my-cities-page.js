'use strict';

(function () {
  'use strict';

  Polymer({
    is: 'my-cities-page',

    properties: {
      items: {
        type: Array,
        notify: true
      },
      sortingOptions: {
        type: Array,
        notify: true,
        value: function value() {
          return [{ name: 'No sort', value: 'none' }, { name: 'By name', value: 'name' }, { name: 'By stars', value: 'stargazers_count' }, { name: 'By downloads', value: 'downloads' }];
        }
      },
      sortingType: {
        type: String,
        notify: true,
        value: function value() {
          return 'none';
        }
      },
      sortingDropDownOpened: {
        type: Boolean,
        notify: true
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

    observers: ['_itemsChanged(items.*)'],

    // _debounced_itemsChanged: function(changeRecord) {
    //   this.debounce('_itemsChanged', () => {
    //    this._itemsChanged.apply(this, arguments);
    //   }, 200);
    // },

    _itemsChanged: function _itemsChanged(changeRecord) {
      var _this = this;

      console.log('_itemsChanged', changeRecord);
      var ironMeta = document.createElement('iron-meta');
      var dataItemsLoaded = ironMeta.byKey('dataItemsLoaded');
      if (!dataItemsLoaded) {
        // do not save anything until the old data are loaded
        console.log('_itemsChanged save skipped');
        return;
      }
      var localforage = ironMeta.byKey('localforage');
      localforage.setItem('data.items', this.items).then(function () {
        console.log('Saved', 'data.items', _this.items);
      });
    },


    openSortingDropDown: function openSortingDropDown() {
      this.set('sortingDropDownOpened', true);
    },

    sortingOptionSelected: function sortingOptionSelected() {
      this.set('sortingDropDownOpened', false);
    },

    refresh: function refresh() {
      var _this2 = this;

      var promise = this.$.citieslist.refresh();
      this._setActiveCityWeatherPromise(promise);
      promise.catch(function () {}).then(function () {
        _this2._setActiveCityWeatherPromise(null);
      });
      return promise;
    },

    ready: function ready() {}
  });
})();