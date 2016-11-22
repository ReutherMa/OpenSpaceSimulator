var v = 0;
var vx = 0;
var vy = 0;
var vz = 0;
var w = 119;
var s = 115;
var a = 97;
var d = 100;
var q = 113;
var e = 101;
var space = 32;
var b = 98;

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
            case b:
                v--;
                break;
        }
    });

    $(document).keyup(function(e1){
        alert("v=" + v + " vx=" + vx + " vy=" + vy + " vz=" + vz);
    });
});

// Problematik durch die Systemeinstellung kann die Tastenempfindlichkeit verändert werden --> evtl. Lösung mit Timer?