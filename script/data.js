function loadData(url_var, universe){
    var data = {};
    
    $.ajax({
        url: url_var,
        async: false,
        dataType: 'json',
        success: function(output) {
            for (e in output) {
                output[e].x *= 149597870700; // au in m 
                output[e].y *= 149597870700;
                output[e].z *= 149597870700;
                output[e].speedx *= 149597870700 / 86400; // au/day in m/s
                output[e].speedy *= 149597870700 / 86400;
                output[e].speedz *= 149597870700 / 86400;
            }
            //console.log(data);
            universe.init (output);
            universe.render();
        }
    });
    
/*     var arr = $.map(data, function(el) { 
        //console.log(el);
        return el; 
    }); */
    

}

function loadRocketData(url_var){
    
    $.ajax({
        url: url_var,
        async: false,
        dataType: 'json',
        success: function(output) {
            console.log(output);
            return output;
        }
    });
}