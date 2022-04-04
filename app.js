'use strict';

const axios = require('axios');
const express = require('express');
const { data } = require('jquery');
const app = express();
const apiKey = 'b7977a6f9436fa283a943562f9bdb499';

// send html page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// send css styles
app.get('/styles', (req,res) => {
    res.sendFile(__dirname + '/public/style.css');
});

// send client side JS code
app.get('/client-code',(req,res) => {
    res.sendFile(__dirname + '/public/index.js');
});

// simple request for the forecast weather
app.get('/forecast', (req, res) => {
    // make axios call to OpenWeather API for our latitude and longitude
    // to get the forecast
    axios({
        method: 'get',
        url: 'https://api.openweathermap.org/data/2.5/onecall?lat=43.544804&lon=-80.248169&appid=' + apiKey
    }).then(function (response) {
        res.send(response.data);
    });
});

app.listen(5000);