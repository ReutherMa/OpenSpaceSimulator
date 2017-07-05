/* 
This program is licensed under the GNU General Public License as described in the file „LICENSE“
Copyright (C) 2017 TH Nürnberg
Authors: Marius Reuther Franziska Braun, Lea Uhlenbrock, Selina Forster, Theresa Breitenhuber, Marco Lingenhöl
Contact: openspacesimulation@gmail.com
*/




function checkUserActions(){
    if(globalInterfaceValues.keyStartPause){
    pause();
}

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
    console.log("paused");
}

function resume(){
    paused=false;
}
}