function throttle(){
    throttleInPercent+=1;
    move(throttleInPercent);
}

function brake(){
    throttleInPercent-=1;
    move(throttleInPercent);
}

function rotate(keyPressed){
    //position=...?
    rotateRocket(keyPressed);
}

function slowTime(){
    if(timefactor>=2){
        timefactor-=1;
    }
}

function speedTime(){
    if(timefactor <=100000){
        timefactor+=1;
    }
}

function pause(){
    paused=true;
}

function resume(){
    paused=false;
}