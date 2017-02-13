import { location } from 'Window';

export var CORS_SERVICE_URL_PREFIX = 'https://cors-anywhere.herokuapp.com/';

var isHttps = location && location.href.toLowerCase().startsWith('https:');
var OpenWeatherMap_WS_Prefix = isHttps ?
	CORS_SERVICE_URL_PREFIX :
	'';

export var OpenWeatherMap_WS_BASE_URL = OpenWeatherMap_WS_Prefix + 'http://api.openweathermap.org/data/2.5/';
export var OpenWeatherMap_WS_AppId = '6bd9686d6698729a80ce12d387467d60';
