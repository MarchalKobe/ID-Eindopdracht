let map, tiles, marker;
let html_latitude, html_longitude, html_altitude, html_velocity, html_body;
let html_mockup;
let darkmode;

const showISS = async () => {
    html_latitude = document.querySelector(".js-latitude");
    html_longitude = document.querySelector(".js-longitude");
    html_altitude = document.querySelector(".js-altitude");
    html_velocity = document.querySelector(".js-velocity");

    url = "https://api.wheretheiss.at/v1/satellites/25544";
    const data = await fetch(url).then(response => response.json()).catch(error => console.error("An error occured: ", error));
    let {latitude, longitude, altitude, velocity} = data;
    console.log(latitude);
    console.log(longitude);
    marker.setLatLng([latitude, longitude]);

    html_latitude.innerHTML = latitude.toFixed(2);
    html_longitude.innerHTML = longitude.toFixed(2);
    html_altitude.innerHTML = altitude.toFixed(2);
    html_velocity.innerHTML = velocity.toFixed(2);
};

const toggleDarkmode = () => {
    html_body = document.querySelector("body");

    let url, attribution;

    if(darkmode == false) {
        url = "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png";
        attribution = '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
        html_body.classList.add("c-darkmode");

        const icon = L.icon({
            iconUrl: 'img/png/iss-icon-white.png',
            iconSize: [75, 48],
            iconAnchor: [37, 24]
        });
        marker.setIcon(icon);

        darkmode = true;
    } else {
        url = "https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png";
        attribution = '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
        html_body.classList.remove("c-darkmode");
        
        const icon = L.icon({
            iconUrl: 'img/png/iss-icon-black.png',
            iconSize: [75, 48],
            iconAnchor: [37, 24]
        });
        marker.setIcon(icon);
        
        darkmode = false;
    }

    tiles = L.tileLayer(url, {attribution});
    tiles.addTo(map);
};

const listenToDarkMode = () => {
    let html_darkmode = document.querySelector(".js-darkmode");
    html_darkmode.addEventListener("click", toggleDarkmode);
};

const changeMockup = () => {
    if(darkmode) {
        html_mockup.src = "img/png/mockup_darkmode.png";
        darkmode = false;
    } else {
        html_mockup.src = "img/png/mockup_lightmode.png";
        darkmode = true;
    };
};

const init = () => {
    html_mockup = document.querySelector(".js-mockup");
    
    if(html_mockup) {
        darkmode = false;
        setInterval(changeMockup, 5000);
        return;
    };

    map = L.map('c-map').setView([0, 0], 2);

    const icon = L.icon({
        iconUrl: 'img/png/iss-icon-black.png',
        iconSize: [75, 48],
        iconAnchor: [37, 24]
    });
    marker = L.marker([0, 0], {icon: icon}).addTo(map);

    darkmode = true;
    toggleDarkmode();
    showISS();
    setInterval(showISS, 3000);

    listenToDarkMode();
};

document.addEventListener("DOMContentLoaded", init);