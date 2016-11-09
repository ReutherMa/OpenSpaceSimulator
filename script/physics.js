

// Main workhorse: calculate gravitational forces
    /** 
        iterates through all space objects and calculates current speed and direction
        r: distance between objects in x, y, z dimensions
        dist: absolute distance
        accel: acceleration of current object
        difftime: time since last rendering
    **/
function m_grav (difftime) {
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

    //calculates current rocket speed and direction
    function rocket_move (difftime) {
        m_grav(difftime);
        //coming soon
        
    };

function loop() {
    requestAnimationFrame (loop);
    
    //render correct animation even in slow browsers via time request
    var time = Date.now(); 
    var difftime= time- lasttime;
    
    //may be unnecessary ; dependant on class structure
    var circtime = (time % 20000) / 20000 * 2*Math.PI;
    ctx.clearRect (0, 0, canv.width, canv.height);

    ctx.save();
    ctx.translate (.5*canv.width, .5*canv.height);

    for (var o in objects) {
        if (objects[o].move !== undefined)
            objects[o].move (difftime);
        // Simple explicit Euler integrator
    objects[o].x += objects[o].speedx * difftime;
    objects[o].y += objects[o].speedy * difftime;
        objects[o].draw ();
    }

    ctx.restore();
    lasttime = time;
}
loop();
    
