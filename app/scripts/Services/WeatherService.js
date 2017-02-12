import {
    OpenWeatherMap_WS_BASE_URL as BASE_URL,
    OpenWeatherMap_WS_AppId as appid
} from '../appConfig.js';

import CityWeatherDetails from '../Model/CityWeatherDetails';

export class WeatherService {

    // http://samples.openweathermap.org/data/2.5/weather?q=London,uk&appid=b1b15e88fa797225412429c1c50c122a1
    static getCityWeather (cityname) {
        return fetch(`${BASE_URL}weather?q=${cityname}&appid=${appid}`).then(function (response) {
            return response.json();
        }).then(function (response) {
            var result = Object.assign(new CityWeatherDetails(), response);
            result.setTemperatures();
            return result;
        }).catch(function (err) {
            console.log(err);
            return Promise.reject(err);
        });
    }

    // http://samples.openweathermap.org/data/2.5/weather?lat=35&lon=139&appid=b1b15e88fa797225412429c1c50c122a1
    static getLocationWeather (lat, lon) {
        return fetch(`${BASE_URL}weather?lat=${lat}&lon=${lon}&appid=${appid}`).then(function (response) {
            return response.json();
        }).catch(function (err) {
            console.log(err);
            return Promise.reject(err);
        });
    }
}
