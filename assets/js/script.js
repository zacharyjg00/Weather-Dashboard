// Consts that are used throughout the code
const iconSrc = "http://openweathermap.org/img/wn/"
const units = "imperial";
const forecastUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=";
const apiKey = "058dc32d2aa0d74282afc490c90bb317";

// These are the selectors for the code which grabs the weather card so data can be changed as well as the forecast row to append forecast cards on to
let currentWeatherCard = $("#current-weather");
let forecastRow = $("#forecast");

// Instantiates the moment object to get today's date as well as changes the current city to be empty until the user submits a city
let today = moment();
let city = "";

// This function is the initial call to generate the current weather in a city card as well as populate it with the corresponding info
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
            cityAndDate.attr("id", "city-and-date");
            cityAndDate.text(data.name + " (" + today.format("L") + ")");

            weatherIcon.attr("src", iconSrc + data.weather[0].icon + "@2x.png");
            weatherIcon.attr("id", "weather-icon");

            temperature.attr("class", "card-text");
            temperature.attr("id", "weather-temp");
            temperature.text("Temp: " + data.main.temp + "°F");

            windSpeed.attr("class", "card-text");
            windSpeed.attr("id", "weather-wind-speed");
            windSpeed.text("Wind: " + data.wind.speed + " MPH");

            humidity.attr("class", "card-text");
            humidity.attr("id", "weather-humidity");
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

// This function generates the html for the 5-day forecast as well as populates it with the corresponding data
function forecastQueryAndPopulation(lon, lat, url) {
    url = url + lat + "&lon=" + lon + "&exclude=minutely,hourly&units=" + units + "&appid=" + apiKey;
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

            // UV index is populated here rather than in the weather call as the API call for the weather does not provide the UVI
            let uvi = $("<h4>");
            let uviText = $("<span>");
            uvi.attr("class", "card-text");
            uvi.attr("id", "weather-uvi");
            uviText.attr("id", "weather-uvi-text");

            if (data.current.uvi < 3) {
                uviText.attr("class", "uvi-low");
            } else if (data.current.uvi < 6) {
                uviText.attr("class", "uvi-medium");
            } else if (data.current.uvi < 8) {
                uviText.attr("class", "uvi-high");
            } else if (data.current.uvi < 11) {
                uviText.attr("class", "uvi-very-high");
            } else if (data.current.uvi > 10) {
                uviText.attr("class", "uvi-extremely-high");
            }

            uvi.text("UV Index: ");
            uviText.text(data.current.uvi);
            uvi.append(uviText);

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
                forecastCard.attr("id", "forecast-card-" + i);

                date.attr("class", "card-title");
                date.attr("id", "forecast-date-" + i);
                date.text("(" + today.add(1, "days").format("L") + ")");

                weatherIconHeader.attr("class", "forecast-image-heading");

                weatherIcon.attr("src", iconSrc + day.weather[0].icon + "@2x.png");
                weatherIcon.attr("class", "forecast-image");
                weatherIcon.attr("id", "forecast-image-" + i);

                temperature.attr("class", "card-text");
                temperature.attr("id", "forecast-temp-" + i);
                temperature.text("Temp: " + day.temp.day + "°F");

                windSpeed.attr("class", "card-text");
                windSpeed.attr("id", "forecast-wind-" + i);
                windSpeed.text("Wind: " + day.wind_speed + " MPH");

                humidity.attr("class", "card-text");
                humidity.attr("id", "forecast-humidity-" + i);
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

// This function grabs the city name and goes and searches for it in the API
function citySearch(cityName) {
    let weatherUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey + "&units=" + units;

    // This if statement determines if this is a first time call and the html needs to be generated or if the html just needs to be updated with a new cities data
    if (city == "") {
        city = cityName;
        currentWeatherQueryAndPopulation(weatherUrl);
    } else {
        city = cityName;
        today.subtract(5, "days");
        updateWeather(weatherUrl);
    }
}

// This function goes and updates the exisiting html as this is only called when the html does exist
function updateWeather(url) {
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);

            let cityAndDate = $("#city-and-date");
            let weatherIcon = $("#weather-icon");
            let temperature = $("#weather-temp");
            let windSpeed = $("#weather-wind-speed");
            let humidity = $("#weather-humidity");

            cityAndDate.text(data.name + " (" + today.format("L") + ")");

            weatherIcon.attr("src", iconSrc + data.weather[0].icon + "@2x.png");

            temperature.text("Temp: " + data.main.temp + "°F");

            windSpeed.text("Wind: " + data.wind.speed + " MPH");

            humidity.text("Humidity: " + data.main.humidity + "%");

            cityAndDate.append(weatherIcon);

            let lon = data.coord.lon;
            let lat = data.coord.lat;
            updateForecast(lon, lat, forecastUrl);
        });
}

// This function acts much in the same way as updateWeather. It updates the forecast cards if the html already exists
function updateForecast(lon, lat, url) {
    url = url + lat + "&lon=" + lon + "&exclude=minutely,hourly&units=" + units + "&appid=" + apiKey;
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            let uvi = $("#weather-uvi");
            let uviText = $("#weather-uvi-text")
            uviText.text(data.current.uvi);
            uvi.text("UV Index: ");
            uvi.append(uviText);

            if (data.current.uvi < 3) {
                uviText.attr("class", "uvi-low");
            } else if (data.current.uvi < 6) {
                uviText.attr("class", "uvi-medium");
            } else if (data.current.uvi < 8) {
                uviText.attr("class", "uvi-high");
            } else if (data.current.uvi < 11) {
                uviText.attr("class", "uvi-very-high");
            } else if (data.current.uvi > 10) {
                uviText.attr("class", "uvi-extremely-high");
            }

            console.log(data);
            for (let i = 0; i < 5; i++) {
                let day = data.daily[i];

                let date = $("#forecast-date-" + i);
                let weatherIcon = $("#forecast-image-" + i);
                let temperature = $("#forecast-temp-" + i);
                let windSpeed = $("#forecast-wind-" + i);
                let humidity = $("#forecast-humidity-" + i);

                date.text("(" + today.add(1, "days").format("L") + ")");

                weatherIcon.attr("src", iconSrc + day.weather[0].icon + "@2x.png");

                temperature.text("Temp: " + day.temp.day + "°F");

                windSpeed.text("Wind: " + day.wind_speed + " MPH");

                humidity.text("Humidity: " + day.humidity + "%");
            }
        });
}

// This function gets a city name as a parameter and then populates local storage with that city so the previously searched cities are kept track of
function setCityLocalStorage(cityName) {
    localStorage.setItem(cityName, cityName);
}

// This function clears all previous searches and then repopulates them by iterating through local storage and creates a card for all searches
function previousSearches() {
    $("#previous-searches").empty();
    for (let i = 0; i < localStorage.length; i++) {
        let previousCity = $("<h3>");
        previousCity.attr("class", "card cities");
        previousCity.attr("id", localStorage.key(i));
        previousCity.text(localStorage.key(i));
        $("#previous-searches").append(previousCity);
    }
}

// These are the event listeners for the webpage
// This listener waits for someone to click the submit button where it takes what the user inputted and passes it to the corresponding functions to display the appropriate data
$("#submit-button").on("click", function (event) {
    event.preventDefault();
    let cityObj = $("#inputted-city");
    let cityName = cityObj.val();
    console.log(cityName);
    citySearch(cityName);
    cityObj.val("");
    setCityLocalStorage(cityName);
    previousSearches();
});

// This listener is for when the user clicks on a previously searched city and it will then go and populate the html with the selected city.
$("#previous-searches").on("click", function (event) {
    event.preventDefault();
    console.log("Yes");
    let cityId = event.target.id;
    citySearch(cityId);
    previousSearches();
});

// previousSearches() is called here so that whenever the webpage is refreshed, all previous searches are still visible
previousSearches();