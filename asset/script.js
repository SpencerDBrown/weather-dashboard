function init () {
    const cityEl = document.getElementById("input-city");
    const nameEl = document.getElementById("city-name");
    const searchEl = document.getElementById("primary-btn");
    const clearEl = document.getElementById("clear");
    const currentTempEl = document.getElementById("temp");
    const currentHumEl = document.getElementById("humidity");
    const currentWindEl = document.getElementById("wind-speed");
    const currentUvEl = document.getElementById("UV-index");
    const currentIconEl = document.getElementById("current-weather-icon");
    const APIkey = "";
    let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
    var todaysweatherEl = document.getElementById("current-weather");
    var fivedayEl = document.getElementById("weekly-forecast");

    function retrieveWeather(cityName) {
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
        axios.get(queryURL)
            .then(function (response) {


                todaysweatherEl.callList.remove("d-none");
                // THE PARSE RESPONSE FOR DISPLAYING "CURRENT WEATHER"
                const currentDay = new Date(response.data.dt * 1000);
                const day = currentDay.getData();
                const month = currentDay.getMonth() + 1;
                const year = currentDay.getFullYear();
                // THE INNER HTML TO SHOWCASE THE MONTH + DAY + YEAR
                nameEl.innerHTML = response.data.name + " (" + month + " /" + day + " /" + year + ")";
                let weatherIcon = response.data.weather[0].icon;
                currentIconsEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png");
                currentIconsEl.setAttribute("alt", response.data.weather[0].description);
                // THE DATA DISPLAYING TEMP + HUMIDITIY + WIND SPEED
                currentTempEl.innerHTML = "Temperature: " + k2f(response.data.main.temp) + " &#176F";
                currentHumEl.innerHTML = "Humidity: " + response.data.main.humidity + "%";
                currentWindEl.innerHTML = "Wind Speed: " + response.data.wind.speed + " MPH";


                // RETREVING THE UV INDEX
                let lon = response.data.coord.lon;
                let lat = response.data.coord.lat;
                let UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&cnt=1";
                axios.get(UVQueryURL)
                    .then(function (response) {
                        let UVindex = document.createElement("span");
                        if (response.data[0].value < 4) {
                            UVindex.setAttribute("class", "badge badge-success")
                        }
                        else if (response.data[0].value < 8) {
                            UVIndex.setAttribute("class", "badge badge-warning");
                        }
                        else {
                            UVIndex.setAttribute("class", "badge badge-danger");
                        }
                        console.log(response.data[0].value)
                        UVIndex.innerHTML = response.data[0].value;
                        currentUVEl.innerHTML = "UV Index: ";
                        currentUVEl.append(UVIndex);
                    });

    })
}

init()};