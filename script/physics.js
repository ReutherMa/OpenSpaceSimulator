/* 
This program is licensed under the GNU General Public License as described in the file „LICENSE“
Copyright (C) 2017 TH Nürnberg
Authors: Marius Reuther Franziska Braun, Lea Uhlenbrock, Selina Forster, Theresa Breitenhuber, Marco Lingenhöl
Contact: openspacesimulation@gmail.com
*/

var startDiffTime;
var rocketStartPosition = new THREE.Vector3(0,0,0);

//universal gravitational constant
var gravConst = 6.673e-11;

//counter for things and stuff
var ctr = 0;
var ctrStart = 0;

var customRocketUsage = false;

//which control key is pressed
var keyPressed;

//rocket rotation angles in radiant
var angleX = 0;
var angleY = 0;
var angleZ = 0;

//acceleration of orientation in int
var accelOX=0;
var accelOY=0;
var accelOZ=0;

var enough_fuel_left = true;

//another counter for stuff
var count = 0;

//rocket rotation axis
var xAxis;
var yAxis;
var zAxis;

//starter quaternion for rocket rotation
var drehmoment = new THREE.Quaternion().set(0, 0, 0, 1).normalize();

//starter rocket values
var fuel_mass = saturnV.stage1.mass_fuel;
var mass = saturnV.mass_total;
var stage=1;
var throttle=0;

//rocket speed
var speed=0;
var speedx=0;
var speedy=0;
var speedz=0;

//is the rocket in earth's atmosphere?
var inEarthAtmos = true;
var earthAtmosInM = 32000;

//angle constant for rocket rotation
var angle_const = 2 * Math.PI / 20000;

var airResistance;

var deltaT = 10;

var noStagesLeft = false;

var rocketSpeed = 0;

//up-Vector of Rocket before launch
var baseYAxis;

var gravAccel = new THREE.Vector3();

/*Calculates all physical forces on planets, objects and rocket
interactions with UI variables
called during every rendering
globalControlValues: from UI, determine which keys are being pressed(boolean variables)
global.started: boolean variable that determines whether rocket launched already
*/

//variables for rocket placement on earth
var xE;
var yE;
var zE;

var countr=0;

function calculatePhysics(difftime, spaceObjects) {

    
    //difftime is in s
    timefactor = globalInterfaceValues.timeFactor;
    var factoredTime = difftime * timefactor;
    
    if(spaceObjects.earth.group && rocketGroup){
         
        /*
        var yAxis = new THREE.Vector3();
        var quaternion = rocketGroup.quaternion;
        var matrix = new THREE.Matrix4();
        matrix = matrix.makeRotationFromQuaternion ( quaternion );
        yAxis.setFromMatrixColumn ( matrix, 1 );
        spaceObjects.earth.group.angularMomentum.setFromAxisAngle( yAxis, - 2 * Math.PI * 0.00001157407 * factoredTime);
        spaceObjects.earth.group.quaternion.multiply(spaceObjects.earth.group.angularMomentum);
        if(!global.started){
            rocketGroup.quaternion.multiply(spaceObjects.earth.group.angularMomentum);
        }
        */
    }
   
    
    //calculate all gravitational forces between planets and objects
    for (var i in spaceObjects) {
        var spaceObject = spaceObjects[i];
        calculateGravitation(factoredTime, spaceObjects, spaceObject);
    }

    if(global.started){
        calculateGravitationRocket(factoredTime);
        rotateRocket(factoredTime);
    }
    /*if(global.started && ctrStart == 0){
        //speed rocket with earth rotation when started
        var earthRotationSpeed = new THREE.Vector3(0,0,0);
        earthRotationSpeed = rocketGroup.position.clone();
        earthRotationSpeed.sub(rocketStartPosition);
        rocketGroup.speed.addScaledVector(earthRotationSpeed, difftime/startDiffTime);
        ctrStart++;
    }*/
    if (global.started && !gameOverVar) {
            
        moveRocket(factoredTime);
        if(rocketGroup&&drehmoment){
        //rotateRocket(factoredTime);
        }
        if(globalControlValues.discardStage){
            nextStage();
        }
        checkForCollision();
            //throttleSound.setVolume(globalControlValues.throttle/100);
        
    } else if (throttle >= 0) {
        global.audio = true;
        if (throttle == 100) {
            global.started = true;
            hideRocketInterface();
            
        }
    }
    
    if(throttleSound){
        throttleSound.setVolume(throttle/100);
    }
    
    if( globalControlValues.throttleUp && throttle<100 && enough_fuel_left){
        throttle += 1;
        }
    if( globalControlValues.throttleDown && throttle>0 ){
        throttle -= 1;
        }
    if( throttle<=0 ){
        global.audio = false;
    }
    
    if(globalControlValues.break&&throttle>=0){
        throttle-=5;
        }
    
    $('#throttleGauge .gauge-arrow').trigger('updateGauge', throttle);
    $("#throttleGaugeLabel").text(parseInt(throttle));  
    /*
    initialize trail points for rocket:
    */
    
            
    
    
    
    if(ctr<1 && spaceObjects.earth){
        //position calculation for rocket placement (on earth)
        var r = spaceObjects.earth.radius;
        xE = r * Math.sin(Math.PI/180 * 45) * Math.cos(Math.PI/180 * 90);
        yE = r * Math.sin(Math.PI/180 * 45) * Math.sin(Math.PI/180 * 90);
        zE = r * Math.cos(Math.PI/180 * 45);
        ctr++;
    }

    //loadRocket();
    //get up-vector of rocket before launch
    if(!global.started){
        var xAxis = new THREE.Vector3();
        baseYAxis = new THREE.Vector3();
        var zAxis = new THREE.Vector3();
        if (spaceObjects.earth.group && rocketGroup){
            /*
            rocketGroup.speed.x = (spaceObjects.earth.group.position.x + xE - rocketGroup.position.x) / factoredTime;
            rocketGroup.speed.y = (spaceObjects.earth.group.position.y + xE - rocketGroup.position.y) / factoredTime;
            rocketGroup.speed.z = (spaceObjects.earth.group.position.z + xE - rocketGroup.position.z) / factoredTime;
            var vec = new THREE.Vector3(xE, yE, zE);
            var xAxis = new THREE.Vector3();
            var quaternion = rocketGroup.quaternion;
            var matrix = new THREE.Matrix4();
            matrix = matrix.makeRotationFromQuaternion ( quaternion );
            xAxis.setFromMatrixColumn ( matrix, 0 );
            vec = vec.applyAxisAngle ( xAxis, Math.PI/180 * 120 );
            //rocketGroup.position.add(spaceObjects.earth.group.position);
            //rocketGroup.position.add(new THREE.Vector3(xE, yE, zE));
            rocketGroup.position.x = spaceObjects.earth.group.position.x + xE;
            rocketGroup.position.y = spaceObjects.earth.group.position.y + yE;
            rocketGroup.position.z = spaceObjects.earth.group.position.z + zE;
          */  
            /*if (launchpadGroup !== undefined) {
                scene.updateMatrixWorld();
                rocketGroup.quaternion.setFromRotationMatrix( launchpadGroup.matrixWorld );
                //rocketGroup.position.setFromMatrixPosition( launchpadGroup.matrixWorld );
                rocketGroup.position.set (0.9, 1.5, -1.65);
                launchpadGroup.localToWorld (rocketGroup.position);
            }*/
        }
        
        if(sphere_nav && countr==0 && rocketGroup){
            var euler = new THREE.Euler( 0, 0.5*Math.PI, 0, 'XYZ' );
            var quat = new THREE.Quaternion(0,0,0,1);
            quat.setFromEuler(euler);
            var quaty = new THREE.Quaternion(0,0,0,1);
            quaty = rocketGroup.angularMomentum.clone();
            quaty.multiply(quat);
            //sphere_nav.quaternion.multiply(quaty);
            countr++;
        }
        
        
        /*
        if (rocketGroup) 
        {
            var quaternion = rocketGroup.quaternion;
            var matrix = new THREE.Matrix4();
            matrix = matrix.makeRotationFromQuaternion ( quaternion );
            matrix.extractBasis(xAxis, baseYAxis, zAxis);
        }*/
    }
    
}
