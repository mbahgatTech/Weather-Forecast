'use strict';

const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const app = express();
const apiKey = '12f209085f868d7f472980d4e0f0d559';
const port = process.env.PORT || 5000

app.use(fileUpload());
app.use(express.static(__dirname + '/uploads'));

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
    let location = req.query;
    let returnData = {};

    // make axios call to OpenWeather API for our latitude and longitude
    // to get the forecast
    try {
        axios({
            method: 'get',
            url: `https://api.openweathermap.org/data/2.5/onecall?lat=${location.lat}&lon=${location.lon}&units=metric&appid=` + apiKey
        }).then(function (response) {
            try {
                // create an array of days and include the relevant weather 
                // informationfor of each day to our app 
                returnData.daily = [];
                for (let curr of response.data.daily) { 
                    let day = {};
                    day.humidity = curr.humidity;
                    day.max = curr.temp.max;
                    day.min = curr.temp.min;
                    day.snow = curr.snow;
                    day.rain = curr.rain;
                    day.weather = curr.weather;
                    
                    returnData.daily.push(day);
                }
                
                // create a today element that has the weather information for the current day
                returnData.current = {};
                returnData.current.temp = response.data.current.temp;
                returnData.current.feels_like = response.data.current.feels_like;
                returnData.current.humidity = response.data.current.humidity;
                returnData.current.sunrise = response.data.current.sunrise;
                returnData.current.sunset = response.data.current.sunset;
                returnData.current.clouds = response.data.current.clouds;
                returnData.current.weather = response.data.current.weather;
                
                return res.status(200).send(returnData);
            }
            catch(err) {
                console.log(err);
                throw err;
            }
    
        }).catch(function (error) {
            console.log('heeerrr');
            console.log(error.message);
            return res.status(500).send(error.message);
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).send(e);
    }
});
    
app.listen(port);