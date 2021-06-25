let today = moment();
let city = "Lakeville";

const iconSrc = "http://openweathermap.org/img/wn/"
const units = "imperial";

const apiKey = "058dc32d2aa0d74282afc490c90bb317";

let weatherUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=" + units;

const forecastUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=";
let currentWeatherCard = $("#currentWeather");
let forecastRow = $("#forecast");

function currentWeatherQueryAndPopulation(url) {
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);

            let cityAndDate = $("<h1>");
            let weatherIcon = $("<img>");
            let temperature = $("<h4>");
            let windSpeed = $("<h4>");
            let humidity = $("<h4>");


            cityAndDate.attr("class", "card-title");
            cityAndDate.text(city + " (" + today.format("L") + ")");

            weatherIcon.attr("src", iconSrc + data.weather[0].icon + "@2x.png");

            temperature.attr("class", "card-text");
            temperature.text("Temp: " + data.main.temp + "°F");

            windSpeed.attr("class", "card-text");
            windSpeed.text("Wind: " + data.wind.speed + " MPH");

            humidity.attr("class", "card-text");
            humidity.text("Humidity: " + data.main.humidity + "%");




            cityAndDate.append(weatherIcon);
            currentWeatherCard.append(cityAndDate);
            currentWeatherCard.append(temperature);
            currentWeatherCard.append(windSpeed);
            currentWeatherCard.append(humidity);



            let lon = data.coord.lon;
            let lat = data.coord.lat;
            forecastQueryAndPopulation(lon, lat, forecastUrl);
        });
}

function forecastQueryAndPopulation(lon, lat, url) {
    url = url + lat + "&lon=" + lon + "&exclude=minutely,hourly&units=" + units + "&appid=" + apiKey;
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            let uvi = $("<h4>");
            uvi.attr("class", "card-text");
            uvi.text("UV Index: " + data.current.uvi);
            currentWeatherCard.append(uvi);
            
            console.log(data);
            for (let i = 0; i < 5; i++) {
                let day = data.daily[i];

                let forecastCard = $("<div>");
                let date = $("<h4>");
                let weatherIconHeader = $("<h6>");
                let weatherIcon = $("<img>");
                let temperature = $("<h5>");
                let windSpeed = $("<h5>");
                let humidity = $("<h5>");
    
                forecastCard.attr("class", "col-2 card");

                date.attr("class", "card-title");
                date.text("(" + today.add(1, "days").format("L") + ")");
    
                weatherIconHeader.attr("class", "forecast-image-heading");
                weatherIcon.attr("src", iconSrc + day.weather[0].icon + "@2x.png");
                weatherIcon.attr("class", "forecast-image");

                temperature.attr("class", "card-text");
                temperature.text("Temp: " + day.temp.day + "°F");
    
                windSpeed.attr("class", "card-text");
                windSpeed.text("Wind: " + day.wind_speed + " MPH");
    
                humidity.attr("class", "card-text");
                humidity.text("Humidity: " + day.humidity + "%");
    
                weatherIconHeader.append(weatherIcon);
                forecastCard.append(date);
                forecastCard.append(weatherIconHeader);
                forecastCard.append(temperature);
                forecastCard.append(windSpeed);
                forecastCard.append(humidity);
                forecastRow.append(forecastCard);
            }
        });
}



function citySearch(cityName) {
    city = cityName;
    let cityAndDate = $("<h1>");

}
console.log(today.format("L"));
currentWeatherQueryAndPopulation(weatherUrl);