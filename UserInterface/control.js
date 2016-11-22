var global = {keyUp:false, keyDown:false, keyLeft:false, keyRight:false, keyRollLeft:false, keyRollRight:false, keyGas:false, keyBreak:false, keyStartPause:false};

var keyCode = {w:87, s:83, a:65, d:68, q:81, e:69, space:32, b:66, enter:13};

$(document).ready(function(){
    $(document).keydown(function(e){
        switch(e.keyCode){
            case keyCode.w: 
                global.keyUp = true;
                break;
            case keyCode.s:
                global.keyDown = true;
                break;
            case keyCode.a:
                global.keyLeft = true;
                break;
            case keyCode.d:
                global.keyRight = true;
                break;
            case keyCode.q:
                global.keyRollLeft = true;
                break;
            case keyCode.e:
                global.keyRollRight = true;
                break;
            case keyCode.space:
                global.keyGas = true;
                break;
            case keyCode.b:
                global.keyBreak = true;
                break;
            case keyCode.enter:
                if(global.keyStartPause == false){
                    global.keyStartPause = true;
                }else{
                    global.keyStartPause = false;
                }
        }
    });

    $(document).keyup(function(e){
        switch(e.keyCode){
            case keyCode.w: 
                global.keyUp = false;
                break;
            case keyCode.s:
                global.keyDown = false;
                break;
            case keyCode.a:
                global.keyLeft = false;
                break;
            case keyCode.d:
                global.keyRight = false;
                break;
            case keyCode.q:
                global.keyRollLeft = false;
                break;
            case keyCode.e:
                global.keyRollRight = false;
                break;
            case keyCode.space:
                global.keyGas = false;
                break;
            case keyCode.b:
                global.keyBreak = false;
                break;     
        }
        alert(global.keyGas)
    });
    
    
});