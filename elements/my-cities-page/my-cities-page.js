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
      var localforage = document.createElement('iron-meta').byKey('localforage');
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

      this.items.map(function (item) {
        return Promise.all([item.updateDetails().then(function () {
          return '#${i}.stargazers_count';
        }), item.updateDownloads().then(function () {
          return '#${i}.downloads';
        })].map(function (p) {
          return p.then(function (path) {
            if (!path) {
              return;
            }
            var i = _this2.items.indexOf(item);
            if (i >= 0) {
              var _p = 'items.' + path.replace('${i}', i);
              _this2.notifyPath(_p, _this2.get(_p));
            }
          });
        })).catch(function (e) {
          console.error('Error:', e);
        });
      });
    },

    ready: function ready() {}
  });
})();