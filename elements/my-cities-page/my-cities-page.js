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
      },
      updateDate: {
        type: Date,
        default: function _default() {
          return null;
        },
        notify: true,
        readOnly: true
      },
      updateDateLocal: {
        type: String,
        notify: true,
        computed: '_computeUpdateDateLocal(updateDate)'
      },
      updateDateISO: {
        type: String,
        notify: true,
        computed: '_computeUpdateDateISO(updateDate)'
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
      promise.then(function (results) {
        if ((results || []).filter(function (x) {
          return !!x;
        }).length) {
          var d = new Date();
          _this2._setUpdateDate(d);
          var localforage = document.createElement('iron-meta').byKey('localforage');
          localforage.setItem('data.items.updateDate', d);
        }
      });
      return promise;
    },

    _computeUpdateDateLocal: function _computeUpdateDateLocal(updateDate) {
      if (!updateDate) {
        return '';
      }
      return updateDate.toLocaleFormat();
    },

    _computeUpdateDateISO: function _computeUpdateDateISO(updateDate) {
      if (!updateDate) {
        return '';
      }
      return updateDate.toISOString();
    },

    ready: function ready() {
      var _this3 = this;

      var localforage = document.createElement('iron-meta').byKey('localforage');
      localforage.getItem('data.items.updateDate').then(function (d) {
        if (d && !_this3.updateDate) {
          _this3._setUpdateDate(d);
        }
      });
    }
  });
})();