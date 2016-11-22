function buildUniverse(){

    
//Instant Vairables
var universe = {};
var container, stats;
var camera, controls, scene, renderer, raycaster;
var bulbLight, bulbMat;
var time = 0;
var segments = 64;
var group_galaxy, group1_sun, group2_earth, group3_moon,
    group4_mercury, group5_venus, group6_mars, group7_jupiter,
    group8_saturn, group9_uranus, group10_neptune;
var spaceObjects = [];
var mouse = new THREE.Vector2(), INTERSECTED;

var group_test, group_test2;
    
universe.init = init;
universe.render = render;

function init(data){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60 , window.innerWidth/window.innerHeight , 0.01, 1e27);
    camera.position.set( 0, 0, data.sun.radius + 10e10 );


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

    
    
/*  //point LOD (level of detail)
    //kleine 16x16 textur, alphamap
    var dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(new THREE.Vector3( 0, 0, 0));
    var material = new THREE.PointsMaterial({color:0xffffff, size:10, sizeAttenuation:false});
    var mesh = new THREE.Points(dotGeometry,  material);
    mesh.position.x = 15000;
    mesh.position.y = 1000;
    scene.add( mesh );
*/

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
    window.addEventListener( 'click', onMouseClick, false );
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
    
    //sun
    group1_sun = new THREE.Group();
    scene.add(group1_sun);
    var sun = new SpaceObject("Sun", data.sun.mass, data.sun.radius*10, {emissive: 0xffff80, color: 0x000000, specular: 0 }, group1_sun );
    sun.buildBody();
    sun.setLabel();

    //earth
    group2_earth = new THREE.Group();
    scene.add(group2_earth);
    var earth = new SpaceObject("Earth", data.earth.mass, data.earth.radius*1000, {color: 0x0099ff}, group2_earth);
    earth.buildBody();
    earth.setPosition(data.earth.perihelion,0,0, data.earth.eququatorial_inclination);
    //earth.create_ellipse(-data.earth.perihelion, 0, data.earth.perihelion, data.earth.aphelia);
    group_earth_rotate = new THREE.Group();
    group_earth_rotate.add(group2_earth);
    group_earth_rotate.add(group_galaxy);
    scene.add(group_earth_rotate);
    
    //earth_moon
    group3_moon = new THREE.Group();
    group2_earth.add(group3_moon);
    var moon = new SpaceObject("Moon", data.earth_moon.mass, data.earth_moon.radius*1000, {color: 0x999999}, group3_moon);
    moon.buildBody();
    moon.setPosition(data.earth_moon.perihelionToEarth*100, 0, 0, 0);
    //moon.create_ellipse(-data.earth_moon.perihelionToEarth, 0, data.earth_moon.perihelionToEarth, data.earth_moon.apheliaToEarth);  
    
    //mercury
    group4_mercury = new THREE.Group();
    scene.add(group4_mercury);
    var mercury = new SpaceObject("Mercury", data.mercury.mass, data.mercury.radius*1000, {color: 0x555555}, group4_mercury);
    mercury.buildBody();
    mercury.setPosition(data.mercury.perihelion,0,0,0);
    group_mercury_rotate = new THREE.Group();
    group_mercury_rotate.add(group4_mercury);
    group_mercury_rotate.add(group_galaxy);
    scene.add(group_mercury_rotate);
    
    //venus
    group5_venus = new THREE.Group();
    scene.add(group5_venus);
    var venus = new SpaceObject("Venus", data.venus.mass, data.venus.radius*1000, {color: 0xff5555}, group5_venus);
    venus.buildBody();
    venus.setPosition(data.venus.perihelion,0,0,0);
    group_venus_rotate = new THREE.Group();
    group_venus_rotate.add(group5_venus);
    group_venus_rotate.add(group_galaxy);
    scene.add(group_venus_rotate);
    
    //mars
    group6_mars = new THREE.Group();
    scene.add(group6_mars);
    var mars = new SpaceObject("Mars", data.mars.mass, data.mars.radius*1000, {color: 0x99ff55}, group6_mars);
    mars.buildBody();
    mars.setPosition(data.mars.perihelion,0,0,0);
    group_mars_rotate = new THREE.Group();
    group_mars_rotate.add(group6_mars);
    group_mars_rotate.add(group_galaxy);
    scene.add(group_mars_rotate);
    
    //jupiter
    group7_jupiter = new THREE.Group();
    scene.add(group7_jupiter);
    var jupiter = new SpaceObject("Jupiter", data.jupiter.mass, data.jupiter.radius*1000, {color: 0xFF8C00}, group7_jupiter);
    jupiter.buildBody();
    jupiter.setPosition(data.jupiter.perihelion,0,0,0);
    group_jupiter_rotate = new THREE.Group();
    group_jupiter_rotate.add(group7_jupiter);
    group_jupiter_rotate.add(group_galaxy);
    scene.add(group_jupiter_rotate);
    
    //saturn
    group8_saturn = new THREE.Group();
    scene.add(group8_saturn);
    var saturn = new SpaceObject("Saturn", data.saturn.mass, data.saturn.radius*1000, {color: 0xF4A460}, group8_saturn);
    saturn.buildBody();
    saturn.setPosition(data.saturn.perihelion,0,0,0);
    group_saturn_rotate = new THREE.Group();
    group_saturn_rotate.add(group8_saturn);
    group_saturn_rotate.add(group_galaxy);
    scene.add(group_saturn_rotate);
    
    //uranus
    group9_uranus = new THREE.Group();
    scene.add(group9_uranus);
    var uranus = new SpaceObject("Saturn", data.uranus.mass, data.uranus.radius*1000, {color: 0x20B2aa}, group9_uranus);
    uranus.buildBody();
    uranus.setPosition(data.uranus.perihelion,0,0,0);
    group_uranus_rotate = new THREE.Group();
    group_uranus_rotate.add(group9_uranus);
    group_uranus_rotate.add(group_galaxy);
    scene.add(group_uranus_rotate);
    
    //neptune
    group10_neptune = new THREE.Group();
    scene.add(group10_neptune);
    var neptune = new SpaceObject("Saturn", data.neptune.mass, data.neptune.radius*1000, {color: 0x2F4F4F}, group10_neptune);
    neptune.buildBody();
    neptune.setPosition(data.neptune.perihelion,0,0,0); 
    group_neptune_rotate = new THREE.Group();
    group_neptune_rotate.add(group10_neptune);
    group_neptune_rotate.add(group_galaxy);
    scene.add(group_neptune_rotate);   
}

//create a planet with mesh, position and orbit
//SpaceObject(name of object, mass of object, radius(size) of object, parameters, in which group object is)
function SpaceObject(name, mass, radius, color, group){
    var mesh;
    this.name = name;
    this.mass = mass;
    this.radius = radius;
    this.color = color;
    this.group = group;

    this.buildBody = function(){
        var geometry = new THREE.SphereGeometry( radius, segments, segments );
        var material = new THREE.MeshPhongMaterial(color);
        mesh = new THREE.Mesh(geometry,  material);
        group.add( mesh ); 
        spaceObjects.push(mesh);
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
    //requestAnimationFrame( render );

    //rotation mercury
    //sphere_mercury.position.x += 1;
    //time += 0.0003;
    
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
    
    
    if (stats !== undefined) {
        stats.update();
        //controls.update();
    }
    if (renderer !== undefined) {
        renderer.render( scene, camera );
    }
}
    
 return universe;
}