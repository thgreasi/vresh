'use strict';

(function () {
  'use strict';

  Polymer({
    is: 'search-cities-page',

    properties: {
      itemNamesParam: {
        type: String,
        notify: true,
        observer: '_itemNamesParamChanged'
      },

      itemNames: {
        type: Array,
        notify: true
      },

      items: {
        type: Array,
        notify: true
      }
    },

    _itemNamesParamChanged: function _itemNamesParamChanged() {
      if (!this.itemNamesParam || !this.itemNamesParam.length) {
        this.itemNames = [];
      } else {
        this.itemNames = this.itemNamesParam.split(',').map(function (s) {
          return s.trim();
        }).filter(function (s) {
          return s && s.length;
        });
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