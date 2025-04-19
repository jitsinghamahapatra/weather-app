const searchInput = document.getElementById("search");
const searchBtn = document.getElementById("search-btn");

function hideLoader() {
    document.getElementById("loader").style.opacity = "0";
    setTimeout(() => {
        document.getElementById("loader").style.display = "none";
    }, 300);
}

function updateWeatherCard(data, city) {
    const current = data.forecast[0];
    document.querySelector(".city-name").textContent = city;
    document.querySelector(".date").textContent = new Date(current.time).toLocaleDateString("en-US", {
        weekday: "long", year: "numeric", month: "long", day: "numeric"
    });
    document.querySelector(".temperature").textContent = current.temperature;
    document.querySelector(".weather-condition").textContent = current.symbolPhrase;
    let iconUrl = "https://openweathermap.org/img/wn/01d@2x.png";
    if (current.symbol) {
        iconUrl = `https://developer.foreca.com/static/images/symbols/${current.symbol}.png`;
    }
    document.querySelector(".weather-icon").src = iconUrl;
    const details = document.querySelectorAll(".detail-item strong");
    details[0].textContent = `${current.relHumidity}%`;
    details[1].textContent = `${(current.windSpeed * 3.6).toFixed(1)} km/h`;
    details[2].textContent = `${current.feelsLikeTemp}°C`;
    details[3].textContent = `${(current.visibility / 1000).toFixed(1)} km`;
}

async function getLocationId(city) {
    const url = `https://foreca-weather.p.rapidapi.com/location/search/${city}?lang=en`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-host': 'foreca-weather.p.rapidapi.com',
            'x-rapidapi-key': 'c57719e4f2msh77ad7ec4da6b430p171477jsn644033cb5cac'
        }
    };
    const response = await fetch(url, options);
    const result = await response.json();
    if (!result.locations || result.locations.length === 0) throw new Error("City not found");
    return result.locations[0].id;
}

async function getWeather(city = "London") {
    try {
        const locationId = await getLocationId(city);
        const url = `https://foreca-weather.p.rapidapi.com/forecast/15minutely/${locationId}?alt=0&tempunit=C&windunit=MS&tz=Europe%2FLondon&periods=8&dataset=full`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-host': 'foreca-weather.p.rapidapi.com',
                'x-rapidapi-key': 'add your api key here'
            }
        };
        const response = await fetch(url, options);
        const result = await response.json();
        updateWeatherCard(result, city);
        hideLoader();
    } catch (error) {
        alert("City not found or failed to fetch data.");
        hideLoader();
    }
}

searchBtn.addEventListener("click", () => {
    const city = searchInput.value.trim().toLowerCase();
    if (city) getWeather(city);
});

searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        searchBtn.click();
    }
});

window.addEventListener("load", () => {
    getWeather();
});