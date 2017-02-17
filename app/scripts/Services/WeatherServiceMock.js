import { mockCityData } from './MockData/WeatherServiceMockCityData';
import { mockLocationData } from './MockData/WeatherServiceMockLocationData';

import CityWeatherDetails from '../Model/CityWeatherDetails';

export class WeatherService {

    // http://samples.openweathermap.org/data/2.5/weather?q=London,uk&appid=b1b15e88fa797225412429c1c50c122a1
    static getCityWeather (cityname) {
        console.log(`Mock request: \${BASE_URL}weather?q=${cityname}&appid=\${appid}`);
        return new Promise(resolve => {
            setTimeout(() => {
                var result = Object.assign(new CityWeatherDetails(), mockCityData[cityname]);
                if (result.main) {
                    result.main.temp += (Math.random() >= 0.5 ? 1 : -1) * Math.round(Math.random() * 5);
                }
                result.setTemperatures();
                resolve(result);
            }, 700);
        });
    }

    static getCityWeatherByID (cityID) {
        console.log(`Mock request: \${BASE_URL}weather?id=${cityID}&appid=\${appid}`);
        return new Promise(resolve => {
            setTimeout(() => {
                var result = Object.assign(new CityWeatherDetails(), 
                    mockCityData[Object.keys(mockCityData).filter(k => mockCityData[k].id === cityID).shift()]);
                if (result.main) {
                    result.main.temp += (Math.random() >= 0.5 ? 1 : -1) * Math.round(Math.random() * 5);
                }
                result.setTemperatures();
                resolve(result);
            }, 700);
        });
    }

    // http://samples.openweathermap.org/data/2.5/weather?lat=35&lon=139&appid=b1b15e88fa797225412429c1c50c122a1
    static getLocationWeather (lat, lon) {
        console.log(`Mock request: \${BASE_URL}weather?lat=${lat}&lon=${lon}&appid=\${appid}`);
        return new Promise(resolve => {
            setTimeout(() => {
                var result = Object.assign(new CityWeatherDetails(), mockCityData[Object.keys(mockCityData)[0]]);
                if (result.main) {
                    result.main.temp += (Math.random() >= 0.5 ? 1 : -1) * Math.round(Math.random() * 5);
                }
                result.setTemperatures();
                resolve(result);
            }, 700);
        });
    }
}
