$(function() {
    let forecast = {};

    // default location is the CN Tower, Toronto
    let location = {
        "lon":79.3871, 
        "lat":43.6426, 
        "city":"Toronto", 
        "regionName":"Ontario"
    };
    
    // get the location of the user using their IP address
    // from ip-api
    $.ajax({
        type: 'get',
        dataType: 'json',
        url: 'http://ip-api.com/json/',
        success: function(response) {
            // get the forecast using the location
            location = response;
            getForecast(location);
        },
        fail: function(data) {
            getForecast(location);
            console.log('Failed to fetch the user\'s location.');
        }
    });
    
    // once the forecast has been given, show the values
    // in the gui
    $(document).ajaxComplete(function (event, xhr, settings) {
        if (!settings.url.includes("/forecast")) {
            return;
        }
        
        console.log(forecast);
        $('#temp-val').text(`${Math.round(forecast.current.temp)} °C`);
        $('#place-val').text(`${location.city}, ${location.regionName}`);
        
        // get the current day index
        let days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
        let date = new Date();
        let index = date.getDay();
        let today = true;
        
        // loop through all the days in the forecast and add their values
        // to the table. 
        for (let day of forecast.daily) {
            // get the name of the weekday
            let weekday = '';
            if (today) {
                weekday = 'Today';
                today = false;
            }
            else {
                weekday = days[index];
            }
            
            index = (index + 1) % 7;

            let div = `<div class="panel">
                            <div class="day text-left">
                                <strong>${weekday}</strong>
                            </div>
                            <div class="temp text-right">
                                <strong>${Math.round(day.max)} / ${Math.round(day.min)} °C</strong>
                            </div>
                        </div>`;
            
            $('#forecastPanel').append(div);
        }
    });

    function getForecast(location) {
        $.ajax({
            type: 'get',         
            dataType: 'json',    
            url: '/forecast',   
            data: location,
            success: function (data) {
                forecast = data;
                console.log("Fetching forecast success.");
            },
            fail: function(error) {
                alert('Failed to load the forecast.');
                console.log(error); 
            }
        });
    }
});
