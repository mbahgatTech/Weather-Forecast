$(function() {
    let location = {"lon":79.3871,"lat":43.6426};
    let forecast = {};
    
    $.ajax({
        type: 'get',
        dataType: 'json',
        url: 'http://ip-api.com/json/',
        async: false,
        success: function(response) {
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
        console.log(forecast);
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
