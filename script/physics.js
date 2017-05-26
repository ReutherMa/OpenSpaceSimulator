//universal gravitational constant
var gravConst = 6.673e-11;

//counter for things and stuff
var ctr = 0;

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

/*Calculates all physical forces on planets, objects and rocket
interactions with UI variables
called during every rendering
globalControlValues: from UI, determine which keys are being pressed(boolean variables)
global.started: boolean variable that determines whether rocket launched already
*/
function calculatePhysics(difftime, spaceObjects) {

    //loadRocket();
    //get up-vector of rocket before launch
    if(!global.started){
        var xAxis = new THREE.Vector3();
        baseYAxis = new THREE.Vector3();
        var zAxis = new THREE.Vector3();
        var quaternion = rocketGroup.quaternion;
        var matrix = new THREE.Matrix4();
        matrix = matrix.makeRotationFromQuaternion ( quaternion );
        matrix.extractBasis(xAxis, baseYAxis, zAxis);
    }
    
    //difftime from ms in s (SI) 
    difftime = difftime / 1000;
    timefactor = globalInterfaceValues.timeFactor;
    var factoredTime = difftime * timefactor;
    
    //calculate all gravitational forces between planets and objects
    for (var i in spaceObjects) {
        var spaceObject = spaceObjects[i];
        calculateGravitation(factoredTime, spaceObjects, spaceObject);
    }

    if(global.started){
        calculateGravitationRocket(factoredTime);
    }
    
    if (global.started) {
            move(factoredTime);
            //throttleSound.setVolume(globalControlValues.throttle/100);
        
    } else if (globalControlValues.throttle) {
        global.audio = true;
        if (throttle == 100) {
            global.started = true;
            console.log("started 2:"+global.started);
            //prompt("Rocket successfully launched");
        }
        
    }
    
    
    if( globalControlValues.throttle && throttle<100 ){
        throttle += 5;
        console.log("throttle: "+throttle);
    }
    if( !globalControlValues.throttle && throttle>0 ){
        throttle -= 5;
        console.log("throttle: "+throttle);
    }
    if( throttle<=0 ){
        global.audio = false;
    }
    
    if(globalControlValues.break&&throttle>=0){
        throttle-=5;
        console.log("throttle: "+throttle);
    }
    if(rocketGroup&&drehmoment){
        rotateRocket(factoredTime);
    }
    $('#throttleGauge .gauge-arrow').trigger('updateGauge', throttle);
    $("#throttleGaugeLabel").text(parseInt(throttle));  
    /*
    initialize trail points for rocket:
    */
    
            
    if (globalControlValues.discardStage) {
        nextStage();
    }

}
