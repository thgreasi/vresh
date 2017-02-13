'use strict';

(function () {
  'use strict';

  Polymer({
    is: 'city-weather',

    properties: {
      useFahrenheit: {
        type: Boolean,
        value: function value() {
          return false;
        }
      },
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
      weatherDescription: {
        type: String,
        notify: true,
        computed: '_computeWeatherDescription(item)'
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

    observers: ['_itemChanged(item, savedItems.*)'],

    _itemChanged: function _itemChanged() {
      var _this = this;

      if (this.item !== this.savedItem) {
        this._setSavedItem(null);
        this._setIsSaved(false);
      }

      if (this.item && this.savedItems) {

        if (!this.savedItem || this.savedItem.name !== this.item.name || this.savedItems.indexOf(this.savedItem) < 0) {

          var listItem = this.savedItems.filter(function (x) {
            return x.name === _this.item.name;
          }).shift();
          this._setSavedItem(listItem);
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

    _computeWeatherDescription: function _computeWeatherDescription(item) {
      if (item && item.weather && item.weather[0] && item.weather[0].description) {
        return item.weather[0].description;
      }
    },

    toggleStar: function toggleStar() {
      if (this.savedItems) {
        if (this.isSaved) {
          // this.splice('savedItems', this.savedItems.indexOf(this.savedItem), 1);
          this.savedItems.splice(this.savedItems.indexOf(this.savedItem), 1);
          this._setSavedItem(null);
          this._setIsSaved(false);
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