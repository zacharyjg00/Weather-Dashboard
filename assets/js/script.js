let city = "lakeville";

const units = "imperial";

const apiKey = "058dc32d2aa0d74282afc490c90bb317";

let queryUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=" + units;

let forecastUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=";

function apiQuery(url) {
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            let lon = data.coord.lon;
            let lat = data.coord.lat;
            console.log(lon);
            console.log(lat);
            forecastQuery(lon, lat, forecastUrl);
        });
}


function forecastQuery(lon, lat, url) {
    url = url + lat + "&lon=" + lon + "&exclude=current,minutely,hourly&appid=" + apiKey;
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
        });
}

apiQuery(queryUrl);