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

      return this.items.map(function (cities) {
        return Promise.all([cities.updateDetails().then(function () {
          return '#${i}.stargazers_count';
        }), cities.updateDownloads().then(function () {
          return '#${i}.downloads';
        })].map(function (p) {
          return p.then(function (path) {
            var i = _this.items.indexOf(cities);
            if (i >= 0) {
              var _p = 'items.' + path.replace('${i}', i);
              _this.notifyPath(_p, _this.get(_p));
            }
            // this._itemsOrSortingChanged(this.items, this.sort);
            // i = this.sortedItems.indexOf(cities);
            // if (i >= 0) {
            //   let p = `sortedItems.${path.replace('${i}', i)}`;
            //   this.notifyPath(p, this.get(p));
            // }
            // return path;
          });
        })).catch(function (e) {
          console.error('Error:', e);
        });
      }).then(function (itemsWithPaths) {
        console.log(itemsWithPaths);
        // this._itemsOrSortingChanged(this.items, this.sort);
        // itemsWithPaths.forEach(itemPaths => {
        //   itemPaths.forEach(path => {
        //     let i = this.sortedItems.indexOf(cities);
        //     if (i >= 0) {
        //       let p = `sortedItems.${path.replace('${i}', i)}`;
        //       this.notifyPath(p, this.get(p));
        //     }
        //     return path;
        //   });
        // });

        // return itemsWithPaths;
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

    ready: function ready() {

      // this.items = [
      //   'Responsive Web App boilerplate',
      //   'Iron Elements and Paper Elements',
      //   'End-to-end Build Tooling (including Vulcanize)',
      //   'Unit testing with Web Component Tester',
      //   'Routing with Page.js',
      //   'Offline support with the Platinum Service Worker Elements'
      // ];
    }
  });
})();