
//initial values on game start
rocket=saturnV;
mass=rocket.mass
fuel_mass=rocket.stage1.mass_fuel;


// calculate gravitational forces
    /** 
        iterates through all space objects and calculates influence on current object and object's speed and direction
        r: distance between objects in x, y, z dimensions
        dist: absolute distance
        accel: acceleration of current object
        
    **/
function calculateGravitation (difftime) {
    for (var o in objects) {
        var spaceObject = objects[o];
        
        //dependant on class definition/structure; based on project proposal
        if (spaceObject === this || spaceObject.mass === undefined || spaceObject.move === m_finished)
            continue;
        
        
        var rx    = (spaceObject.x - this.x);
        var ry    = (spaceObject.y - this.y);
        var rz    = (spaceObject.z - this.z);
        var dist2   = rx * rx + ry * ry + rz * rz;
        var accel   = gravConst * spaceObject.mass / dist2;
        var dist    = Math.sqrt (dist2);
        
        dist = 1 / dist;
        this.speedx += accel * rx * dist;
        this.speedy += accel * ry * dist;
        this.speedz += accel * rz * dist;
    }
    

    
    
};

    

/**
Rocket Science
part 1: acceleration of direction and new position
(part 2: acceleration of orientation coming soon)
**/
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

//called during every rendering
function calculatePhysics(){
    
    //get values from UI:buttons pressed
    
    difftime=now-lasttime*timefactor;
    
    //calculates current speed for each space Object(Planets, Rocket)
    for (var o in objects) {
        objects[o].calculateGravitation(difftime);
    }
    move(getThrottleOnPercent);
    orientation(getAccelX, getAccelY, getAccelZ);
    lasttime=now;
    

}

//next stage: UI-Event, initiated by user
//for stage 1/2
function nextStage(){
    //wie kann man das generischer machen?
    mass=mass-rocket.stage1.mass_empty-rocket.stage1.mass_fuel;
}