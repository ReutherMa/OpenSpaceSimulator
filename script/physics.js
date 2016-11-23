var gravConst = 6.673e-11;
var ctr = 0;
/*//initial values on game start
var rocket = saturnV;
//var rocket_mass = rocket.mass
var fuel_mass = rocket.stage1.mass_fuel;

var keyPressed; //wasdqe
var position; //vec3

//in radiant
var angleX = 0;
var angleY = 0;
var angleZ = 0;

//acceleration of orientation
//int
var accelOX;
var accelOY;
var accelOZ;*/

// calculate gravitational forces
    /** 
        iterates through all space objects and calculates influence on current object and object's speed and direction
        r: distance between objects in x, y, z dimensions
        dist: absolute distance
        accel: acceleration of current object
        
    **/
function calculateGravitation (difftime, spaceObjects, spaceObject) {
    
    //dependant on class definition/structure; based on project proposal
    if (spaceObject.mass === undefined || spaceObject.name === "sun"){
        return;   
    }
 
    for (var o in spaceObjects) {
        
        //dependant on class definition/structure; based on project proposal
        if (spaceObject.name === spaceObjects[o].name){
            continue;   
        }
        //console.log(spaceObject.group.position.x);
        //console.log(spaceObject.name);
            
        var rx      = spaceObjects[o].group.position.x - spaceObject.group.position.x;
        var ry      = spaceObjects[o].group.position.y - spaceObject.group.position.y;
        var rz      = spaceObjects[o].group.position.z - spaceObject.group.position.z;
        var dist2   = rx * rx + ry * ry + rz * rz;
       
        var mindist2= spaceObjects[o].radius + spaceObject.radius;
        mindist2 *= mindist2;
        
        //if dist is > mindist
        if (dist2 > mindist2){
            var accel   = gravConst * spaceObjects[o].mass / dist2;
            var dist    = Math.sqrt ( dist2 );

            dist = 1 / dist;

            spaceObject.speedx += accel * rx * dist * difftime;
            spaceObject.speedy += accel * ry * dist * difftime;
            spaceObject.speedz += accel * rz * dist * difftime;
            
            spaceObject.group.position.x += spaceObject.speedx * difftime;
            spaceObject.group.position.y += spaceObject.speedy * difftime;
            spaceObject.group.position.z += spaceObject.speedz * difftime;
        }
        
        dist = 1 / dist;
        spaceObject.speedx += accel * rx * dist * difftime;
        spaceObject.speedy += accel * ry * dist * difftime;
        spaceObject.speedz += accel * rz * dist * difftime;
        
        //movement in x direction
        //spaceObject.group.position.x += 1000000;
        spaceObject.group.position.x += spaceObject.speedx * difftime;
        spaceObject.group.position.y += spaceObject.speedy * difftime;
        spaceObject.group.position.z += spaceObject.speedz * difftime;
    }  
}

    

/**
Rocket Science
part 1: acceleration of direction and new position

**/

/*
function move(throttleInPercent){
    
//calculates fuel-mass that will be lost in difftime
mass_lost=difftime/saturnV.stage1.burningtime*throttleInPercent*rocket.stage1.mass_fuel;
//checks if enough fuel
if((fuel_mass-mass_lost)>=0){
//a=F/m(now mass WITH fuel to lose)
accel=saturnV.stage1.thrust/(mass);
//new mass without lost fuel
mass=mass-mass_lost;
//current fuel mass for UI
fuel_mass=fuel_mass-mass_lost;
}
else{
//error: not enough fuel
}
    //new rocket position; orientation is probably a matrix 
    vec3 position_rocket=vec3((position_rocket+(accel*difftime))*orientation); 
}

/**
Rocket Science
part 2: orientation
input: keyPressed(WASDQE) and position(as vec3)
**/

/*function rotateRocket(keyPressed, position){
    var quaternion = new THREE.Quaternion();
    
    switch(keyPressed){
        case w:
            accelOX=accelOX+Math.PI/20;
            angleX=angleX+accelOX*difftime*difftime;
            angle=angleX;
            accel=accelOX;
            quaternion.setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), angleX);
            break;
            
        case s:
            accelOX=accelOX-Math.PI/20;
            angleX=angleX+accelOX*difftime*difftime;
            quaternion.setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), angleX);
            break; 
            
        case q:
            accelOY=accelOY+Math.PI/20;
            angleY=angleY+accelOY*difftime*difftime;
            quaternion.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), angleY);
            break;
            
        case e:
            accelOY=accelOY-Math.PI/20;
            angleY=angleY+accelOY*difftime*difftime;
            quaternion.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), angleY);
            break;
            
        case a:
            accelOZ=accelOZ+Math.PI/20;
            angleZ=angleZ+accelOZ*difftime*difftime;
            quaternion.setFromAxisAngle( new THREE.Vector3( 0, 0, 1 ), angleZ);
            break;
            
        case d:
            accelOZ=accelOZ-Math.PI/20;
            angleZ=angleZ+accelOZ*difftime*difftime;
            quaternion.setFromAxisAngle( new THREE.Vector3( 0, 0, 1 ), angleZ);
            break;
    }
    position.applyQuaternion(quaternion);
    
}
*/

//called during every rendering
function calculatePhysics(difftime, spaceObjects){
    //get values from UI:buttons pressed
    
    //calculates current speed for each space Object(Planets, Rocket)
    for (var i in spaceObjects) {
        //console.log(i);
        var spaceObject = spaceObjects[i];
        calculateGravitation(difftime, spaceObjects, spaceObject);
    }
    //move(getThrottleOnPercent);
    //roateRocket(getKeyPressed, position_rocket);
}

//next stage: UI-Event, initiated by user
//for stage 1/2
function nextStage(){
    //wie kann man das generischer machen?
    mass=mass-rocket.stage1.mass_empty-rocket.stage1.mass_fuel;
}