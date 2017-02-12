import { WeatherService } from '../Services/WeatherServiceMock';

export default class CityWeatherDetails {

    constructor () {
        this.stargazersHistory = this.stargazersHistory || [];
    }

    setTemperatures () {
        if (this.main) {
            this.main.tempf = Math.round(this.main.temp);
            this.main.tempc = Math.round(CityWeatherDetails.fToC(this.main.temp));
        }
    }

    static fToC (f) {
        return (f - 32) * 5/9;
    }

    setStargazers (value) {
        if (value !== +value) {
            return;
        }

        var date = new Date();
        this.stargazersHistory = this.stargazersHistory || [];
        if (!this.stargazersHistory.length || this.stargazers_count !== value) {
            this.stargazersHistory.push({
                date: date,
                value: value
            });
        }

        if (this.stargazers_count !== value) {
            this.stargazers_count = value;
            this.stargazers_count_lastUpdateDate = date;
        }
    }

    updateDetails () {
        return WeatherService.getRepoDetails(this.owner.login, this.name).then(repo => {
            this.setStargazers(repo.stargazers_count);
            Object.keys(repo).filter(k =>
                typeof repo[k] !== 'function' &&
                k !== 'stargazersHistory' &&
                k !== 'downloadsHistory'
            ).forEach(k => {
                this[k] = repo[k];
            });
            return repo;
        });
    }
}
