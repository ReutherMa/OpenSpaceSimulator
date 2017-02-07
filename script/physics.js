var gravConst = 6.673e-11;
var ctr = 0;
var timefactor = 1;

//var planetPosition = [ [],[] ];
var rockets = loadRocketData("data/rockets.json");
//console.log(rockets);
var rocket = rockets.saturn5;
//console.log(rocket);


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
var accelOX;
var accelOY;
var accelOZ;

var count = 0;

var xAxis;
var yAxis;
var zAxis;

var drehmoment = new THREE.Quaternion().set(0, 0, 0, 1).normalize();



var fuel_mass = saturnV.stage1.mass_fuel;
var mass = saturnV.mass_total;


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


        //if (spaceObjects[o].name != "sun") {
        //    continue;
        //}


        //same objects do not have influence on themselfe
        if (spaceObject.name === spaceObjects[o].name) {
            continue;
        }
        //console.log(spaceObject.group.position.x);
        //console.log(spaceObject.name);

        var rx = spaceObjects[o].group.position.x - spaceObject.group.position.x;
        var ry = spaceObjects[o].group.position.y - spaceObject.group.position.y;
        var rz = spaceObjects[o].group.position.z - spaceObject.group.position.z;
        var dist2 = rx * rx + ry * ry + rz * rz;

        var mindist2 = spaceObjects[o].radius + spaceObject.radius;
        mindist2 *= mindist2;

        //if dist is > mindist
        if (dist2 > mindist2) {

            var accelX = 0;
            accelX = gravConst * spaceObjects[o].mass / dist2;

            var dist = Math.sqrt(dist2);

            dist = 1 / dist;

            //difftime = 1e3; //1e3;

            spaceObject.speedx += accelX * rx * dist * difftime;
            spaceObject.speedy += accelX * ry * dist * difftime;
            spaceObject.speedz += accelX * rz * dist * difftime;
        }

        //rocket position before launch
        //if(launched){}
        //update rocket position
    }

    positionX = spaceObject.group.position.x += spaceObject.speedx * difftime;
    positionY = spaceObject.group.position.y += spaceObject.speedy * difftime;
    positionZ = spaceObject.group.position.z += spaceObject.speedz * difftime;

    //planetPosition.push ( [spaceObject.name],[positionX, positionY, positionZ] );


    //Calculate planet position for drawing ellipse
    /*    if (count % 30 == 0){*/
    spaceObject.addTrailPoint(positionX, positionY, positionZ);
    /*    }
    count ++;*/

    //console.log(planetPosition);
}



/**
Rocket Science
part 1: acceleration of direction and new position

**/


function move(difftime, direction) {

    //calculates fuel-mass that will be lost in difftime
    var mass_lost = difftime / saturnV.stage1.burningtime * saturnV.stage1.mass_fuel; //* globalInterfaceValues.throttle
    //console.log("difftime:"+difftime);
    //console.log("burningtime:"+saturnV.stage1.burningtime);
    //console.log("fuelmass:"+saturnV.stage1.mass_fuel);
    //checks if enough fuel
            var accel=1;
    if (globalControlValues.throttle) {
        speed=1;
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
        
    }}
    
    //new rocket position; orientation is probably a matrix 

    var position_rocket = new THREE.Vector3((position_rocket + (accel * difftime)) * direction); // * orientation
    rocketGroup.position.x += (accel * difftime) * direction * speed;
    rocketGroup.position.y += (accel * difftime) * direction * speed;
    rocketGroup.position.z += (accel * difftime) * direction * speed;
    //console.log(rocketGroup.position.x);
    //console.log(rocketGroup.position.y);
    //console.log(rocketGroup.position.z);
}

/**
Rocket Science
part 2: orientation
input: keyPressed(WASDQE) and position(as vec3)
**/

function rotateRocket() {
    //console.log("saturnV.matrix:"+saturnV.matrix);
    //saturnV.matrix.extractBasis(xAxis, yAxis, zAxis);
    

    if (globalControlValues.up) {
        accelOX = accelOX + Math.PI / 20;
        angleX = angleX + accelOX * difftime * difftime;
        drehmoment = drehmoment.setFromAxisAngle(new THREE.Vector3(1, 0, 0), angleX) * accelOX;
    }
    if (globalControlValues.down) {
        accelOX = accelOX - Math.PI / 20;
        angleX = angleX + accelOX * difftime * difftime;
        quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), angleX);
    }
    if (globalControlValues.rollLeft) {
        accelOY = accelOY + Math.PI / 20;
        angleY = angleY + accelOY * difftime * difftime;
        quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), angleY);
    }
    if (globalControlValues.rollRight) {
        accelOY = accelOY - Math.PI / 20;
        angleY = angleY + accelOY * difftime * difftime;
        quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), angleY);
    }
    if (globalControlValues.left) {
        accelOZ = accelOZ + Math.PI / 20;
        angleZ = angleZ + accelOZ * difftime * difftime;
        quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), angleZ);
    }
    if (globalControlValues.right) {
        accelOZ = accelOZ - Math.PI / 20;
        angleZ = angleZ + accelOZ * difftime * difftime;
        quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), angleZ);
    }


    var quaternion = new THREE.Quaternion(1,1,1,1);
    //console.log("quaternion:"+quaternion);
    quaternion=quaternion.multiplyQuaternions(saturnV.quaternion, drehmoment);
    //console.log("quaternion2:"+quaternion);
    saturnV.applyQuaternion(quaternion.normalize());
    //console.log("saturnV.quaternion:"+quaternion);



}


//called during every rendering
function calculatePhysics(difftime, spaceObjects) {
    //get values from UI:buttons pressed
    timefactor = globalInterfaceValues.timeFactor;
    var factoredTime = difftime * timefactor;
    //calculates current speed for each space Object(Planets, Rocket)
    for (var i in spaceObjects) {
        //console.log(i);
        var spaceObject = spaceObjects[i];
        calculateGravitation(factoredTime, spaceObjects, spaceObject);
    }
    
    /*if (dae) {
        dae.position.x = spaceObjects.earth.group.position.x;
        dae.position.y = spaceObjects.earth.group.position.y;
        dae.position.z = spaceObjects.earth.group.position.z;
    }
    if (dae2) {
        dae2.position.x = spaceObjects.earth.group.position.x;
        dae2.position.y = spaceObjects.earth.group.position.y;
        dae2.position.z = spaceObjects.earth.group.position.z;
    }*/
    //console.log("started:"+global.started);
    if (global.started) {
        if (globalControlValues.throttle) {
            move(1);
        }
        if (globalControlValues.keyBrake) {
            move(-1);
        }
    } else if (globalControlValues.throttle) {
        if (globalInterfaceValues.throttle == 100) {
            global.started = true;
            console.log("started 2:"+global.started);
        }
    }
    
    if(rocketGroup != undefined){
    move(factoredTime, 1);
    }
    //rotateRocket();
        
    /*if (keyNextStage) {
        nexStage();
    }*/

    //roateRocket(position_rocket);
}

//next stage: UI-Event, initiated by user
//for stage 1/2
/*function nextStage() {
    //wie kann man das generischer machen?

    if (stage == 1) {
        fuel_mass = saturnV.stage2.mass_fuel;
        mass = mass - rocket.stage1.mass_empty - rocket.stage1.mass_fuel;
        stage = 2;
    } else if (stage == 2) {
        fuel_mass = saturnV.stage3.mass_fuel;
        mass = mass - rocket.stage2.mass_empty - rocket.stage2.mass_fuel;
        stage = 3;
    }
}*/