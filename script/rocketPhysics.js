/* 
This program is licensed under the GNU General Public License as described in the file „LICENSE“
Copyright (C) 2017 TH Nürnberg
Authors: Marius Reuther, Franziska Braun, Lea Uhlenbrock, Selina Forster, Theresa Breitenhuber, Marco Lingenhöl
Contact: openspacesimulation@gmail.com
*/



/*Calculation of gravitational forces towards rocket
collision calculation
TODO: trail point
*/
var ctr=0;
var rocketHeightVec = new THREE.Vector3(0, 0, 0);
var dRocketHeight = new THREE.Vector3();
var lastRocketPos = new THREE.Vector3(0,0,0);
var rocketHeight;
var gameOverVar = false;

var watchoutearth = false;

var earthRadius = 0;
var cotr = 0;
var accel = 0;

var currentStage = 1;

//var speedVec = new THREE.Vector3();
//var rocketSpeed = 0;

//Initializing trails
var geo_buf_rocket = new THREE.BufferGeometry();
var geo_buf_rocket_future = new THREE.BufferGeometry();

            
const MAX_POINTS_R = 5000;
            
// attributes
var positions_rocket = new Float32Array( MAX_POINTS_R * 3 ); // 3 vertices per point
var positions_rocket_future = new Float32Array( MAX_POINTS_R * 3 ); // 3 vertices per point

if(geo_buf_rocket){
    geo_buf_rocket.addAttribute( 'position', new THREE.BufferAttribute( positions_rocket_future, 3 ) );
}
if(geo_buf_rocket_future){
    geo_buf_rocket_future.addAttribute( 'position', new THREE.BufferAttribute( positions_rocket, 3 ) );
}

// draw range
var drawCount_rocket = 0; // draw the first 2 points, only
geo_buf_rocket.setDrawRange( 0, drawCount_rocket );
// draw range
var drawCount_rocket_future = 0; // draw the first 2 points, only
geo_buf_rocket_future.setDrawRange( 0, drawCount_rocket_future );

var mat_geo_rocket = new THREE.LineBasicMaterial( { color: 0xff0000, linewidth: 1 } );

// line
var geo_line_rocket = new THREE.Line( geo_buf_rocket,  mat_geo_rocket );

var mat_geo_rocket_future = new THREE.LineBasicMaterial( { color: 0xff00ff, linewidth: 1 } );
var geo_line_rocket_future = new THREE.Line( geo_buf_rocket,  mat_geo_rocket_future );

var oldX_R = 1;
var oldY_R = 1;
var oldZ_R = 1;
var oldVec_R = new THREE.Vector3( oldX_R, oldY_R, oldZ_R);

function drawRocketTrail(x, y, z){
    
    if (drawCount_rocket > MAX_POINTS_R - 3) {
        // sliding buffer wäre besser (2x MAX_POINTS Größe)
        positions_rocket.copyWithin (0, 3);
        drawCount_rocket--;
    }
    
    var currentVec = new THREE.Vector3( x, y, z);
    //if ( Math.abs(x - oldX) >= 1e9 || Math.abs(y - oldY >= 1e11) ||  Math.abs(z - oldZ >= 1e7)){
    //if ( Math.abs(currentVec.dot(oldVec) >= 1.2e5) ){
     oldX_R = positions_rocket[drawCount_rocket*3]   = x;
     oldY_R = positions_rocket[drawCount_rocket*3+1] = y;
     oldZ_R = positions_rocket[drawCount_rocket*3+2] = z;  
     oldVec_R = new THREE.Vector3(oldX_R, oldY_R, oldZ_R);
     drawCount_rocket ++;
    //}
    
    geo_buf_rocket.attributes.position.needsUpdate = true;
    geo_buf_rocket.setDrawRange( 0, drawCount_rocket );
    

    geo_line_rocket.name = "rkt_line";
}

function drawFlightPrognosis(x, y, z){
    if (drawCount_rocket_future > MAX_POINTS_R - 3) {
        // sliding buffer wäre besser (2x MAX_POINTS Größe)
        positions_rocket_future.copyWithin (0, 3);
        drawCount_rocket_future--;
    }
    
    var currentVec = new THREE.Vector3( x, y, z);
    //if ( Math.abs(x - oldX) >= 1e9 || Math.abs(y - oldY >= 1e11) ||  Math.abs(z - oldZ >= 1e7)){
    //if ( Math.abs(currentVec.dot(oldVec) >= 1.2e5) ){
     oldX_R = positions_rocket_future[drawCount_rocket_future*3]   = x;
     oldY_R = positions_rocket_future[drawCount_rocket_future*3+1] = y;
     oldZ_R = positions_rocket_future[drawCount_rocket_future*3+2] = z;  
     oldVec_R = new THREE.Vector3(oldX_R, oldY_R, oldZ_R);
     drawCount_rocket_future ++;
    //}
    
    geo_buf_rocket_future.attributes.position.needsUpdate = true;
    geo_buf_rocket_future.setDrawRange( 0, drawCount_rocket );
    

    geo_line_rocket_future.name = "rkt_line_future";
}


function calculateGravitationRocket(difftime){
    
            var rx = - rocketGroup.position.x;
            var ry = - rocketGroup.position.y;
            var rz = - rocketGroup.position.z;
            var dist2 = rx * rx + ry * ry + rz * rz;
            var dist = Math.sqrt(dist2);
            var mindist = 100;
            if(rocketHeight > 120){
                watchoutearth = true;
            }
            if(watchoutearth && (dist - spaceObjects.earth.radius) < mindist){
                prompt("You are getting dangerously close to "+spaceObjects.earth.name+", watch out!");
            }
            if(dist - spaceObjects.earth.radius <= 1){
                explode();
            }
            if(ctr==0){accel=0;ctr++;}
            
            /*var gravAccel = gravConst * spaceObjects[o].mass / dist2;
            console.log("gravAccel: " + gravAccel);

            var gravSpeedVec = new THREE.Vector3(rx * dist, ry * dist, rz * dist);
            console.log("gravSpeed:");
            console.log(gravSpeedVec);
            console.log("speed before grav: ");
            console.log(rocketGroup.speed);
            rocketGroup.speed.addScaledVector (gravSpeedVec, gravAccel * difftime);
            console.log("speed after grav: ");
            console.log(rocketGroup.speed);
            */
            //rocketGroup.speed.addScaledVector (gravSpeedVec, gravAccel * difftime);
            //if(ctr==0){accel=0;ctr++;}
            dist = 1 / dist;
            
            
            var gravAccel = gravConst * spaceObjects.earth.mass / dist2;
            rocketGroup.speed.x += gravAccel * rx * dist * difftime;
            rocketGroup.speed.y += gravAccel * ry * dist * difftime;
            rocketGroup.speed.z += gravAccel * rz * dist * difftime;
            
            /*rocketGroup.speed.x -= gravAccel * rx * dist * difftime;
            rocketGroup.speed.y -= gravAccel * ry * dist * difftime;
            rocketGroup.speed.z -= gravAccel * rz * dist * difftime;
            */
            
                
            
        }
            
        
        
    


var lastRocketHeight = 0;
/**
Rocket Science
part 1: acceleration of direction and new position
TODO: prompt
**/
function moveRocket(difftime) {
    scene.updateMatrixWorld();

    //var difftime = difftime/1000;
    //calculates fuel-mass that will be lost in difftime
    var mass_lost = difftime / saturnV.stage1.burningtime * saturnV.stage1.mass_fuel * throttle / 100;
    
    var xAxis = new THREE.Vector3();
    var yAxis = new THREE.Vector3();
    var zAxis = new THREE.Vector3();
    var quaternion = rocketGroup.quaternion;
    var matrix = new THREE.Matrix4();
    matrix = matrix.makeRotationFromQuaternion ( quaternion );
    matrix.extractBasis(xAxis, yAxis, zAxis);
    
    lastRocketPos = rocketGroup.position;
    
     
    //checks if enough fuel
    if ((fuel_mass - mass_lost) >= 0 || globalInterfaceValues.fuelCheat) {
        //a=F/m(now mass WITH fuel to lose)
        accel = (saturnV.stage1.thrust * (throttle/100)) / (mass); //rocket werte stimmen, einheiten sind richtig, berechnungsart stimmt
        
        // a = (F(thrust) - F(Air Resistance)) / m(rocketMass)
        //calculateAirResistance(rocketGroup.speed.length());
        //console.log("airResistance: " + airResistance);
        //accel = ((accel * mass) - airResistance)/mass;
        //console.log("rocket accel after: " + accel);
        //new mass without lost fuel
        mass = mass - mass_lost;
        //current fuel mass for UI
        fuel_mass = fuel_mass - mass_lost;
        $('#fuelGauge .gauge-arrow').trigger('updateGauge', fuel_mass / saturnV.fuel_total * 100 );
        $("#fuelGaugeLabel").text(parseInt(fuel_mass / 1000));
        
    } else {
        if(noStagesLeft){
            prompt("No fuel left. No stages left. Restart or... do your thing, Major Tom.");
        }
        else{
            prompt("Seems like you have run out of fuel. Discard current rocket stage.");
        }
                
    }
    
    var ad = accel * difftime;
    
    rocketGroup.speed.addScaledVector (yAxis, ad);
    //rocketGroup.speed.addVectors (rocketGroup.speed, yAxis.multiplyScalar(ad));
    var rocketSpeed = rocketGroup.speed.length();
    rocketGroup.position.addScaledVector (rocketGroup.speed, difftime);
    //rocketGroup.position.addVectors( rocketGroup.position, rocketGroup.speed.multiplyScalar( difftime ));
    
    rocketHeightVec = rocketGroup.position.clone();
    //confusing: this is the height from the actual starting position of the rocket
    dRocketHeight = rocketHeightVec.addScaledVector(rocketStartPosition, -1);
    if(dRocketHeight.length() <= 500000){
        rocketHeight = dRocketHeight.length();
    }else{
        //this is the height of the rocket compared to earth's surface
        rocketHeight = rocketHeightVec.length() - spaceObjects.earth.radius;
    }
    var rocketHeightSpeed = (rocketHeight - lastRocketHeight) / difftime;
    lastRocketHeight = rocketHeight;
    
    if(rocketHeight <= 10000){
        $("#heightLabel").text("m");
        globalInterfaceValues.height = parseInt(rocketHeight);
    }else if(rocketHeight <= 999999999){
        $("#heightLabel").text("km");
        var height = rocketHeight/1000;
        globalInterfaceValues.height = parseInt(height);
    }else{
        $("#heightLabel").text("mio km");
        var height = rocketHeight/1000000000
        globalInterfaceValues.height = parseInt(height);
    }
    // pad height-number with zero and parse to string
    
    var height = zeroFill(globalInterfaceValues.height, 6);
    $('#heightDisplay').val(height).change();
    
  

    //Calculate planet position for drawing ellipse
    //rocketGroup.addTrailPoint(positionX, positionY, positionZ);
    
    //multiply coords of rocket with model-matrix for correct values!
    
    //var earth_vec = new THREE.Vector3(0, 0, 0);
    //var r_vec = rocketGroup.position;
    //var earth_m = new THREE.Matrix4();
    //earth_m = spaceObjects.earth.group.MatrixWorld;
    //earth_vec = spaceObjects.earth.group.MatrixWorld.multiply(r_vec);
    //earth_vec = r_vec.multiplyMatrix4( spaceObjects.earth.group.MatrixWorld );
    
    //drawRocketTrail(earth_vec);    
    drawRocketTrail(rocketGroup.position.x, rocketGroup.position.y, rocketGroup.position.z);    
    /*for(var i =0; i<=100; i++){
        //look into future and calculate rocket position
        var timeywimey = difftime * i * 100;
        var accelF = (saturnV.stage1.thrust * (throttle/100)) / (mass);         
        calculateAirResistance(rocketGroup.speed.length());
        // a = (F(thrust) - F(Air Resistance)) / m(rocketMass)
        var accelF = ((accel * mass) - airResistance)/mass;
        //new mass without lost fuel
        var massF = mass - mass_lost;
        //current fuel mass for UI
        var fuel_massF = fuel_mass - mass_lost;
        var adF = accel * difftime;
        var pos = new THREE.Vector3(rocketGroup.position.x, rocketGroup.position.y, rocketGroup.position.z);
        pos.addScaledVector (rocketGroup.speed, timeywimey);
        drawFlightPrognosis(pos.x, pos.y, pos.z);
    }*/
    
    var speedV = lastRocketPos.clone();
    speedV.sub(rocketGroup.position);
    var speed = speedV.length();
    speed = speed / difftime;
    
    //convert speed/difftime to km/h and then convert to percentual
    globalInterfaceValues.speed = speed / 8000 * 100;
    $('#speedGauge .gauge-arrow').trigger('updateGauge', globalInterfaceValues.speed);
    $("#speedGaugeLabel").text(parseInt(rocketSpeed));
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
    /*var euler = new THREE.Euler( 0.5*Math.PI, 0, 0, 'XYZ' );
    var quat = new THREE.Quaternion(0,0,0,1);
    quat.setFromEuler(euler);
    var quaty = new THREE.Quaternion(0,0,0,1);
    quaty = rocketGroup.angularMomentum.clone();
    quaty.multiply(quat);
    sphere_nav.quaternion.multiply(quaty);
    */
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
    prompt("Looks like you hit a tiny obstacle. Restart game.");
    gameOverVar = true;
}

/*
next stage: UI-Event, initiated by user
*/
function nextStage() {
    console.log("nextstage called");
    if(!noStagesLeft){
        //generic:
        var oldStage = "stage"+stage;
        var newStage = "stage"+(stage+1);
        currentStage = newStage;
        if(saturnV[newStage]==undefined){
            noStagesLeft = true;
            prompt("There are no stages left.");
        }else{
            mass = mass - saturnV[oldStage]["mass_empty"] - fuel_mass;
            fuel_mass = saturnV[newStage]["mass_empty"];
            stage++;
            prompt("Discarded Stage "+(stage-1)+". Current Stage: "+stage);
            globalInterfaceValues.currentStage++;
            $('#currentStageDisplay').val(globalInterfaceValues.stage).change();
            
        }
    }else{
        prompt("No more stages left! Sorry!");
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
    globalInterfaceValues.discardStage = false;
    
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

function checkForCollision(){
    for (var o in spaceObjects) {
    if(rocketGroup.position.x <= (spaceObjects[o].group.position.x + spaceObjects[o].group.radius) && rocketGroup.position.y == (spaceObjects[o].group.position.y + spaceObjects[o].group.radius) && rocketGroup.position.z == (spaceObjects[o].group.position.z + spaceObjects[o].group.radius)){
        prompt("Whoopsie...");
    }
    }
    
}

