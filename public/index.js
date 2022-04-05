$(function() {
    let forecast = {};

    // default location is the CN Tower, Toronto
    let location = {
        "lon":-79.3871, 
        "lat":43.6426, 
        "city":"Toronto", 
        "regionName":"Ontario"
    };
    
    // API calls are sent every minute to update the forecast
    // getIP();
    getForecast(location);
    
    // once the forecast has been given, show the values
    // in the gui
    $(document).ajaxComplete(function (event, xhr, settings) {
        if (!settings.url.includes("/forecast")) {
            return;
        }

        $('#temp-val').text(`${Math.round(forecast.current.temp)} °C`);
        $('#place-val').text(`${location.city}, ${location.regionName}`);
        $('#state-val').text(`${forecast.current.weather[0].main}`);
        
        // delete the old panels if any
        $('.panel').each(function () {
            $(this).remove();
        });
        
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
        
        // change the video on display based on the current weather
        if(forecast.current.weather[0].main === 'Thunderstorm' && $('#myVideo').attr('src') != '796570420.mp4'){
            $('#myVideo').attr('src', '796570420.mp4');
        }
        else if(forecast.current.weather[0].main === 'Clear' && $('#myVideo').attr('src') != '2021036812.mp4'){
            $('#myVideo').attr('src', '2021036812.mp4');
        }
        else if(forecast.current.weather[0].main === 'Snow' && $('#myVideo').attr('src') != '498109366.mp4'){
            $('#myVideo').attr('src', '498109366.mp4');
        }
        else if(['Rain', 'Drizzle'].includes(forecast.current.weather[0].main) && $('#myVideo').attr('src') != '1525097616.mp4'){
            $('#myVideo').attr('src', '1525097616.mp4');
        }
        else if(forecast.current.weather[0].main === 'Clouds' && $('#myVideo').attr('src') != '1013716848.mp4') {
            $('#myVideo').attr('src', '1013716848.mp4');
        }
        else if($('#myVideo').attr('src') === '') {
            $('#myVideo').attr('src', '1013716848.mp4');
        }

        setTimeout (getIP, 6000);
    });

    
    function getIP () {
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
            error: function(response) {
                getForecast(location);
                console.log('Failed to fetch the user\'s location.');
            }
        });
    }

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
            error: function(error) {
                getIP();
                console.log(error.message); 
            }
        });
    }
});
