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
