// fill global with key-values, datatype: boolean
var global = {};

function buildUniverse(){

//constants
const BLOW = 1000;
    
//Instant Variables
var universe = {};
var container, stats;
var camera, controls, scene, renderer, raycaster;
var bulbLight, bulbMat;
var segments = 64;
var group_galaxy, group1_sun, group2_mercury, group3_venus, group4_earth, group41_moon, group5_mars, group6_jupiter,
    group7_saturn, group8_uranus, group9_neptune;

var sun, earth, moon, mercury, venus, mars, jupiter, saturn, uranus, neptune;
var spaceObjects = {};
var mouse = new THREE.Vector2(), INTERSECTED;
    
// variables for physics
var now, difftime; 
var lasttime;

universe.init = init;
universe.render = render;

function init(data){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60 , window.innerWidth/window.innerHeight , 0.01, 1e27);
    camera.position.set( 0, 0, 695508e3 + 10e10 );


    buildSkybox();

/*  var helper = new THREE.GridHelper( 10000, 20, 0xffffff, 0xffffff );
    scene.add( helper ); */

    //provisionally directional light from the sky (up)
    var light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 0, 1, 0 );
    scene.add(light);

    //light_shader
    var fShader = document.getElementById("fragmentshader");
    var vShader = document.getElementById("vertexshader");
    var shaderMaterial = new THREE.ShaderMaterial({
        vertexShader: vShader.textContent,
        fragmentShader: fShader.textContent
    });

    buildPlanets(data);   
    
    /*
     *this is a text ("earth" etc) as a canvas. doesnt work
     *here but it same code works on another html file
     *
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
    var cube2 = new THREE.Mesh( geometry, material );
    scene.add(cube2);
    
    var canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    var context = canvas.getContext('2d');
    context.font = "24px Arial";
    context.fillStyle = "rgba(255,0,0,1)";
    context.fillText('Earth!', 0, 64);
    var tex = new THREE.Texture(canvas);
    tex.needsUpdate = true;
    var mate = new THREE.SpriteMaterial( { map: tex, color: 0xffffff } );
    var sprite = new THREE.Sprite( mate );
    sprite.position.set(0,2,0);
    cube2.add( sprite );
    console.log(sprite.position);*/

    //controls
    controls = new THREE.OrbitControls( camera );
    //controls.addEventListener( 'change', render );

    //axisHelper
    var axisHelper = new THREE.AxisHelper( 1e26 );
    scene.add( axisHelper ); 

    //raycaster
    raycaster = new THREE.Raycaster();
    //console.log(spaceObjects);
    
    //renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    //renderer.setDepthTest(true);
    container = document.getElementById( 'container' );
    container.appendChild( renderer.domElement );
    stats = new Stats();
    container.appendChild( stats.dom );
    window.addEventListener( 'resize', onWindowResize, false );
    //window.addEventListener( 'click', onMouseClick, false );

    lasttime = Date.now();
}

//skybox
function buildSkybox(){
    var imagePrefix = "textures/stars_for_skybox1/";
    var directions  = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
    var imageSuffix = ".png";
    var loader = new THREE.TextureLoader();

    var materialArray = [];
    for (var i = 0; i < 6; i++)
        materialArray.push( new THREE.MeshBasicMaterial({
            map: loader.load( imagePrefix + directions[i] + imageSuffix ),
            side: THREE.BackSide
        }));

    var skyGeometry = new THREE.CubeGeometry( 1e26, 1e26, 1e26 );
    var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
    var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
    scene.add( skyBox );
}

//when user changes size of window
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    //render(); no double calling
}
    
//when user moves mouse (over object) 
//doesn't work perfect.
function onMouseClick( event ) {
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;	
    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( spaceObjects, true );
    //console.log(intersects[0].object.position);
    //camera.position = intersects[0].object.position;
    for ( var i = 0; i < intersects.length; i++ ) {
        console.log("now");
        camera.position.x = intersects[i].object.position.x;
        camera.position.y = intersects[i].object.position.y;
        camera.position.z = intersects[i].object.position.z+3;
		intersects[ i ].object.material.color.set( 0xff0000 );
	}
}

//build the planets
function buildPlanets(data){
    
    //galaxy
    group_galaxy = new THREE.Group();
    group_galaxy.position.set(0,0,0);
    scene.add(group_galaxy);
    
    for (var planet in data){
        
        var base = data[planet].base;
        
        if (data[planet].star === true){
            //console.log("Star...");
            
            var group_name = new THREE.Group();
            scene.add(group_name);
            
            var planet_object = new SpaceObject(planet, data[planet].mass, data[planet].radius*10, {emissive: 0xffff80, color: 0x000000, specular: 0 }, group_name);
            planet_object.buildBody();
            spaceObjects[planet] = planet_object;
            
        }else{
            //console.log("Planets...");
            
            var group_name = new THREE.Group();
            scene.add(group_name);
            //console.log(data[planet].color);
            var planet_object = new SpaceObject(planet, data[planet].mass, data[planet].radius*BLOW, data[planet].color, group_name, data[planet].speedx, data[planet].speedy, data[planet].speedz);
            planet_object.buildBody();
            
            // for objects around other objects
            var posx = data[planet].perihelion;
            if (base){
                posx += data[base].perihelion;
            }
            
            planet_object.setPosition(posx,0,0,0);
            console.log(planet + posx);
            spaceObjects[planet] = planet_object;
            //planet.setLabel();
        }
    }
    
    
    //sun
/*    group1_sun = new THREE.Group();
    scene.add(group1_sun);
    sun = new SpaceObject("Sun", data.sun.mass, data.sun.radius, {emissive: 0xffff80, color: 0x000000, specular: 0 }, group1_sun);
    sun.buildBody();
    spaceObjects.push(sun);
    sun.setLabel();*/

/*    //mercury
    group2_mercury = new THREE.Group();
    scene.add(group2_mercury);
    
    mercury = new SpaceObject("Mercury", data.mercury.mass, data.mercury.radius*BLOW, {color: 0x555555}, group2_mercury, data.mercury.speedx, data.mercury.speedy, data.mercury.speedz);
    mercury.buildBody();
    mercury.setPosition(data.mercury.perihelion,0,0,0);
    group_mercury_rotate = new THREE.Group();
    group_mercury_rotate.add(group2_mercury);
    group_mercury_rotate.add(group_galaxy);
    scene.add(group_mercury_rotate);
    
    spaceObjects.push(mercury);
    
    //venus
    group3_venus = new THREE.Group();
    scene.add(group3_venus);
    venus = new SpaceObject("Venus", data.venus.mass, data.venus.radius*BLOW, {color: 0xff5555}, group3_venus, data.venus.speedx, data.venus.speedy, data.venus.speedz);
    venus.buildBody();
    venus.setPosition(data.venus.perihelion,0,0,0);
    group_venus_rotate = new THREE.Group();
    group_venus_rotate.add(group3_venus);
    group_venus_rotate.add(group_galaxy);
    scene.add(group_venus_rotate);
    
    spaceObjects.push(venus);
    
    //earth
    group4_earth = new THREE.Group();
    scene.add(group4_earth);
    earth = new SpaceObject("Earth", data.earth.mass, data.earth.radius*BLOW, {color: 0x0099ff}, group4_earth, data.earth.speedx, data.earth.speedy, data.earth.speedz);
    earth.buildBody();
    earth.setPosition(data.earth.perihelion,0,0, data.earth.eququatorial_inclination);
    //earth.create_ellipse(-data.earth.perihelion, 0, data.earth.perihelion, data.earth.aphelia);
    group_earth_rotate = new THREE.Group();
    group_earth_rotate.add(group4_earth);
    group_earth_rotate.add(group_galaxy);
    scene.add(group_earth_rotate);
    
    spaceObjects.push(earth);
    
    //earth_moon
    group41_moon = new THREE.Group();
    group4_earth.add(group41_moon);
    moon = new SpaceObject("Moon", data.earth_moon.mass, data.earth_moon.radius*BLOW, {color: 0x999999}, group41_moon, data.earth_moon.speedx, data.earth_moon.speedy, data.earth_moon.speedz);
    moon.buildBody();
    moon.setPosition(data.earth_moon.perihelionToEarth*100, 0, 0, 0);
    //moon.create_ellipse(-data.earth_moon.perihelionToEarth, 0, data.earth_moon.perihelionToEarth, data.earth_moon.apheliaToEarth); 
    
    spaceObjects.push(moon);
    
    //mars
    group5_mars = new THREE.Group();
    scene.add(group5_mars);
    mars = new SpaceObject("Mars", data.mars.mass, data.mars.radius*BLOW, {color: 0x99ff55}, group5_mars, data.mars.speedx, data.mars.speedy, data.mars.speedz);
    mars.buildBody();
    mars.setPosition(data.mars.perihelion,0,0,0);
    group_mars_rotate = new THREE.Group();
    group_mars_rotate.add(group5_mars);
    group_mars_rotate.add(group_galaxy);
    scene.add(group_mars_rotate);
    
    spaceObjects.push(mars);
    
    //jupiter
    group6_jupiter = new THREE.Group();
    scene.add(group6_jupiter);
    jupiter = new SpaceObject("Jupiter", data.jupiter.mass, data.jupiter.radius*BLOW, {color: 0xFF8C00}, group6_jupiter, data.jupiter.speedx, data.jupiter.speedy, data.jupiter.speedz);
    jupiter.buildBody();
    jupiter.setPosition(data.jupiter.perihelion,0,0,0);
    group_jupiter_rotate = new THREE.Group();
    group_jupiter_rotate.add(group6_jupiter);
    group_jupiter_rotate.add(group_galaxy);
    scene.add(group_jupiter_rotate);
    
    spaceObjects.push(jupiter);
    
    //saturn
    group7_saturn = new THREE.Group();
    scene.add(group7_saturn);
    saturn = new SpaceObject("Saturn", data.saturn.mass, data.saturn.radius*BLOW, {color: 0xF4A460}, group7_saturn, data.saturn.speedx, data.saturn.speedy, data.saturn.speedz);
    saturn.buildBody();
    saturn.setPosition(data.saturn.perihelion,0,0,0);
    group_saturn_rotate = new THREE.Group();
    group_saturn_rotate.add(group7_saturn);
    group_saturn_rotate.add(group_galaxy);
    scene.add(group_saturn_rotate);
    
    spaceObjects.push(saturn);
    
    //uranus
    group8_uranus = new THREE.Group();
    scene.add(group8_uranus);
    uranus = new SpaceObject("Uranus", data.uranus.mass, data.uranus.radius*BLOW, {color: 0x20B2aa}, group8_uranus, data.uranus.speedx, data.uranus.speedy, data.uranus.speedz);
    uranus.buildBody();
    uranus.setPosition(data.uranus.perihelion,0,0,0);
    group_uranus_rotate = new THREE.Group();
    group_uranus_rotate.add(group8_uranus);
    group_uranus_rotate.add(group_galaxy);
    scene.add(group_uranus_rotate);
    
    spaceObjects.push(uranus);
    
    //neptune
    group9_neptune = new THREE.Group();
    scene.add(group9_neptune);
    neptune = new SpaceObject("Neptune", data.neptune.mass, data.neptune.radius*BLOW, {color: 0x2F4F4F}, group9_neptune, data.neptune.speedx, data.neptune.speedy, data.neptune.speedz);
    neptune.buildBody();
    neptune.setPosition(data.neptune.perihelion,0,0,0); 
    group_neptune_rotate = new THREE.Group();
    group_neptune_rotate.add(group9_neptune);
    group_neptune_rotate.add(group_galaxy);
    scene.add(group_neptune_rotate);  
    
    spaceObjects.push(neptune);*/
}

//create a planet with mesh, position and orbit
//SpaceObject(name of object, mass of object, radius(size) of object, parameters, in which group object is)
function SpaceObject(name, mass, radius, color, group, speedx, speedy, speedz){
    var mesh;
    this.name = name;
    this.mass = mass;
    this.radius = radius;
    this.color = color;
    this.group = group;
    this.speedx = speedx;
    this.speedy = speedy;
    this.speedz = speedz;

    this.buildBody = function(){
        var geometry = new THREE.SphereGeometry( radius, segments, segments );
        var material = new THREE.MeshPhongMaterial( color );
        mesh = new THREE.Mesh(geometry,  material);
        group.add( mesh ); 
        
        //point LOD (level of detail)
        //kleine 16x16 textur, alphamap
        var dotGeometry = new THREE.Geometry();
        dotGeometry.vertices.push(new THREE.Vector3( 0, 0, 0));
        var loader = new THREE.TextureLoader();
        var material_point = new THREE.PointsMaterial({color:0xffffff, size:8, sizeAttenuation:false, map: loader.load("textures/earth.png")});
        var mesh_point = new THREE.Points(dotGeometry,  material_point);
        
        group.add( mesh_point );
        //spaceObjects.push(mesh);
    }

    this.setPosition = function(x,y,z, equatorial_inclination){
        group.position.set(x,y,z);
        mesh.rotation.z = equatorial_inclination * Math.PI / 180;      
    }

    this.create_ellipse = function(aX, aY, aphelion, perihelion){
        var segments = 1000;
        var curve = new THREE.EllipseCurve(      
            aX,  aY,                // aX, aY
            aphelion, perihelion,   // xRadius, yRadius
            0,  2 * Math.PI,        // aStartAngle, aEndAngle
            false,                  // aClockwise
            0                       // aRotation
        );

        var path = new THREE.Path( curve.getPoints( segments ) );
        var path_geometry = path.createPointsGeometry( segments );
        var path_material = new THREE.LineBasicMaterial( color );

        var ellipse = new THREE.Line( path_geometry, path_material );
        ellipse.rotation.x = Math.PI*.5;
        group.add( ellipse );
    }
    
    this.setLabel = function(){
        /*var lbl = makeTextSprite("hello");
        lbl.position.set(0, 0, 0);
        lbl.scale.set(1000,1000,1000);
        scene.add(lbl);
        function makeTextSprite( message ) {
            var canvas = document.createElement('canvas');
            canvas.width = 64;
            canvas.height = 64;
            var context = canvas.getContext('2d');
            context.font = "24px Arial";
            context.fillStyle = "rgba(255,0,0,1)";
            context.fillText('Earth!', 0, 64);
            var texture = new THREE.Texture(canvas)
            texture.needsUpdate = true;
            var material = new THREE.SpriteMaterial( { map: texture, color: 0xffffff, fog: true } );
            var sprite = new THREE.Sprite( material );
            return sprite;  
        }*/
    }
}

//this renders the scene
function render() {
    
    requestAnimationFrame( render );
    //setTimeout (render, 1000/60);

    // current time in ms since 1.1.1970 -> 00:00:00 UTC Worldtime 
    now = Date.now();
    difftime = (now - lasttime) * 1e-3;
    
    difftime *= 1e3;
    
    calculatePhysics(difftime, spaceObjects);
    

    //rotation mercury
    //sphere_mercury.position.x += 1;
    //time += 0.0003;
    
    //Movement for groups
    /*
    group1_sun.rotateY(0.0001);
    group2_earth.rotateY(0.01);
    group_mercury_rotate.rotateY(0.04);
    group_earth_rotate.rotateY(0.001);
    group_venus_rotate.rotateY(0.05);
    group_mars_rotate.rotateY(0.003);
    group_jupiter_rotate.rotateY(0.09);
    group_saturn_rotate.rotateY(0.08);
    group_uranus_rotate.rotateY(0.07);
    group_neptune_rotate.rotateY(0.04);
    */
    
    
    if (stats !== undefined) {
        stats.update();
        //controls.update();
    }
    if (renderer !== undefined) {
        renderer.render( scene, camera );
    }
    
    //console.log (Date.now() - now);
    lasttime = now;
}

 return universe;
}