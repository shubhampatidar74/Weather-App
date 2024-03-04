let search_icons = document.querySelector(".search_icons");
let weather_img = document.querySelector("#weather_img");
let temp = document.querySelector("#temp");
let day = document.querySelector("#day");
let weather_condition = document.querySelector("#weather_condition");
let humidity = document.querySelector("#humidity");
let sunrise_val = document.querySelector("#sunrise_val");
let sunset_val = document.querySelector("#sunset_val");
let visibilty_val = document.querySelector("#visibilty_val");
let wind_speed = document.querySelector("#wind_speed");
let pressure_val = document.querySelector("#pressure_val");
let cdate = document.querySelector("#date");
let cday = document.querySelector("#day");
let current_location = document.querySelector("#current_location");

const dayList = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const imgList = ["01d", "02d", "03d", "04d", "09d", "10d", "11d", "13d", "50d", "01n", "02n", "03n", "04n", "09n", "10n", "11n", "13n", "50n"];

function findLocation(position) {
    let lati = position?.coords?.latitude;
    let longi = position?.coords?.longitude;
    findWeather(lati, longi);
} 

function locationFaild() {
    console.log("There Was Some issue");
}

function latlon() {
    navigator.geolocation.getCurrentPosition(findLocation, locationFaild);
}

search_icons.addEventListener("click", () => {
    findWeather();
});

window.addEventListener("load", () => {
    latlon();
});

async function findWeather(lati, longi) {
    let url;
    if (lati && longi) {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lati}&lon=${longi}&appid=00e0d64a3f1167042b391002d5985fce`;
    } else {
        let city = document.querySelector("#searchdata").value;
        url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=00e0d64a3f1167042b391002d5985fce`;
    }

    const options = {
        method: "GET",
    }

    try {
        const responce = await fetch(url, options);
        const result = await responce.json();
        findweatherData(result);
    } catch (error) {
        console.log(error);
    }
}

function findweatherData(result) {
    let weatherIcon = result.weather[0].icon;
    for (let index = 0; index < imgList.length; index++) {
        if (imgList[index] == weatherIcon) {
            weather_img.src = `img/${imgList[index]}.png`;
        }
    }
    let tmp = result.main.temp - 273.15;
    temp.innerHTML = Math.floor(tmp) + "<sup>℃</sup>";

    let humid = result.main.humidity;
    humidity.innerHTML = humid + "%";

    let weatherCondition = result.weather[0].main;
    weather_condition.innerHTML = weatherCondition;

    let sunriseTime = result.sys.sunrise;
    let sunsetTime = result.sys.sunset;
    sunriseSunset(sunriseTime, sunsetTime);

    let visibility = result.visibility / 1000;
    visibilty_val.innerHTML = visibility + " km";

    var windSpeedMs = result.wind.speed;
    var windSpeedKmh = windSpeedMs * 3.6;
    wind_speed.innerHTML = Math.floor(windSpeedKmh) + " km/h";

    let pressureData = result.main.pressure;
    pressure_val.innerHTML = pressureData + " hPa";

    current_location.innerHTML = "City: " + result.name;
}

function sunriseSunset(sunr, suns) {
    var millisecondsSunr = sunr * 1000;
    var millisecondsSuns = suns * 1000;

    var dateObjectSunr = new Date(millisecondsSunr);
    var dateObjectSuns = new Date(millisecondsSuns);

    var localTimeSunr = dateObjectSunr.toLocaleTimeString();
    var localTimeSuns = dateObjectSuns.toLocaleTimeString();

    let clockData = new Date();
    let date = clockData.getDate();
    let month = clockData.getMonth() + 1;
    let year = clockData.getFullYear();
    let day = clockData.getDay();

    cdate.innerHTML = date + "/" + month + "/" + year;

    cday.innerHTML = dayList[day];

    sunrise_val.innerHTML = localTimeSunr;
    sunset_val.innerHTML = localTimeSuns;
}

