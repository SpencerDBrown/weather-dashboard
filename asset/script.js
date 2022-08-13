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
    let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
    var todaysweatherEl = document.getElementById("current-weather");
    var fivedayEl = document.getElementById("weekly-forecast");

    const APIkey = "6d7bbb40a531db93706ce98c2e21429f";

    function retrieveWeather(cityName) {
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIkey;
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
                currentIconEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png");
                currentIconEl.setAttribute("alt", response.data.weather[0].description);
                // THE DATA DISPLAYING TEMP + HUMIDITIY + WIND SPEED
                currentTempEl.innerHTML = "Temperature: " + k2f(response.data.main.temp) + " &#176F";
                currentHumEl.innerHTML = "Humidity: " + response.data.main.humidity + "%";
                currentWindEl.innerHTML = "Wind Speed: " + response.data.wind.speed + " MPH";


                // RETREVING THE UV INDEX
                let lon = response.data.coord.lon;
                let lat = response.data.coord.lat;
                let UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIkey + "&cnt=1";
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
                        currentUvEl.innerHTML = "UV Index: ";
                        currentUvEl.append(UVIndex);
                    });
                
                //RETREVING THE WEEKLY FORECAST
                let cityID = response.data.id;
                let forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIkey;
                axios.get(forecastQueryURL)
                    .then(function (response) {
                        fivedayEl.classList.remove("d-none");

                        //PARSE RESPONSE FOR WEEKLY FORECAST
                        const forecastEls = document.querySelectorAll(".forecast");

                        for (i = 0; i < forecastEls.length; i++) {
                            forecastEls[i].innerHTML = "";
                            const forecastDay = forecastDate.getDate();
                            const forecastMonth = forecastDate.getMonth() + 1;
                            const forecastYear = forecastDate.getFullYear();
                            const forecastIndex = i * 8 + 4;
                            const forecastDate = new Date(response.data.list[forecastIndex].dt * 1000);
                            const forecastDateEl = document.createElement("p");

                            forecastDateEl.setAttribute("class", "mt-2 mb-0 forecast-date");
                            forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
                            forecastEls[i].append(forecastDateEl);

                            // ICONS FOR THE CURRENT WEATHER
                            const forecastWeatherEl = document.createElement("img");
                            const forecastTempEl = document.createElement("p");
                            const forecastHumidityEl = document.createElement("p");

                            forecastWeatherEl.setAttribute("src", "https://openweathermap.org/img/wn/" + response.data.list[forecastIndex].weather[0].icon + "@2x.png");
                            forecastWeatherEl.setAttribute("alt", response.data.list[forecastIndex].weather[0].description);
                            forecastEls[i].append(forecastTempEl);
                            forecastHumidityEl.innerHTML = "Humidity: " + response.data.list[forecastIndex].main.humidity + " %";
                            forecastEls[i].append(forecastHumidityEl);    
                            forecastEls[i].append(forecastWeatherEl);
                            forecastTempEl.innerHTML = "Temp: " + k2f(response.data.list[forecastIndex].main.temp) + " &#176F";

                        }

                            // RETRIEVE ANY STORED HISTORY
                            searchEl.addEventListener("click", function () {
                                const searchTerm = cityEl.value;
                                retrieveWeather(searchTerm);
                                searchHistory.push(searchTerm);
                                localStorage.setItem("search", JSON.stringify(searchHistory));
                                loadSearchHistory();
                            })

                            // CLEAR HISTORY BUTTON
                            clearEl.addEventListener("click", function () {
                                localStorage.clear();
                                searchHistory = [];
                                loadSearchHistory();
                            })

                            function loadSearchHistory() {
                                historyEl.innerHTML = "";
                                for (let i = 0; i < searchHistory.length; i++) {
                                    const historyItem = document.createElement("input");
                                    historyItem.setAttribute("class", "form-control d-block bg-white");
                                    historyItem.setAttribute("value", searchHistory[i]);
                                    historyItem.setAttribute("type", "text");
                                    historyItem.setAttribute("readonly", true);
                                    historyItem.addEventListener("click", function () {
                                        retrieveWeather(historyItem.value);
                                    })
                                    historyEl.append(historyItem);
                                }
                            }
                            // FUNCTION CALL TO LOAD / DISPLAY HISTORY
                            loadSearchHistory();
                            if (searchHistory.length > 0) {
                                retrieveWeather(searchHistory[searchHistory.length - 1]);
                            }

                            function k2f(K) {
                                return Math.floor((K - 273.15) * 1.8 + 32);
                            }
init();