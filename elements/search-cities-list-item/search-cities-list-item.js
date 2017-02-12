'use strict';

(function () {
  'use strict';

  Polymer({
    is: 'search-cities-list-item',

    properties: {
      item: {
        type: Object,
        notify: true,
        value: function value() {
          return {};
        },
        observer: '_itemChanged'
      },
      weatherIcon: {
        type: String,
        notify: true,
        computed: '_computeWeatherIcon(item)'
      },
      savedItems: {
        type: Array,
        notify: true
      },
      savedItem: {
        type: Object,
        readOnly: true
      },
      isSaved: {
        type: Boolean,
        readOnly: true
      }
    },

    observers: ['_itemChanged(item, savedItems)'],

    _itemChanged: function _itemChanged() {
      var _this = this;

      if (this.item && this.savedItems && this.savedItems.length) {

        if (!this.savedItem || this.savedItem.full_name !== this.item.full_name || this.savedItems.indexOf(this.savedItem) < 0) {
          this._setSavedItem(this.savedItems.filter(function (x) {
            return x.full_name === _this.item.full_name;
          }).shift());
        }
      }
      this._setIsSaved(!!this.savedItem);
    },

    _computeWeatherIcon: function _computeWeatherIcon(item) {
      if (item && item.weather && item.weather[0] && item.weather[0].id) {
        var weatherIconID = item.weather[0].id;
        return 'weather-icons:wi_owm_' + weatherIconID;
      }
      return 'weather-icons:wi_wu_unknown';
    },

    toggleSaveUserRepo: function toggleSaveUserRepo() {
      if (this.savedItems) {
        if (this.isSaved) {
          // this.splice('savedItems', this.savedItems.indexOf(this.savedItem), 1);
          this.savedItems.splice(this.savedItems.indexOf(this.savedItem), 1);
        } else {
          // this.push('savedItems', this.item);
          this.savedItems.push(this.item);
        }
        this.set('savedItems', this.savedItems.slice());
      }
    },

    ready: function ready() {}
  });
})();