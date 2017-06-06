/*Calculation of gravitational forces towards rocket
collision calculation
TODO: trail point
*/

var earthRadius = 0;
var cotr = 0;
var accel = 0;

var currentStage = 1;
//TO DO: remove:
var stagesCtr = 0;

//var speedVec = new THREE.Vector3();
//var rocketSpeed = 0;

function calculateGravitationRocket(difftime){
    for (var o in spaceObjects) {
        if (spaceObjects[o].name == "rocket") {
            continue;
        }
        if(spaceObjects[o].name == "earth"){
        var rx = -rocketGroup.position.x;
        var ry = -rocketGroup.position.y;
        var rz = -rocketGroup.position.z;
        var dist2 = rx * rx + ry * ry + rz * rz;
        var dist = Math.sqrt(dist2);
        var mindist = 1e-1;
        if(dist2 < mindist){
            prompt("You are getting dangerously close to "+spaceObjects[o].name+", watch out!");
        }

        if (dist2 > mindist) {
            var gravAccel = gravConst * spaceObjects[o].mass / dist2;
            if(ctr==0){accel=0;ctr++;}
            dist = 1 / dist;
            rocketGroup.speed.x += gravAccel * rx * dist * difftime;
            rocketGroup.speed.y += gravAccel * ry * dist * difftime;
            rocketGroup.speed.z += gravAccel * rz * dist * difftime;
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


var lastRocketHeight = 0;
/**
Rocket Science
part 1: acceleration of direction and new position
TODO: prompt
**/
function move(difftime) {

    //calculates fuel-mass that will be lost in difftime
    var mass_lost = difftime / saturnV.stage1.burningtime * saturnV.stage1.mass_fuel * throttle / 100;
    
    var xAxis = new THREE.Vector3();
    var yAxis = new THREE.Vector3();
    var zAxis = new THREE.Vector3();
    var quaternion = rocketGroup.quaternion;
    var matrix = new THREE.Matrix4();
    matrix = matrix.makeRotationFromQuaternion ( quaternion );
    matrix.extractBasis(xAxis, yAxis, zAxis);
    
    
     
    //checks if enough fuel
    if ((fuel_mass - mass_lost) >= 0) {
        //a=F/m(now mass WITH fuel to lose)
        accel = (saturnV.stage1.thrust * (throttle/100)) / (mass); //rocket werte stimmen, einheiten sind richtig, berechnungsart stimmt
        // a = (F(thrust) - F(Air Resistance)) / m(rocketMass)
        calculateAirResistance(rocketGroup.speed.length());
        accel = ((accel * mass) - airResistance)/mass;
        console.log("thrust: "+saturnV.stage1.thrust);
        console.log("throttle: "+throttle);
        console.log("mass: "+mass);
        
        console.log("accel1: "+accel);
        //new mass without lost fuel
        mass = mass - mass_lost;
        //current fuel mass for UI
        fuel_mass = fuel_mass - mass_lost;
        $('#fuelGauge .gauge-arrow').trigger('updateGauge', fuel_mass / saturnV.fuel_total * 100 );
        $("#fuelGaugeLabel").text(parseInt(fuel_mass / 1000));
        console.log(fuel_mass);
    } else {
        if(noStagesLeft){
            prompt("No fuel left. No stages left. Aaaaahhhhhhhhh");
        }
        else{
            prompt("Seems like you have run out of fuel. Discard current rocket stage.");
        }
        
        
    }
    
    var ad = accel * difftime;
    console.log("accel: "+accel);
    
    rocketGroup.speed.addScaledVector (yAxis, ad);
    //rocketGroup.speed.addVectors (rocketGroup.speed, yAxis.multiplyScalar(ad));
    var rocketSpeed = rocketGroup.speed.length();
    console.log("rocket speed: " + rocketGroup.speed.x + " / " + rocketGroup.speed.y + " / " + rocketGroup.speed.z);
    rocketGroup.position.addScaledVector (rocketGroup.speed, difftime);
    //rocketGroup.position.addVectors( rocketGroup.position, rocketGroup.speed.multiplyScalar( difftime ));
    console.log(rocketGroup.position);
    
    var rocketHeight = rocketGroup.position.length() - spaceObjects.earth.radius;
    var rocketHeightSpeed = (rocketHeight - lastRocketHeight) / difftime;
    lastRocketHeight = rocketHeight;
    console.log ("Height over Earth: " + rocketHeight + " / Speed: " + rocketHeightSpeed);
    
    //convert speed/difftime to km/h and then convert to percentual
    globalInterfaceValues.speed = rocketSpeed / 8000 * 100;
    $('#speedGauge .gauge-arrow').trigger('updateGauge', globalInterfaceValues.speed);
    $("#speedGaugeLabel").text(parseInt(rocketSpeed));
    
  

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
        rocketGroup.angularAcceleration.set (xAxis.x, xAxis.y, xAxis.z, 100) .normalize ();
        rocketGroup.angularMomentum.multiply (rocketGroup.angularAcceleration);
        
    }
    if (globalControlValues.down) {
        rocketGroup.angularAcceleration.set (-xAxis.x, -xAxis.y, -xAxis.z, 100) .normalize ();
        rocketGroup.angularMomentum.multiply (rocketGroup.angularAcceleration);
        
    }
    if (globalControlValues.rollLeft) {
        rocketGroup.angularAcceleration.set (-yAxis.x, -yAxis.y, -yAxis.z, 100) .normalize ();
        rocketGroup.angularMomentum.multiply (rocketGroup.angularAcceleration);
        
    }
    if (globalControlValues.rollRight) {
        rocketGroup.angularAcceleration.set (yAxis.x, yAxis.y, yAxis.z, 100) .normalize ();
        rocketGroup.angularMomentum.multiply (rocketGroup.angularAcceleration);
        
    }
    if (globalControlValues.left) {
        rocketGroup.angularAcceleration.set (zAxis.x, zAxis.y, zAxis.z, 100) .normalize ();
        rocketGroup.angularMomentum.multiply (rocketGroup.angularAcceleration);
        
    }
    if (globalControlValues.right) {
        rocketGroup.angularAcceleration.set (-zAxis.x, -zAxis.y, -zAxis.z, 100) .normalize ();
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
   
    /*
    var angleToBase = yAxis.angleTo(baseYAxis);
    globalInterfaceValues.angleToBase = angleToBase;
    */
    
    
    rocketGroup.quaternion.multiply (rocketGroup.angularMomentum);
    sphere_nav.quaternion.multiply(rocketGroup.angularMomentum);
}

/*
When the rocket collides with something, it will exlode
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
        currentStage = newStage;
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

