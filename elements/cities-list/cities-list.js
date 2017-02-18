'use strict';

(function () {
  'use strict';

  Polymer({
    is: 'cities-list',

    properties: {
      items: {
        type: Array,
        notify: true
      },
      sortedItems: {
        type: Array,
        notify: true
      },
      sort: {
        type: String,
        value: function value() {
          return '';
        }
      }
    },

    observers: ['_itemsOrSortingChanged(items, sort)'],

    refresh: function refresh() {
      var _this = this;

      console.log('refresh', this.items);
      if (!this.items) {
        return Promise.resolve();
      }

      var searchProvider = document.createElement('iron-meta').byKey('WeatherService');
      return Promise.all(this.items.map(function (c) {
        if (!c || !c.id) {
          return;
        }
        console.log('refreshing ' + c.name);

        var updatePromise = searchProvider.getCityWeatherByID(c.id).then(function (data) {
          if (!data || !data.id) {
            return;
          }
          var index = _this.items.indexOf(c);
          if (index >= 0) {
            _this.splice('items', index, 1, data);
          }
          return data;
        }).catch(function (e) {
          console.log('Error: ' + e);
          return c;
        });

        // var updatePromise =  c.updateDetails((subPath, value) => {
        //   let index = this.items.indexOf(c);
        //   if (index >= 0) {
        //     console.log(`Updating items.#${index}${subPath}: ${value}`);
        //     this.set(`items.#${index}${subPath}`, value);
        //   }
        // });

        return updatePromise.catch(function (e) {
          console.log('Error: ' + e);
          return c;
        });
      })).catch(function (e) {
        console.log('Error: ' + e);
        return _this.items;
      });
    },

    _sortItems: function _sortItems(a, b) {
      if (!this.sort || !(this.sort in this.items[0])) {
        return 0;
      }

      var ascSorting = !this.sort || this.sort === 'name' ? 1 : -1;

      var aa = a[this.sort];
      var bb = b[this.sort];
      if (aa < bb) {
        return -1 * ascSorting;
      }
      if (aa > bb) {
        return 1 * ascSorting;
      }
      return 0;
    },

    _itemsOrSortingChanged: function _itemsOrSortingChanged(items, sort) {
      var sortedItems = items.slice();
      if (sortedItems && sortedItems.length && sort && sort in sortedItems[0]) {
        sortedItems.sort(function (a, b) {
          var ascSorting = !sort || sort === 'name' ? 1 : -1;

          var aa = a[sort];
          var bb = b[sort];
          if (aa < bb) {
            return -1 * ascSorting;
          }
          if (aa > bb) {
            return 1 * ascSorting;
          }
          return 0;
        });
      }
      this.set('sortedItems', sortedItems);
    },

    unstarItem: function unstarItem(sender, details) {
      if (this.items && details && details.item) {
        var index = this.items.indexOf(details.item);
        if (index >= 0) {
          this.splice('items', index, 1);
        }
      }
    },

    ready: function ready() {}
  });
})();