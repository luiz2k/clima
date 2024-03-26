const form = document.querySelector("form") as HTMLFormElement;

const button = document.querySelector(
  "button[type=submit]"
) as HTMLButtonElement;
const weather = document.querySelector(".weather") as HTMLSelectElement;

const responseStatus = document.querySelector(
  ".status"
) as HTMLParagraphElement;

const weatherCity = document.querySelector(
  ".weather__city"
) as HTMLSelectElement;

const weatherCurrent = document.querySelector(
  ".weather__current"
) as HTMLSelectElement;

const windAndHumidity = document.querySelector(
  ".weather__wind-and-humidity"
) as HTMLSelectElement;

const weatherMinMax = document.querySelector(
  ".weather__min-max"
) as HTMLSelectElement;

const hr = document.querySelector(
  ".hr"
) as HTMLHRElement;

const API_KEY: string = "a48acbbc4f2afb650cbac486dd6e15ba";

interface GetWeather {
  city: string;
  description: string;
  current_temp: number;
  temp_min: number;
  temp_max: number;
  country_icon: string;
  weather_icon: string;
  umidity: number;
  wind_speed: number;
}

interface Icons {
  weatherIconURL: string;
  flagIconURL: string;
}

const getIcons = (weather: string, country: string) => {
  const weatherIconURL: string = `https://openweathermap.org/img/wn/${weather}@2x.png`;
  const flagIconURL: string = `https://flagcdn.com/${country}.svg`;

  return { weatherIconURL, flagIconURL };
};

const setWeather = (data: GetWeather) => {
  // Define a cidade e a bandeira do pais
  const weatherCitySpan = weatherCity.querySelector("span") as HTMLSpanElement;
  weatherCitySpan.innerText = data.city;

  const countryFlag = weatherCity.querySelector("img") as HTMLImageElement;
  countryFlag.src = data.country_icon;

  // Define a temperatura atual eo ícone do clima
  const weatherCurrentSpan = weatherCurrent.querySelectorAll("span");
  weatherCurrentSpan[0].innerText = String(data.current_temp);
  weatherCurrentSpan[1].innerText = data.description;

  const weatherIcon = weatherCurrent.querySelector("img") as HTMLImageElement;
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

const getWeather = async (city: string): Promise<GetWeather | null> => {
  try {
    const response: Response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&lang=pt_br&units=metric`
    );

    if (response.status === 404) {
      throw new Error("Cidade não encontrada, tente novamente!");
    }

    const data = await response.json();

    const weather_icon: string = data.weather[0].icon;
    const country_icon: string = data.sys.country;

    const icons: Icons = getIcons(weather_icon, country_icon);

    const formattedData: GetWeather = {
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
  } catch (error) {
    if (error instanceof Error) {
      responseStatus.innerText = error.message;
      responseStatus.setAttribute("class", "status error");
    }

    return null;
  }
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData: FormData = new FormData(form);
  const city = formData.get("city") as string;

  if (city.length <= 0) {
    responseStatus.innerText = "Por favor, informe uma cidade.";
    responseStatus.setAttribute("class", "status warning");
    responseStatus.classList.remove("hidden");

    return;
  }

  const weatherData: GetWeather | null = await getWeather(city);

  if (!weatherData) {
    return null;
  }

  setWeather(weatherData);

  responseStatus.innerText = "Clima obtido com sucesso!";
  responseStatus.setAttribute("class", "status success");
  responseStatus.classList.remove("hidden");

  weather.classList.remove("hidden");
  hr.classList.remove("hidden")
});
