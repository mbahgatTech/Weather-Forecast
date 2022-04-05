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
    let location = req.query;
    console.log(location);

    // make axios call to OpenWeather API for our latitude and longitude
    // to get the forecast
    try {
        axios({
            method: 'get',
            url: `https://api.openweathermap.org/data/2.5/onecall?lat=${location.lat}&lon=${location.lon}&units=metric&appid=` + apiKey
        }).then(function (response) {
            try {
                let returnData = {};
    
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
                
                res.send(returnData);
            }
            catch(err) {
                console.log(err);
                res.send(err);
            }
    
        });
    }
    catch (e) {
        console.log(e);
        res.send(e);
    }
});
    
app.listen(5000);