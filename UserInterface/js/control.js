/* 
This program is licensed under the GNU General Public License as described in the file „LICENSE“
Copyright (C) 2017 TH Nürnberg
Authors: Marius Reuther Franziska Braun, Lea Uhlenbrock, Selina Forster, Theresa Breitenhuber, Marco Lingenhöl
Contact: openspacesimulation@gmail.com
*/



var globalControlValues = {
    up: false,
    down: false,
    left: false,
    right: false,
    rollLeft: false,
    rollRight: false,
    throttle: false,
    throttleUp: false,
    throttleDown: false,
    brake: false,
    startPause: false,
    reset: false,
    quit: false,
    sound: false,
    sas: false,
    discardStage: false
};

var keyCode = {
    w: 87,
    s: 83,
    a: 65,
    d: 68,
    q: 81,
    e: 69,
    space: 32,
    b: 66,
    enter: 13,
    r: 82,
    x: 88,
    c: 67,
    alt: 18,
    shift: 16,
    ctrl: 17
};

//TODO: Quit setzen
$(document).ready(function() {
    $(document).keydown(function(e) {
        if ($(e.target).is('input, textarea, select'))
        {
        return true;
        } else {
         switch (e.keyCode) {
            case keyCode.w:
                globalControlValues.up = true;
                break;
            case keyCode.s:
                globalControlValues.down = true;
                break;
            case keyCode.a:
                globalControlValues.left = true;
                break;
            case keyCode.d:
                globalControlValues.right = true;
                break;
            case keyCode.q:
                globalControlValues.rollLeft = true;
                break;
            case keyCode.e:
                globalControlValues.rollRight = true;
                break;
            case keyCode.shift:
                globalControlValues.throttleUp = true;
                break;
            case keyCode.ctrl:
                globalControlValues.throttleDown = true;
                break;
            case keyCode.b:
                globalControlValues.brake = true;
                break;
            case keyCode.enter:
                if (globalControlValues.startPause == false) {
                    globalControlValues.startPause = true;
                } else {
                    globalControlValues.startPause = false;
                }
                break;
            case keyCode.r:
                if (globalControlValues.reset == false) {
                    globalControlValues.reset = true;
                } else {
                    globalControlValues.reset = false;
                }
                break;
            case keyCode.x:
                globalControlValues.sas = true;
                break;
            /*case keyCode.c:
                globalControlValues.discardStage = true;
                global.fuelPrompt = false;
                break;*/
        }   
        }
    });

    $(document).keyup(function(e) {
        if ($(e.target).is('input, textarea, select'))
        {
        return true;
        } else {
        switch (e.keyCode) {
            case keyCode.w:
                globalControlValues.up = false;
                break;
            case keyCode.s:
                globalControlValues.down = false;
                break;
            case keyCode.a:
                globalControlValues.left = false;
                break;
            case keyCode.d:
                globalControlValues.right = false;
                break;
            case keyCode.q:
                globalControlValues.rollLeft = false;
                break;
            case keyCode.e:
                globalControlValues.rollRight = false;
                break;
            case keyCode.shift:
                globalControlValues.throttleUp = false;
                break;
            case keyCode.ctrl:
                globalControlValues.throttleDown = false;
                break;
            case keyCode.b:
                globalControlValues.brake = false;
                break;
            case keyCode.x:
                globalControlValues.sas = false;
                break;
            case keyCode.c:
                globalControlValues.discardStage = true;
                global.fuelPrompt = false;
                break;
        }
}
    });

    /*$(document).keypress(function(e) {
        if(e.keyCode == keyCode.c){
            globalControlValues.discardStage = true;
            console.log("stage next");
        }
    });*/
    
    $("#contentBox .ui-button").mousedown(function(e) {
        switch (this.name) {
            case "up":
                globalControlValues.up = true;
                break;
            case "down":
                globalControlValues.down = true;
                break;
            case "left":
                globalControlValues.left = true;
                break;
            case "right":
                globalControlValues.right = true;
                break;
            case "rollLeft":
                globalControlValues.rollLeft = true;
                break;
            case "rollRight":
                globalControlValues.rollRight = true;
                break;
            case "throttle":
                globalControlValues.throttleUp = true;
                break;
            case "throttledown":
                globalControlValues.throttleDown = true;
                break;
            case "brake":
                globalControlValues.brake = true;
                break;
            case "startPause":
                if (globalControlValues.startPause == false) {
                    globalControlValues.startPause = true;
                } else {
                    globalControlValues.startPause = false;
                }
                break;
            case "sound":
                if (globalControlValues.sound == false) {
                    globalControlValues.sound = true;
                } else {
                    globalControlValues.sound = false;
                }
                break;
            case "reset":
                if (globalControlValues.reset == false) {
                    globalControlValues.reset = true;
                } else {
                    globalControlValues.reset = false;
                }
                break;
            case "sas":
                globalControlValues.sas = true;
                break;
        }

    });

    $(".gameBox .ui-button").mouseup(function(e) {
        switch (this.name) {
            case "up":
                globalControlValues.up = false;
                break;
            case "down":
                globalControlValues.down = false;
                break;
            case "left":
                globalControlValues.left = false;
                break;
            case "right":
                globalControlValues.right = false;
                break;
            case "rollLeft":
                globalControlValues.rollLeft = false;
                break;
            case "rollRight":
                globalControlValues.rollRight = false;
                break;
            case "throttle":
                globalControlValues.throttleUp = false;
                break;
            case "throttledown":
                globalControlValues.throttleDown = false;
                break;
            case "brake":
                globalControlValues.brake = false;
                break;
            case "sas":
                globalControlValues.sas = false;
                break;
            case "discardStageButton":
                globalControlValues.discardStage = true;
                global.fuelPrompt = false;
                console.log("discard: " + globalControlValues.discardStage + " fuel: " + global.fuelPrompt)
                break;
        }
        $(".btn").blur();
    });

});