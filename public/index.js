$(function() {
    $.ajax({
        type: 'get',         
        dataType: 'json',    
        url: '/forecast',   
        success: function (data) {
            console.log(data);
            console.log("Fetching forecast success.");
        },
        fail: function(error) {
            alert('Failed to load the forecast.');
            console.log(error); 
        }
    });
});