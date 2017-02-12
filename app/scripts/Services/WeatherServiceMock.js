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
                resolve(mockLocationData[0]);
            }, 700);
        });
    }
}
