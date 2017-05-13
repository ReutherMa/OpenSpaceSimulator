/*Calculation of gravitational forces towards rocket
collision calculation
TODO: trail point
*/

var earthRadius = 0;
var cotr = 0;
var accel = 0;

//TO DO: remove:
var stagesCtr = 0;

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
        var dist = Math.sqrt(dist2);
        var mindist = 1e-1;
        if(dist2 < mindist){
            prompt("You are getting dangerously close to "+spaceObjects[o].name+", watch out!");
        }

        if (dist2 > mindist) {
            accel = gravConst * spaceObjects[o].mass / dist2;
            if(ctr==0){accel=0;ctr++;}
            dist = 1 / dist;
            speedx += accel * difftime;
            speedy += accel * difftime;
            speedz += accel * difftime;
        }
            
        if(dist < mindist){
            explode();
        }

        //rocket position before launch
        //if(launched){}
        //update rocket position
        }

        
    }
}



/**
Rocket Science
part 1: acceleration of direction and new position
TODO: prompt
**/
function move(difftime) {

    //calculates fuel-mass that will be lost in difftime
    var mass_lost = difftime / 1000 / saturnV.stage1.burningtime * saturnV.stage1.mass_fuel * throttle / 100;
    
    
    
     
    //checks if enough fuel
    if ((fuel_mass - mass_lost) >= 0) {
        //a=F/m(now mass WITH fuel to lose)
        accel = (saturnV.stage1.thrust * (throttle/100)) / (mass); //rocket werte stimmen, einheiten sind richtig, berechnungsart stimmt
        
        //new mass without lost fuel
        mass = mass - mass_lost;
        //current fuel mass for UI
        fuel_mass = fuel_mass - mass_lost;
        $('#fuel .gauge-arrow').trigger('updateGauge', fuel_mass / saturnV.fuel_total * 100 );
        $("#fuelLabel").text(parseInt(fuel_mass / saturnV.fuel_total));
    } else {
        if(noStagesLeft){
            prompt("No fuel left. No stages left. well fuck");
        }
        else{
            prompt("Seems like you have run out of fuel. Discard current rocket stage.");
        }
        
        
    }
    
    //new rocket speed
    var upVec = new THREE.Vector3(0,1,0);
    upVec = upVec.applyQuaternion(rocketGroup.quaternion);
    upVec = upVec.normalize();
    var rocketSpeed = accel * difftime / 1000;
    // a = (F(thrust) - F(Air Resistance)) / m(rocketMass)
    //calculateAirResistance(rocketSpeed);
    //accel = ((accel * mass) - airResistance)/mass;
    var position_rocket = new THREE.Vector3((position_rocket + (rocketSpeed)) * upVec); 
    position_rocket.applyQuaternion(rocketGroup.quaternion);
    
    //as long as the rocket is in earth's atmosphere, it gets dragged with earth's rotation
    //this makes the rocket move waaaaayyy too fast TO DO: fix
    /*if(inEarthAtmos){
        rocketGroup.position.x += (accel * difftime + spaceObjects.earth.speedx) * direction;
        rocketGroup.position.y += (accel * difftime + spaceObjects.earth.speedy) * direction;
        rocketGroup.position.z += (accel * difftime + spaceObjects.earth.speedz) * direction;
    }else{*/
    rocketGroup.position.x += (rocketSpeed) ;
    rocketGroup.position.y += (rocketSpeed) ;
    rocketGroup.position.z += (rocketSpeed) ;
    //}
    
    //convert speed/difftime to km/h and then convert to percentual
    globalInterfaceValues.speed = (rocketSpeed * (1000 / difftime)) / 8000 * 100;
    $('#speed .gauge-arrow').trigger('updateGauge', globalInterfaceValues.speed);
    $("#speedLabel").text(parseInt(rocketSpeed * (1000 / difftime)));
    
    
        positionX = rocketGroup.position.x += speedx * difftime;
        positionY = rocketGroup.position.y += speedy * difftime;
        positionZ = rocketGroup.position.z += speedz * difftime;


    //Calculate planet position for drawing ellipse
    //rocketGroup.addTrailPoint(positionX, positionY, positionZ);
        
    
}

/**
Rocket Science
part 2: orientation
input: keyPressed(WASDQE) and position(as vec3)
**/

function rotateRocket(difftime) {
    
    var xAxis = new THREE.Vector3();
    var yAxis = new THREE.Vector3();
    var zAxis = new THREE.Vector3();
    var quaternion = rocketGroup.quaternion;
    var matrix = new THREE.Matrix4();
    matrix = matrix.makeRotationFromQuaternion ( quaternion );
    
    
    matrix.extractBasis(xAxis, yAxis, zAxis);
    
    
    //rocketGroup.angularAcceleration.set (0, 0, 0, 1);
    //checks which rotation key is pressed and determines angle acceleration
    if (globalControlValues.up) {
        //accelOX = accelOX + angle_const;
        rocketGroup.angularAcceleration.set (xAxis.x, xAxis.y, xAxis.z, 1000) .normalize ();
        rocketGroup.angularMomentum.multiply (rocketGroup.angularAcceleration);
        
    }
    if (globalControlValues.down) {
        rocketGroup.angularAcceleration.set (-xAxis.x, -xAxis.y, -xAxis.z, 1000) .normalize ();
        rocketGroup.angularMomentum.multiply (rocketGroup.angularAcceleration);
        
    }
    if (globalControlValues.rollLeft) {
        rocketGroup.angularAcceleration.set (-yAxis.x, -yAxis.y, -yAxis.z, 1000) .normalize ();
        rocketGroup.angularMomentum.multiply (rocketGroup.angularAcceleration);
        
    }
    if (globalControlValues.rollRight) {
        rocketGroup.angularAcceleration.set (yAxis.x, yAxis.y, yAxis.z, 1000) .normalize ();
        rocketGroup.angularMomentum.multiply (rocketGroup.angularAcceleration);
        
    }
    if (globalControlValues.left) {
        rocketGroup.angularAcceleration.set (zAxis.x, zAxis.y, zAxis.z, 1000) .normalize ();
        rocketGroup.angularMomentum.multiply (rocketGroup.angularAcceleration);
        
    }
    if (globalControlValues.right) {
        rocketGroup.angularAcceleration.set (-zAxis.x, -zAxis.y, -zAxis.z, 1000) .normalize ();
        rocketGroup.angularMomentum.multiply (rocketGroup.angularAcceleration);
        
    }
    if (globalControlValues.hardSAS) {
        rocketGroup.angularMomentum.set(0,0,0,1);
        console.log("hardSAS");
        
    }
    if (globalControlValues.sas) {
        var uniQuad = new THREE.Quaternion(0,0,0,1);
        rocketGroup.angularMomentum.slerp(uniQuad, 0.1);
    }
   
    
    //if(globalControlValues.)

/*
    var quaternion = new THREE.Quaternion(1,1,1,1);
    var position = new THREE.Vector3(rocketGroup.position.x, rocketGroup.position.y, rocketGroup.position.z);
    angleZ = angleZ + accelOZ;
    angleY = angleY + accelOY;
    angleX = angleX + accelOX;
    
    console.log("angleX: "+angleX+" angleY: "+angleY+" angleZ: "+angleZ);
    var drehmomentX = new THREE.Quaternion();
    var drehmomentY = new THREE.Quaternion();
    var drehmomentZ = new THREE.Quaternion();
    drehmomentZ.setFromAxisAngle(zAxis, angleZ);
    drehmomentY.setFromAxisAngle(yAxis, angleY);
    drehmomentX.setFromAxisAngle(xAxis, angleX);
    drehmoment.set(drehmomentX.x, drehmomentY.y, drehmomentZ.z, 1);
    console.log(drehmoment);
    
    var speedQuat = new THREE.Quaternion(1,1,1,1);
    speedQuat = quaternion.slerp(drehmoment, 0.2);
    console.log(speedQuat);
    var posQuat = new THREE.Quaternion(1,1,1,1);
    posQuat = quaternion.slerp(speedQuat, 0.);
    console.log(posQuat);
    
    //posQuat = posQuat.multiplyQuaternions(rocketGroup.quaternion, posQuat);
    
    posQuat.normalize();
    //rocketGroup.quaternion = posQuat;
    
    rocketGroup.quaternion.set(posQuat.x, posQuat.y, posQuat.z, 1);
    //quaternion = quaternion.multiplyQuaternions(sphere_nav.quaternion, drehmoment);
    //quaternion.normalize();
    
    //schlechte Lösung. Hier Ableitung von Quaternion benutzen und Slerp
    
  
    //new quaternion mathematics:
    //q = cos(a/2) + i ( x * sin(a/2)) + j (y * sin(a/2)) + k ( z * sin(a/2)) ????
    //Pout = q * Pin * conj(q) ????
    /*var qX = new THREE.Quaternion(1,1,1,1);
    var qY = new THREE.Quaternion(1,1,1,1);
    var qZ = new THREE.Quaternion(1,1,1,1);
    qX = Math.cos(angleX/2) + (new THREE.Vector3(1,0,0) * Math.sin(angleX/2)) + (new THREE.Vector3(0,1,0)*Math.sin(angleX/2)) + (new THREE.Vector3(0,0,1)*Math.sin(angleX/2));
    qY = Math.cos(angleY/2) + (new THREE.Vector3(1,0,0) * Math.sin(angleY/2)) + (new THREE.Vector3(0,1,0)*Math.sin(angleY/2)) + (new THREE.Vector3(0,0,1)*Math.sin(angleY/2));
    qZ = Math.cos(angleZ/2) + (new THREE.Vector3(1,0,0) * Math.sin(angleZ/2)) + (new THREE.Vector3(0,1,0)*Math.sin(angleZ/2)) + (new THREE.Vector3(0,0,1)*Math.sin(angleZ/2));
    quaternion = quaternion.multiplyQuaternions(qX, qY, qZ);*/

    
    rocketGroup.quaternion.multiply (rocketGroup.angularMomentum);
    sphere_nav.quaternion.multiply(rocketGroup.angularMomentum);
    
/*    console.log ("AM: ");
    console.log (rocketGroup.angularMomentum);
    console.log ("R: ");
    console.log (rocketGroup.quaternion);
    console.log ("");*/
}

/*
When the rocket collides with somedthing, it will exlode
TODO: everything
*/
function explode(){
    //explosionsgrafik
    //prompt("Oops");
    gameOver();
}

/*
Game Over. Restart?
TODO: UI, saving score
*/
function gameOver(){
    //UI-Funktion Game Over
    
}

/*
next stage: UI-Event, initiated by user
*/
function nextStage() {
    if(!noStagesLeft&&stagesCtr<1){
        //generic:
        var oldStage = "stage"+stage;
        var newStage = "stage"+(stage+1);
        console.log(oldStage);
        console.log(newStage);
        if(saturnV[newStage]==undefined){
            noStagesLeft = true;
        }else{
            console.log(saturnV[oldStage]["mass_empty"]);
            console.log(saturnV[newStage]["mass_empty"]);
            mass = mass - saturnV[oldStage]["mass_empty"] - fuel_mass;
            fuel_mass = saturnV[newStage]["mass_empty"];
            stage++;
            prompt("Discarded Stage "+(stage-1)+". Current Stage: "+stage);
            
            //TO DO: remove:
            stagesCtr++;
        }
    }else{
        //prompt("No more stages left! Sorry!");
    }
    
   /*if (stage == 1) {
        fuel_mass = saturnV.stage2.mass_fuel;
        mass = mass - saturnV.stage1.mass_empty - rocket.stage1.mass_fuel;
        stage = 2;
    } else if (stage == 2) {
        fuel_mass = saturnV.stage3.mass_fuel;
        mass = mass - saturnV.stage2.mass_empty - rocket.stage2.mass_fuel;
        stage = 3;
    } */
    
    
}

/*
Calculates the air resistance in earth's atmosphere depending on the 'height' of the rocket (=distance from earth)
in: earth and rocket position
out: force air resistance (for further calculation of rocket acceleration)
*/
function calculateAirResistance(speed){
    
    
    
    //distance form earth
    var x = (rocketGroup.position.x - spaceObjects.earth.group.position.x);
    var y = (rocketGroup.position.y - spaceObjects.earth.group.position.y);
    var z = (rocketGroup.position.z - spaceObjects.earth.group.position.z);
    
    var height2 = x*x + y*y + z*z;
    var height = Math.sqrt(height2);
    if(cotr == 0){
        earthRadius = height;
        cotr++;
    }
    
    
    var earthHeight = 148483220086.37973;
    
    height = height - earthRadius;
    height = height / 1000;
    
    if(height < 11000){
    //calculation of pressure: https://de.wikipedia.org/wiki/Barometrische_H%C3%B6henformel#Internationale_H.C3.B6henformel
    var pressure = 1013.25 * (Math.pow((1 - ((0.0065*height)/288.15)), 5.255));
    
    //cross sectional area
    var A = Math.PI * Math.pow(5,2);
    
    //resistance constant for rocket form
    var cw = 0.06;
    var p = pressure;
    
        
    //Luftdichte berechnen Formel:
    // d = p * M / (R * T)
    /* d: Dichte
    p: Luftdruck (pressure)
    M: molare Masse trockene Luft (0,028949 kg/mol)
    R: spezifische Gaskonstante fuer trockene Luft = 287,058
    T: Temperatur in Kelvin (Standardbedingungen: 25 Grad Celsius = 298,15 Kelvin)
    */
    var M = 0.0289;
    var R = 287.058;
    var T = 298.15;
    var d = p * M / (R * T);
        
    var cwe = cw * A * d * 0.5;
    
    airResistance = cwe * speed * speed;
    
    }
    
}

