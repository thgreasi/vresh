import CityWeatherDetails from '../Model/CityWeatherDetails';

import { mockCityData } from './MockData/WeatherServiceMockCityData';

export class WeatherService {

    static getCityInfo (username) {
        return Promise.resolve(mockCityData[username]);
    }

    static getCityDetails (username, reponame) {
        return this.getCityCitys(username)
            .then(repos => {
                var result = repos.filter(r => r.name === reponame).shift();
                if (result) {
                    // result = Object.assign(new CityWeatherDetails(), result);
                    var sign = Math.random() >= 0.5 ? 1 : -1;
                    result.stargazers_count = Math.max(0,
                        result.stargazers_count + Math.ceil(sign * Math.random() * 0.3 * result.stargazers_count));
                }
                return result;
            });
    }

    static searchCity (username) {
        return new Promise((resolve) => {
            var match = mockCitySearchData[username];
            if (match) {
                setTimeout(() => {
                    resolve(match);
                }, 1000 + Math.random() * 2);
            } else {
                let match = mockCitySearchData.thgre;
                if (username && match) {
                    var result = Object.assign({}, match);
                    result.items = result.items.filter(i => {
                        return i.login.indexOf(username) >= 0;
                    });
                    setTimeout(() => {
                        resolve(result);
                    }, 1000 + Math.random() * 1);
                } else {
                    resolve({});
                }
            }
        });
    }

    static searchCity (reponame) {
        return new Promise((resolve) => {
            var match = mockCitySearchData[reponame];
            if (match) {
                setTimeout(() => {
                    resolve(match);
                }, 1000 + Math.random() * 2);
            } else {
                let match = mockCitySearchData.localfora;
                if (reponame && match) {
                    var result = Object.assign({}, match);
                    result.items = result.items.filter(i => {
                        return i.name.indexOf(reponame) >= 0;
                    }).map(repo => Object.assign(new CityWeatherDetails(), repo));
                    setTimeout(() => {
                        resolve(result);
                    }, 1000 + Math.random() * 1);
                } else {
                    resolve({});
                }
            }
        });
    }
}
