var globalControlValues = {
    up: false,
    down: false,
    left: false,
    right: false,
    rollLeft: false,
    rollRight: false,
    throttle: false,
    brake: false,
    startPause: false,
    reset: false,
    quit: false
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
    r: 82
};

//TODO: Quit setzen
$(document).ready(function() {
    $(document).keydown(function(e) {
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
                globalControlValues.keyRollRight = true;
                break;
            case keyCode.space:
                globalControlValues.throttle = true;
                console.log("space pressed");
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
        }
    });

    $(document).keyup(function(e) {
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
            case keyCode.space:
                globalControlValues.throttle = false;
                break;
            case keyCode.b:
                globalControlValues.brake = false;
                break;
        }
    });

    $(".gameBox .ui-button").mousedown(function(e) {
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
                globalControlValues.keyRollRight = true;
                break;
            case "speed":
                globalControlValues.throttle = true;
                console.log("speed");
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
            case "reset":
                    if (globalControlValues.reset == false) {
                    globalControlValues.reset = true;
                } else {
                    globalControlValues.reset = false;
                }
                break;  
        }
        
    });
    
    $(".gameBox .ui-button").mouseup(function(e) {
        switch (this.name) {
               case "up":
                globalControlValues.up = false;
                console.log("up released");
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
                globalControlValues.keyRollRight = false;
                break;
            case "speed":
                globalControlValues.throttle = false;
                console.log("speed");
                break;
            case "brake":
                globalControlValues.brake = false;
                break;
        }
    });

});