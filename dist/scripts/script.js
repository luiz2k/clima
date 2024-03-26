"use strict";
const form = document.querySelector("form");
const button = document.querySelector("button[type=submit]");
const weather = document.querySelector(".weather");
const responseStatus = document.querySelector(".status");
const weatherCity = document.querySelector(".weather__city");
const weatherCurrent = document.querySelector(".weather__current");
const windAndHumidity = document.querySelector(".weather__wind-and-humidity");
const weatherMinMax = document.querySelector(".weather__min-max");
const hr = document.querySelector(".hr");
const API_KEY = "a48acbbc4f2afb650cbac486dd6e15ba";
const getIcons = (weather, country) => {
    const weatherIconURL = `https://openweathermap.org/img/wn/${weather}@2x.png`;
    const flagIconURL = `https://flagcdn.com/${country}.svg`;
    return { weatherIconURL, flagIconURL };
};
const setWeather = (data) => {
    // Define a cidade e a bandeira do pais
    const weatherCitySpan = weatherCity.querySelector("span");
    weatherCitySpan.innerText = data.city;
    const countryFlag = weatherCity.querySelector("img");
    countryFlag.src = data.country_icon;
    // Define a temperatura atual eo ícone do clima
    const weatherCurrentSpan = weatherCurrent.querySelectorAll("span");
    weatherCurrentSpan[0].innerText = String(data.current_temp);
    weatherCurrentSpan[1].innerText = data.description;
    const weatherIcon = weatherCurrent.querySelector("img");
    weatherIcon.src = data.weather_icon;
    // Define a umidade e velocidade do vento
    const windAndHumiditySpan = windAndHumidity.querySelectorAll("span");
    windAndHumiditySpan[0].innerText = String(data.umidity);
    windAndHumiditySpan[1].innerText = String(data.wind_speed);
    // Define a temperatura mínima e máxima
    const weatherMinSpan = weatherMinMax.querySelectorAll("span");
    weatherMinSpan[0].innerText = String(data.temp_min);
    weatherMinSpan[1].innerText = String(data.temp_max);
};
const getWeather = async (city) => {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&lang=pt_br&units=metric`);
        if (response.status === 404) {
            throw new Error("Cidade não encontrada, tente novamente!");
        }
        const data = await response.json();
        const weather_icon = data.weather[0].icon;
        const country_icon = data.sys.country;
        const icons = getIcons(weather_icon, country_icon);
        const formattedData = {
            city: data.name,
            description: data.weather[0].description,
            current_temp: parseInt(data.main.temp),
            temp_min: parseInt(data.main.temp_min),
            temp_max: parseInt(data.main.temp_max),
            country_icon: icons.flagIconURL.toLowerCase(),
            weather_icon: icons.weatherIconURL,
            umidity: data.main.humidity,
            wind_speed: data.wind.speed,
        };
        return formattedData;
    }
    catch (error) {
        if (error instanceof Error) {
            responseStatus.innerText = error.message;
            responseStatus.setAttribute("class", "status error");
        }
        return null;
    }
};
form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const city = formData.get("city");
    if (city.length <= 0) {
        responseStatus.innerText = "Por favor, informe uma cidade.";
        responseStatus.setAttribute("class", "status warning");
        responseStatus.classList.remove("hidden");
        return;
    }
    const weatherData = await getWeather(city);
    if (!weatherData) {
        return null;
    }
    setWeather(weatherData);
    responseStatus.innerText = "Clima obtido com sucesso!";
    responseStatus.setAttribute("class", "status success");
    responseStatus.classList.remove("hidden");
    weather.classList.remove("hidden");
    hr.classList.remove("hidden");
});
