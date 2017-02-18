export default class CityWeatherDetails {

    constructor () {

    }

    setTemperatures () {
        if (this.main) {
            this.main.tempc = Math.round(this.main.temp - 273);
            // this.main.tempc = Math.round(CityWeatherDetails.fToC(this.main.temp));
            this.main.tempf = Math.round(CityWeatherDetails.cToF(this.main.tempc));
        }
    }

    static fToC (f) {
        return (f - 32) * 5/9;
    }

    static cToF (c) {
        return (c * 9 / 5) + 32;
    }

    updateDetails (setPathFn) {
        var searchProvider = document.createElement('iron-meta').byKey('WeatherService');
        return searchProvider.getCityWeatherByID(this.id).then(data => {
            console.log('asdf', data);
            if (!data || !data.id) {
                return;
            }
            Object.keys(data).forEach(key => {
                var newProp = data[key];
                if (this[key] !== newProp) {
                    // this.set(`items.#${index}.${key}`, newProp);
                    if (typeof setPathFn === 'function') {
                        setPathFn(`.${key}`, newProp);
                    } else {
                        this[key] = newProp;
                    }
                }
            });
            return data;
        });
    }
}
