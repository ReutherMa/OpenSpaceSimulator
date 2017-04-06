var gravConst = 6.673e-11;
var ctr = 0;
var timefactor = 1;
var rockets = loadRocketData("data/rockets.json");
var rocket = rockets.saturn5;

var saturnV = {
    fuel_total: rocket.stage1.mass_fuel + rocket.stage2.mass_fuel + rocket.stage3.mass_fuel,
    stage1: {
        mass_empty: rocket.stage1.mass_empty,
        mass_fuel: rocket.stage1.mass_fuel,
        burningtime: rocket.stage1.burningtime,
        thrust: rocket.stage1.thrust
    },
    stage2: {
        mass_empty: rocket.stage2.mass_empty,
        mass_fuel: rocket.stage2.mass_fuel,
        burningtime: rocket.stage2.burningtime,
        thrust: rocket.stage2.thrust
    },
    stage3: {
        mass_empty: rocket.stage3.mass_empty,
        mass_fuel: rocket.stage3.mass_fuel,
        burningtime: rocket.stage3.burningtime,
        thrust: rocket.stage3.thrust
    },
    height: rocket.height,
    mass_total: rocket.mass_total,
    thrust_launch: rocket.thrust_launch
};

var speed=0;
var keyPressed; //wasdqe
var position; //vec3

//in radiant
var angleX = 0;
var angleY = 0;
var angleZ = 0;

//acceleration of orientation
//int
var accelOX=0;
var accelOY=0;
var accelOZ=0;

var count = 0;

var xAxis;
var yAxis;
var zAxis;

var drehmoment = new THREE.Quaternion().set(0, 0, 0, 1).normalize();

var fuel_mass = saturnV.stage1.mass_fuel;
var mass = saturnV.mass_total;
var stage=1;
var throttle=0;

var speedx=0;
var speedy=0;
var speedz=0;


var angle_const = 2 * Math.PI / 20000;


// calculate gravitational forces
/** 
        iterates through all space objects and calculates influence on current object and object's speed and direction
        r: distance between objects in x, y, z dimensions
        dist: absolute distance
        accel: acceleration of current object
        
    **/
function calculateGravitation(difftime, spaceObjects, spaceObject) {

    //do objects have a mass || is it a star
    if (spaceObject.mass === undefined || spaceObject.name === "sun") {
        return;
    }

    for (var o in spaceObjects) {

if (spaceObject.name === spaceObjects[o].name) {
            continue;
        }
        var rx = spaceObjects[o].group.position.x - spaceObject.group.position.x;
        var ry = spaceObjects[o].group.position.y - spaceObject.group.position.y;
        var rz = spaceObjects[o].group.position.z - spaceObject.group.position.z;
        var dist2 = rx * rx + ry * ry + rz * rz;

        var mindist2 = spaceObjects[o].radius + spaceObject.radius;
        mindist2 *= mindist2;

        
        if (dist2 > mindist2) {
            var accelX = 0;
            accelX = gravConst * spaceObjects[o].mass / dist2;
            var dist = Math.sqrt(dist2);
            dist = 1 / dist;
            spaceObject.speedx += accelX * rx * dist * difftime;
            spaceObject.speedy += accelX * ry * dist * difftime;
            spaceObject.speedz += accelX * rz * dist * difftime;
        }
    }

    positionX = spaceObject.group.position.x += spaceObject.speedx * difftime;
    positionY = spaceObject.group.position.y += spaceObject.speedy * difftime;
    positionZ = spaceObject.group.position.z += spaceObject.speedz * difftime;

    //Calculate planet position for drawing ellipse
    spaceObject.addTrailPoint(positionX, positionY, positionZ);
}

function calculateGravitationRocket(difftime){
    for (var o in spaceObjects) {
        if (spaceObjects[o].name == "rocket") {
            continue;
        }
        if(spaceObjects[o].name == "earth"){
        var rx = spaceObjects[o].group.position.x - rocketGroup.position.x;
        var ry = spaceObjects[o].group.position.y - rocketGroup.position.y;
        var rz = spaceObjects[o].group.position.z - rocketGroup.position.z;
        var dist2 = rx * rx + ry * ry + rz * rz;
        var mindist = 1e-1;

        if (dist2 > mindist) {
            var accel = gravConst * spaceObjects[o].mass / dist2;
            if(ctr==0){accel=0;ctr++;}
            var dist = Math.sqrt(dist2);
            dist = 1 / dist;
            speedx += accel * difftime;
            speedy += accel * difftime;
            speedz += accel * difftime;
        }

        //rocket position before launch
        //if(launched){}
        //update rocket position
        }

        positionX = rocketGroup.position.x += speedx * difftime;
        positionY = rocketGroup.position.y += speedy * difftime;
        positionZ = rocketGroup.position.z += speedz * difftime;

        //planetPosition.push ( [spaceObject.name],[positionX, positionY, positionZ] );


        //Calculate planet position for drawing ellipse
    
        //rocketGroup.addTrailPoint(positionX, positionY, positionZ);
    }
}

/**
Rocket Science
part 1: acceleration of direction and new position

**/


function move(difftime, direction) {

    //calculates fuel-mass that will be lost in difftime
    var mass_lost = difftime / saturnV.stage1.burningtime * saturnV.stage1.mass_fuel * globalInterfaceValues.throttle;
    
    //checks if enough fuel
    
    
    
    if ((fuel_mass - mass_lost) >= 0) {
        //a=F/m(now mass WITH fuel to lose)
        accel = saturnV.stage1.thrust / (mass);
        //console.log("accel:"+accel);
        //console.log("mass:"+mass);
        //new mass without lost fuel
        mass = mass - mass_lost;
        //current fuel mass for UI
        fuel_mass = fuel_mass - mass_lost;
        //console.log("mass_lost:"+mass_lost);
    } else {
        //UI-prompt-method with variable String (needs to be implemented);
        //console.log("There is not enough fuel in this stage!");
        
    }
    
    //new rocket position; orientation is probably a matrix 
    var upVec = new THREE.Vector3(0,1,0);
    console.log(upVec);
    upVec = upVec.applyQuaternion(rocketGroup.quaternion);
    console.log(upVec);
    upVec = upVec.normalize();
    
    var position_rocket = new THREE.Vector3((position_rocket + (accel * difftime)) * direction * upVec); // * orientation
    position_rocket.applyQuaternion(rocketGroup.quaternion);
    rocketGroup.position.x += (accel * difftime) * direction;
    rocketGroup.position.y += (accel * difftime) * direction;
    rocketGroup.position.z += (accel * difftime) * direction;
    
}

/**
Rocket Science
part 2: orientation
input: keyPressed(WASDQE) and position(as vec3)
**/

function rotateRocket(difftime) {
    

    if (globalControlValues.up) {
        accelOX = accelOX + angle_const;
    }
    if (globalControlValues.down) {
        accelOX = accelOX - angle_const;
        
    }
    if (globalControlValues.rollLeft) {
        accelOY = accelOY + angle_const;
    }
    if (globalControlValues.rollRight) {
        accelOY = accelOY - angle_const;
        
    }
    if (globalControlValues.left) {
        accelOZ = accelOZ + angle_const;
    }
    if (globalControlValues.right) {
        accelOZ = accelOZ - angle_const;
    }


    var quaternion = new THREE.Quaternion(1,1,1,1);
    var position = new THREE.Vector3(rocketGroup.position.x, rocketGroup.position.y, rocketGroup.position.z);
    angleZ = angleZ + accelOZ * difftime;
    angleY = angleY + accelOY * difftime;
    angleX = angleX + accelOX * difftime;
    var drehmomentX = new THREE.Quaternion();
    var drehmomentY = new THREE.Quaternion();
    var drehmomentZ = new THREE.Quaternion();
    drehmomentZ.setFromAxisAngle(new THREE.Vector3(0, 0, 1), angleZ);
    drehmomentY.setFromAxisAngle(new THREE.Vector3(0, 1, 0), angleY);
    drehmomentX.setFromAxisAngle(new THREE.Vector3(1, 0, 0), angleX);
    drehmoment.set(drehmomentX.x, drehmomentY.y, drehmomentZ.z, 1);
    quaternion=quaternion.multiplyQuaternions(rocketGroup.quaternion, drehmoment);
    
    quaternion.normalize();
    
    rocketGroup.quaternion.set(quaternion.x, quaternion.y, quaternion.z, 1);
    quaternion=quaternion.multiplyQuaternions(sphere_nav, drehmoment);
    quaternion.normalize();
    sphere_nav.quaternion.set(quaternion.x, quaternion.y, quaternion.z, 1);
    
    //schlechte Lösung. Hier Ableitung von Quaternion benutzen und Slerp
    
  
}

//next stage: UI-Event, initiated by user
//for stage 1/2
function nextStage() {
    //wie kann man das generischer machen?

    if (stage == 1) {
        fuel_mass = saturnV.stage2.mass_fuel;
        mass = mass - saturnV.stage1.mass_empty - rocket.stage1.mass_fuel;
        stage = 2;
    } else if (stage == 2) {
        fuel_mass = saturnV.stage3.mass_fuel;
        mass = mass - saturnV.stage2.mass_empty - rocket.stage2.mass_fuel;
        stage = 3;
    }
}


//called during every rendering
function calculatePhysics(difftime, spaceObjects) {

    //get values from UI:buttons pressed
    timefactor = globalInterfaceValues.timeFactor;
    var factoredTime = difftime * timefactor;
    for (var i in spaceObjects) {
        var spaceObject = spaceObjects[i];
        calculateGravitation(factoredTime, spaceObjects, spaceObject);
    }

    if(global.started){
        calculateGravitationRocket(factoredTime);
    }
    
    if (global.started) {
        if (throttle>0) {
            move(difftime, 1);
            
        }
        if (globalControlValues.keyBrake) {
            move(difftime, -1);
        }
    } else if (globalControlValues.throttle) {
        if (throttle == 100) {
            global.started = true;
            console.log("started 2:"+global.started);
        }
    }
    
    if(globalControlValues.throttle&&throttle<100){
        throttle+=5;
        console.log("throttle: "+throttle);
    }
    
    if(globalControlValues.break&&throttle>=0){
        throttle-=5;
    }
    if(rocketGroup&&drehmoment){
    rotateRocket(factoredTime);
    }
        
    /*if (keyNextStage) {
        nexStage();
    }*/

}
