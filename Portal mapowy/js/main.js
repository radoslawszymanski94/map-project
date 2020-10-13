let $mapZoom = 9;
let $map;
let $showSearchBoxBtn;
let $searchBox;
let $closeWindowBtn;
let $clearInputBtn;
let $searchBtn;
let $searchInput;
let $latitude = 51.5;
let $longitude = 0;
let $marker;
let $popupMessage;
let $infoText;
let $apiUrl;
let $city;
let $cityInfo;
let $addMarkerBtn;
let $removeMarkerBtn;


const main = () => {
    prepareDOMElements();
    prepareDOMEvents();
};

const prepareDOMElements = () => {
    $map = L.map('map').setView([$latitude, $longitude], $mapZoom);
    let tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo($map);
    $showSearchBoxBtn = document.querySelector('.showSearchBoxBtn');
    $searchBox = document.querySelector('.searchBox');
    $closeWindowBtn = document.querySelector('.closeWindowBtn');
    $clearInputBtn = document.querySelector('#clearInputBtn');
    $searchBtn = document.querySelector('#searchBtn');
    $searchInput = document.querySelector('#searchInput');
    $infoText = document.querySelector('.info');
    $addMarkerBtn = document.querySelector('.addMarkerBtn');
    $removeMarkerBtn = document.querySelector('.removeMarkerBtn');
}

const prepareDOMEvents = () => {
    $showSearchBoxBtn.addEventListener('click', showSearchBox);
    $closeWindowBtn.addEventListener('click', hideSearchBox);
    $clearInputBtn.addEventListener('click', clearInput);
    $searchInput.addEventListener('input', disableButton);
    $searchBtn.addEventListener('click', showCityOnMap);
    $searchInput.addEventListener('keyup', searchOnKey);
    $addMarkerBtn.addEventListener('click', addMarker);
    $removeMarkerBtn.addEventListener('click', deleteMarker);
};

function setMapView() {
    $map.setView([$latitude, $longitude], $mapZoom);
    $addMarkerBtn.disabled = false;
    $removeMarkerBtn.disabled = false;
};

function addMarker() {
    $marker.addTo($map)
        .bindPopup(`${$cityInfo}`)
        .openPopup();
};

function deleteMarker() {
    $map.removeLayer($marker);
};

function showSearchBox() {
    $searchBox.classList.remove('hide');
    $searchBox.classList.toggle('show');
    $showSearchBoxBtn.classList.add('hide');
};

function hideSearchBox() {
    $searchBox.classList.remove('show');
    $searchBox.classList.add('hide');
    $showSearchBoxBtn.classList.remove('hide');
    $infoText.classList.add('hide');
    $searchInput.value = '';
};

function clearInput() {
    $searchInput.value = '';
    $clearInputBtn.disabled = true;
    $infoText.classList.add('hide');
};

function disableButton() {
    if ($searchInput.value != '') {
        $clearInputBtn.disabled = false;
        $infoText.classList.add('hide');
    } else {
        $clearInputBtn.disabled = true;
    }
};

function getCityFromInput() {
    if ($searchInput.value != '') {
        $city = $searchInput.value;
        $infoText.classList.add('hide');
    } else {
        $infoText.classList.remove('hide');
        $infoText.innerText = 'Nie wprowadzono żadnej nazwy miasta!'
    };
};

function createAPIUrl(city) {
    $apiUrl = `https://geocoder.ls.hereapi.com/6.2/geocode.json?city=${city}&apiKey=6X6Y6p6mOXbbXsnvZUmvkkucdVfcgUeAullbSpeIg60`;
};

async function showCityOnMap() {
    try {
        getCityFromInput();
        createAPIUrl($city);
        const response = await fetch($apiUrl);
        const json = await response.json();
        $latitude = await json.Response.View[0].Result[0].Location.DisplayPosition.Latitude;
        $longitude = await json.Response.View[0].Result[0].Location.DisplayPosition.Longitude;
        $cityInfo = await json.Response.View[0].Result[0].Location.Address.Label;
        $marker = L.marker([$latitude, $longitude]);
        setMapView();
    } catch (e) {
        $infoText.classList.remove('hide');
        if ($searchInput.value != '') {
            $infoText.innerText = 'Nazwa miasta jest prawdopodobnie nieprawidłowa!';
        }
        console.log(e);
    };
};

function searchOnKey(e) {
    if (e.keyCode === 13) {
        showCityOnMap();
        hideSearchBox();
    };
};

document.addEventListener('DOMContentLoaded', main);