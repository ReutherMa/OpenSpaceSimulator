var globalControlValues = {keyUp:false, keyDown:false, keyLeft:false, keyRight:false, keyRollLeft:false, keyRollRight:false, keyGas:false, keyBreak:false, keyStartPause:false};

var keyCode = {w:87, s:83, a:65, d:68, q:81, e:69, space:32, b:66, enter:13};

$(document).ready(function(){
    $(document).keydown(function(e){
        switch(e.keyCode){
            case keyCode.w: 
                globalControlValues.keyUp = true;
                break;
            case keyCode.s:
                globalControlValues.keyDown = true;
                break;
            case keyCode.a:
                globalControlValues.keyLeft = true;
                break;
            case keyCode.d:
                globalControlValues.keyRight = true;
                break;
            case keyCode.q:
                globalControlValues.keyRollLeft = true;
                break;
            case keyCode.e:
                globalControlValues.keyRollRight = true;
                break;
            case keyCode.space:
                globalControlValues.keyGas = true;
                break;
            case keyCode.b:
                globalControlValues.keyBreak = true;
                break;
            case keyCode.enter:
                if(globalControlValues.keyStartPause == false){
                    globalControlValues.keyStartPause = true;
                    console.log("paused");
                }else{
                    globalControlValues.keyStartPause = false;
                    console.log("resumed");
                }
        }
    });

    $(document).keyup(function(e){
        switch(e.keyCode){
            case keyCode.w: 
                globalControlValues.keyUp = false;
                break;
            case keyCode.s:
                globalControlValues.keyDown = false;
                break;
            case keyCode.a:
                globalControlValues.keyLeft = false;
                break;
            case keyCode.d:
                globalControlValues.keyRight = false;
                break;
            case keyCode.q:
                globalControlValues.keyRollLeft = false;
                break;
            case keyCode.e:
                globalControlValues.keyRollRight = false;
                break;
            case keyCode.space:
                globalControlValues.keyGas = false;
                break;
            case keyCode.b:
                globalControlValues.keyBreak = false;
                break;     
        }
    });
    
    
});