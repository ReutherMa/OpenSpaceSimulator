// fill global with key-values, datatype: boolean
var global = {};

function buildUniverse(){

//constants
const BLOW = 1;
    
//loaders
var loader = new THREE.TextureLoader();
    
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
    //camera.position.set( data["earth"].x, data["earth"].y, data["earth"].z +6371.00e3 ); EARTH

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

    buildGalaxy();
    buildPlanets(data);

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

//build the galaxy
function buildGalaxy(){
    group_galaxy = new THREE.Group();
    group_galaxy.position.set(0,0,0);
    scene.add(group_galaxy);
}

//build the planets
function buildPlanets(data){
    
    for (var planet in data){
        //if planet has a base for example: earth and earth moon
        var base = data[planet].base;
        console.log(base);
        
        //if "planet" is a star -> different object
        if (data[planet].star === true){
            var group_name = new THREE.Group();
            scene.add(group_name);        
            var planet_object = new SpaceObject(planet, data[planet].mass, data[planet].radius, {emissive: 0xffff80, color: 0x000000, specular: 0 }, group_name);
            planet_object.buildBody();
            spaceObjects[planet] = planet_object;
            planet_object.setLabel();
            
        //normal planets    
        }else{
            var group_name = new THREE.Group();
            scene.add(group_name);
            //console.log(data[planet].color);
            var planet_object = new SpaceObject(planet, data[planet].mass, data[planet].radius*BLOW, data[planet].color, group_name, data[planet].speedx, data[planet].speedy, data[planet].speedz);
            planet_object.buildBody();
            planet_object.setLabel();
            
            // for base onjects around other planets
            var posx = data[planet].x;
            var posy = data[planet].y;
            var posz = data[planet].z;
            if (base){
                posx += data[base].x;
                posy += data[base].y;
                posz += data[base].z;
            }
            planet_object.setPosition(posx, posy, posz, 0);
            spaceObjects[planet] = planet_object;
            planet_object.createEllipse(0, 0, data[planet].aphelia, data[planet].perihelion, group_galaxy);
            planet_object.setLabel();
            //console.log(planet + posx);
        }
    }
    
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
        var path = "textures/"+name+".png";
        var geometry = new THREE.SphereGeometry( radius, segments, segments );
        var material = new THREE.MeshPhongMaterial( color );
        mesh = new THREE.Mesh(geometry,  material);
        group.add( mesh ); 
        
        //point level of detail with texture
        var dotGeometry = new THREE.Geometry();
        dotGeometry.vertices.push(new THREE.Vector3( 0, 0, 0));
        var material_point = new THREE.PointsMaterial({color:0xffffff, size:4, sizeAttenuation:false, map: loader.load(path)});
        material_point.transparent = true;
        var mesh_point = new THREE.Points(dotGeometry,  material_point);
        group.add( mesh_point );
    }

    this.setPosition = function(x, y, z, equatorial_inclination){
        group.position.set(x, y, z);
        mesh.rotation.z = equatorial_inclination * Math.PI / 180;      
    }

    //ellipse around planet
    this.createEllipse = function(aX, aY, aphelion, perihelion, center){
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
        //ellipse.rotation.x = Math.PI*.5;
        center.add( ellipse );
    }
    
    //name above planet
    this.setLabel = function(){
        var path = "textures/"+name+"_label.png";
        var nameGeometry = new THREE.Geometry();
        nameGeometry.vertices.push(new THREE.Vector3( 0, 0, 0));
        var material_name = new THREE.PointsMaterial({color:0xffffff, size:128, sizeAttenuation:false, map: loader.load(path)});
        material_name.transparent = true;
        var mesh_name = new THREE.Points(nameGeometry,  material_name);
        mesh_name.position.x = radius*2;
        group.add( mesh_name );
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