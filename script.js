
const apiKey = "your_api_key";

// 🔍 Search by city
async function getWeather() {
    const city = document.getElementById("city").value;

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod != 200) {
            alert("City not found!");
            return;
        }

        displayWeather(data);
        getHourly(city);

    } catch (error) {
        console.log(error);
    }
}



// # 📍 Auto Location
function getLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

            const response = await fetch(url);
            const data = await response.json();

            displayWeather(data);
        });
    }
}

// call automatically
getLocationWeather();



// # 🌤 Display Weather
function displayWeather(data) {
    const temp = data.main.temp;
    const weather = data.weather[0].description;
    const humidity = data.main.humidity;
    const wind = data.wind.speed;

    // icon
    const icon = getIcon(weather);

    // update UI
    document.getElementById("temp").innerHTML = `${temp}°`;
    document.getElementById("condition").innerHTML = `${icon} ${weather}`;
    document.getElementById("humidity").innerHTML = humidity;
    document.getElementById("wind").innerHTML = wind;

    setBackground(weather);
}



// # ☀️ Icons
function getIcon(weather) {
    if (weather.includes("rain")) return "🌧";
    if (weather.includes("cloud")) return "☁️";
    if (weather.includes("clear")) return "☀️";
    return "🌤";
}



// # 🎨 Dynamic Background
function setBackground(weather) {
    let bg = "";

    if (weather.includes("rain")) {
        bg = "url('https://images.unsplash.com/photo-1501696461415-6bd6660c6742')";
    } 
    else if (weather.includes("cloud")) {
        bg = "url('https://images.unsplash.com/photo-1499346030926-9a72daac6c63')";
    } 
    else {
        bg = "url('https://ik.imagekit.io/bu6kshmst/Embracing%20the%20beauty%20of%20nat....jpg')";
    }

    document.body.style.background = `${bg} no-repeat center/cover`;
}

//  Hourly Forecast
async function getHourly(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    const response = await fetch(url);
    const data = await response.json();

    let output = "";

    for (let i = 0; i < 5; i++) {
        const temp = data.list[i].main.temp;
        const time = data.list[i].dt_txt.split(" ")[1];

        output += `
            <div class="hour-box">
                <p>${time}</p>
                <p>${temp}°</p>
            </div>
        `;
    }

    document.getElementById("hourly").innerHTML = output;
}