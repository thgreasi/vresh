'use strict';

(function () {
  'use strict';

  Polymer({
    is: 'cities-list-item',

    properties: {
      items: {
        type: Array,
        notify: true
      },
      item: {
        type: Object,
        notify: true,
        observer: '_itemChangedObserver',
        value: function value() {
          return {};
        }
      },
      weatherIcon: {
        type: String,
        notify: true,
        computed: '_computeWeatherIcon(item)'
      }
    },

    observers: ['_weatherChanged(item.*)'],

    _weatherChanged: function _weatherChanged(newValue) {},

    _itemChangedObserver: function _itemChangedObserver(newValue) {},

    _computeWeatherIcon: function _computeWeatherIcon(item) {
      if (item && item.weather && item.weather[0] && item.weather[0].id) {
        var weatherIconID = item.weather[0].id;
        return 'weather-icons:wi_owm_' + weatherIconID;
      }
      return 'weather-icons:wi_wu_unknown';
    },

    unstarItemTap: function unstarItemTap() {
      var _this = this;

      this.$.unstarToast.show();
      // this.$.unstarToast.undoInitialHeight = this.getBoundingClientRect().height;
      // this.style.height = this.$.unstarToast.undoInitialHeight + 'px';
      // this.style.height = this.style.height;// force a redraw
      // this.style.height = '0px';
      this.$.collapse.hide();
      this.$.unstarToast.undoTimeout = setTimeout(function () {
        _this.$.unstarToast.undoTimeout = null;
        // this.$.itemsCont
        _this.fire('unstar', { item: _this.item });
      }, this.$.unstarToast.duration);
    },

    undoUnstar: function undoUnstar() {
      var _this2 = this;

      if (this.$.unstarToast.undoTimeout) {
        clearTimeout(this.$.unstarToast.undoTimeout);
        this.$.unstarToast.hide();
        this.$.unstarToast.undoTimeout = null;
        // this.style.height = this.$.unstarToast.undoInitialHeight;
        // this.style.height = this.style.height;// force a redraw
        setTimeout(function () {
          // this.style.height = '';
          _this2.$.collapse.show();
        }, 500);
      }
    },

    isPositive: function isPositive(number) {
      return number > 0;
    },

    isNegative: function isNegative(number) {
      return number < 0;
    },

    getDiffClass: function getDiffClass(diff) {
      if (diff > 0) {
        return 'positive-diff';
      }
      if (diff < 0) {
        return 'negative-diff';
      }
    }
  });
})();