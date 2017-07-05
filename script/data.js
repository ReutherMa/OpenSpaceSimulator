/* 
This program is licensed under the GNU General Public License as described in the file „LICENSE“
Copyright (C) 2017 TH Nürnberg
Authors: Marius Reuther Franziska Braun, Lea Uhlenbrock, Selina Forster, Theresa Breitenhuber, Marco Lingenhöl
Contact: openspacesimulation@gmail.com
*/

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
    var data = {};
    $.ajax({
        url: url_var,
        async: false,
        dataType: 'json',
        success: function(output) {
            //console.log(output);
            data = output;
        }
    });
      return data;
}