/* 
This program is licensed under the GNU General Public License as described in the file „LICENSE“
Copyright (C) 2017 TH Nürnberg
Authors: Marius Reuther Franziska Braun, Lea Uhlenbrock, Selina Forster, Theresa Breitenhuber, Marco Lingenhöl
Contact: openspacesimulation@gmail.com
*/




var v = 0;
var vx = 0;
var vy = 0;
var vz = 0;
var w = 119; //drehung um x
var s = 115; //drehung um x
var a = 97; //drehung um z
var d = 100; //drehung um z 
var q = 113; // drehung um y
var e = 101; //drehung um y
var space = 32; //throttle
//var b = 98;

$(document).ready(function(){
    $(document).keypress(function(e){
        switch(e.which){
            case w: 
                vx++;
                break;
            case s:
                vx--;
                break;
            case a:
                vz--;
                break;
            case d:
                vz++;
                break;
            case q:
                vy--;
                break;
            case e:
                vy++;
                break;
            case space:
                v++;
                break;
            //case b:
            //    v--;
            //    break;
        }
    });

    $(document).keyup(function(e1){
        alert("v=" + v + " vx=" + vx + " vy=" + vy + " vz=" + vz);
    });
});

// Problematik durch die Systemeinstellung kann die Tastenempfindlichkeit verändert werden --> evtl. Lösung mit Timer?