const bar = document.querySelector(`button.fa-bars`);
const date = new Date();
const dayBox = document.querySelectorAll(`.box-date p:first-child`);
const dateBox = dayBox[0].nextElementSibling;
const months = [`January`, `February`,`March`,`April`, `May`, `June`, `July`, `August`, `September`,`October`, `November`,`December`]
const search = document.querySelector(`input[placeholder="find your location"]`);
const locationBTN = document.querySelector(`.location-btn`);
const noSupport = document.querySelector(`.no-support`);


bar.addEventListener(`click`, function () {
    mobileUl.classList.toggle(`d-none`);
    bar.classList.toggle(`active`);
});


for(let i = 0; i < dayBox.length; i++ ) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    dayBox[i].innerHTML= days[date.getDay() + i];
}
dateBox.innerHTML = `${date.getDate()}${months[date.getMonth()]}`;


search.addEventListener(`input`, eventInfo => {
    showTemp(eventInfo.target.value);
})

async function showTemp(location) {
    const images = document.querySelectorAll(`img[alt="weather img"]`);
    const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=878f1b7374494831b11121927242806&q=${location}&days=3`);
    const data = await response.json();
    const locationSTR = document.querySelector(`.location`);
    const tempSTR = document.querySelector(`.temp`);
    const state = document.querySelectorAll(`.state`);
    const spans = document.querySelectorAll(`.col-4 span`);
    const nextMaxTemp = document.querySelectorAll(`.max-temp`);
    const nextMinTemp = document.querySelectorAll(`.min-temp`);

    locationSTR.innerHTML = data.location.name;
    tempSTR.innerHTML = `${data.current.temp_c}<sup>o</sup>c`;
    images[0].src = data.current.condition.icon;
    state[0].innerHTML = data.current.condition.text;
    spans[0].innerHTML = `${data.current.precip_mm * 100/10}%`;
    spans[1].innerHTML = `${data.current.wind_kph}km/h`;
    switch (data.current.wind_dir[0]) {
        case "N":
            spans[2].innerHTML = "North";
            break;
        case "e":
            spans[2].innerHTML = "East";
            break;
        case "s":
            spans[2].innerHTML = "South";
            break;
        case "w":
            spans[2].innerHTML = "West";
            break;
    }
    nextMaxTemp[0].innerHTML = `${data.forecast.forecastday[1].day.maxtemp_c}<sup>o</sup>c`;
    nextMaxTemp[1].innerHTML = `${data.forecast.forecastday[2].day.maxtemp_c}<sup>o</sup>c`;
    nextMinTemp[0].innerHTML = `${data.forecast.forecastday[1].day.mintemp_c}<sup>o</sup>c`;
    nextMinTemp[1].innerHTML = `${data.forecast.forecastday[2].day.mintemp_c}<sup>o</sup>c`;
    state[1].innerHTML = data.forecast.forecastday[1].day.condition.text;
    state[2].innerHTML = data.forecast.forecastday[2].day.condition.text;
    images[1].src = data.forecast.forecastday[1].day.condition.icon;
    images[2].src = data.forecast.forecastday[2].day.condition.icon;

}

function hide () {
    noSupport.classList.add(`d-none`);
}


function place () {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition,showErr);
    }
    else {
        noSupport.innerHTML = "Geolocation is not supported by this browser.";
        noSupport.classList.remove(`d-none`)
        setTimeout(`hide()`, 5000);
        showTemp(`cairo`);
    }
}
const showErr =  err => {
    switch (err.code) {
        case err.PERMISSION_DENIED:
            noSupport.innerHTML = `please allow access to location`;
            noSupport.classList.remove(`d-none`);
            setTimeout(`hide()`, 5000);            
            showTemp(`cairo`);
            break;
        case err.POSITION_UNAVAILABLE:
            noSupport.innerHTML = `location information is unavailable`;
            noSupport.classList.remove(`d-none`);
            setTimeout(`hide()`, 5000)
            showTemp(`cairo`);
            break;
        case err.TIMEOUT:
            noSupport.innerHTML = `the request to get user location timed out`;
            noSupport.classList.remove(`d-none`);
            setTimeout(`hide()`, 5000);
            showTemp(`cairo`);
            break;
    }
}
const showPosition = async position => {
    let response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`);
    let data = await response.json();
    showTemp(data.address.state);
}


locationBTN.addEventListener(`click`, _ => place());
place()
