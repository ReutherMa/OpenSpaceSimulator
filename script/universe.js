// fill global with key-values, datatype: boolean
var global = {};
var dae;
var spaceObjects = {};
var camera, controls;
var changed = false;

//change camera to planet
function switchCamera( planet ){
    changed = true;
    for (e in spaceObjects){
        if (e == planet){
            var objPos = spaceObjects[e].group.position;
            camera.lookAt(objPos);
            controls.target.set(objPos.x, objPos.y, objPos.z);
            //console.log(camera);
            //camera.position.set(0,0,0);
            /*camera.position.x = spaceObjects[e].group.position.x;
            camera.position.y = spaceObjects[e].group.position.y;
            camera.position.z = spaceObjects[e].group.position.z + 3*spaceObjects[e].radius;*/
            //camera.lookAt(spaceObjects[e].group.position.x,spaceObjects[e].group.position.y,spaceObjects[e].group.position.z );
            //camera.updateProjectionMatrix();
            //controls.update();
            //camera.updateMatrixWorld();
            //console.log(spaceObjects[e].group.position);
        }
    }
}


function buildUniverse(){
    
//loaders
var loader = new THREE.TextureLoader();
    
//Instant Variables
var universe = {};
var container, stats;
var scene, renderer, raycaster;
var bulbLight, bulbMat;
var segments = 64;
var group_galaxy, group1_sun, group2_mercury, group3_venus, group4_earth, group41_moon, group5_mars, group6_jupiter,
    group7_saturn, group8_uranus, group9_neptune;

var sun, earth, moon, mercury, venus, mars, jupiter, saturn, uranus, neptune;
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
    //camera.position.set( data.earth.x, data.earth.y, data.earth.z +6371.00e3 ); //EARTH

    buildSkybox();

/*  var helper = new THREE.GridHelper( 10000, 20, 0xffffff, 0xffffff );
    scene.add( helper ); */

    var ambLight = new THREE.AmbientLight(0x3e3e3e3e); //0x3e3e3e3e
    scene.add(ambLight);

    //light_shader
    var fShader = document.getElementById("fragmentshader");
    var vShader = document.getElementById("vertexshader");
    var shaderMaterial = new THREE.ShaderMaterial({
        vertexShader: vShader.textContent,
        fragmentShader: fShader.textContent
    });

    buildGalaxy();
    buildPlanets(data);
    //placeRocket(); 
    
/*    document.addEventListener('mousedown', onMouseDown, false);

    function onMouseDown(e) {
        var vectorMouse = new THREE.Vector3( //vector from camera to mouse
            -(window.innerWidth/2-e.clientX)*2/window.innerWidth,
            (window.innerHeight/2-e.clientY)*2/window.innerHeight,
            -1/Math.tan(22.5*Math.PI/180)); //22.5 is half of camera frustum angle 45 degree
        vectorMouse.applyQuaternion(camera.quaternion);
        vectorMouse.normalize();        
    
        var vectorObject = new THREE.Vector3(); //vector from camera to object
        vectorObject.set(object.x - camera.position.x,
                         object.y - camera.position.y,
                         object.z - camera.position.z);
        vectorObject.normalize();
        if (vectorMouse.angleTo(vectorObject)*180/Math.PI < 1) {
            //mouse's position is near object's position
        }
    }*/
    
    
    
/*              var pointLightTest = new THREE.PointLight( 0xff0000, 100, 0);
              //pointLightTest.castShadow = true;
              
              geometry_ = new THREE.SphereGeometry( 695508e3, segments, segments );
              material_ = new THREE.MeshPhongMaterial( {color: 0xff0000} );
              
              var point_mesh = new THREE.Mesh(geometry_,  material_);
              pointLightTest.position.set = ( 0, 0, 0);
              //point_mesh.add( pointLightTest );
              scene.add( pointLightTest )
              
    
    
                 //0 OBJECT
            var geometry = new THREE.SphereGeometry( 695508e3, 64, 64 );
            var material = new THREE.MeshPhongMaterial( { color: 0xff0000 } );
            var sphere_mercury = new THREE.Mesh( geometry, material );
            sphere_mercury.position.set(695508e3 * 3,0,0);
            sphere_mercury.castShadow = true;
            sphere_mercury.receiveShadow = true;
            scene.add( sphere_mercury );
            
            //1 OBJECT
            var geometry = new THREE.SphereGeometry( 695508e3, 64, 64 );
            var material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
            var sphere_mercury = new THREE.Mesh( geometry, material );
            sphere_mercury.castShadow = true;
            sphere_mercury.receiveShadow = true;
            sphere_mercury.position.set(695508e3 * 6,0,0);
            scene.add( sphere_mercury );*/
    

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
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;
    //console.log(renderer.shadowMap);
    //renderer.setDepthTest(true);
    container = document.getElementById( 'container' );
    container.appendChild( renderer.domElement );
    stats = new Stats();
    container.appendChild( stats.dom );
    window.addEventListener( 'resize', onWindowResize, false );
    //window.addEventListener( 'click', onMouseClick, false );
    
    //controls
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    //controls.addEventListener( 'change', render );

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
        //console.log("now");
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
        
        var LocalBlow = globalInterfaceValues.planetSize;
        //console.log(LocalBlow);
        //if planet has a base for example: earth and earth moon
        var base = data[planet].base;
        //console.log(base);
        
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
            
            var planet_object = new SpaceObject(planet, data[planet].mass, data[planet].radius * LocalBlow, data[planet].color, group_name, data[planet].speedx, data[planet].speedy, data[planet].speedz);
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
    
            function placeRocket(){
            var loader = new THREE.ColladaLoader();
            loader.options.convertUpAxis = true;
            loader.load( "models/launchpad.dae", function ( collada ) {
            
    
                dae = collada.scene;
                //var skin = collada.skins[ 0 ];
        
                dae.position.set(spaceObjects.earth.group.position.x+spaceObjects.earth.radius, spaceObjects.earth.group.position.y, spaceObjects.earth.group.position.z);//x,z,y- if you think in blender dimensions ;)
                dae.scale.set(695508e3,695508e3,695508e3);
                //dae.color="rgb(153, 190, 153)";
                scene.add(dae);
                console.log("rocket function is called");
                console.log(spaceObjects.earth.group.position.x);
    
            }); 
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
          
          var geometry;
          var material;
          //texture
          if ( name == "sun" ){
              var pointLight = new THREE.PointLight( 0xffffe0, 2, 0);
              //pointLight.castShadow = true;
              scene.add( pointLight );
              
              geometry = new THREE.SphereGeometry( radius, segments, segments );
              material = new THREE.MeshPhongMaterial( color );
              
              mesh = new THREE.Mesh(geometry,  material);
              pointLight.add( mesh );
              
          }else{
              var path = "textures/"+name+".png";
              geometry = new THREE.SphereGeometry( radius, segments, segments );
              material = new THREE.MeshPhongMaterial( {color: 0xffffff} );
              
              
              var path_tex = "textures/"+name;
              material.map = loader.load(path_tex+"_map.jpg");
              material.bumpMap =  loader.load(path_tex+"_bumpmap.jpg");
              material.bumpScale = 4.0;
              
              if (name == "earth"){
                  material.specularMap    = loader.load(path_tex+"_mapspec.jpg");
                  material.specular  = new THREE.Color(0x111111); 
                  var geometry_cloud   = new THREE.SphereGeometry(radius*1.02, segments, segments);  
                  var material_cloud  = new THREE.MeshPhongMaterial({
                      map         : loader.load(path_tex+"_mapcloud.png"),
                      side        : THREE.DoubleSide,
                      opacity     : 0.8,
                      transparent : true,
                      depthWrite  : true,
                  });
                  var cloudMesh = new THREE.Mesh(geometry_cloud, material_cloud);
                  group.add( cloudMesh );
              }
              mesh = new THREE.Mesh(geometry,  material);
              mesh.castShadow = true;
              mesh.receiveShadow = true;
          }
          group.add( mesh ); 
          
          //point level of detail with texture
          var dot_path = "textures/"+name+".png";
          var dotGeometry = new THREE.Geometry();
          dotGeometry.vertices.push(new THREE.Vector3( 0, 0, 0));
          var material_point = new THREE.PointsMaterial({color:0xffffff, size:4, sizeAttenuation:false, map: loader.load(dot_path)});
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
        var material_name = new THREE.PointsMaterial({color:0xffffff, size:64, sizeAttenuation:false, map: loader.load(path)});
        material_name.transparent = true;
        material_name.depthTest = false;
        var mesh_name = new THREE.Points(nameGeometry,  material_name);
        mesh_name.position.x = radius*2;
        group.add( mesh_name );
    }
}
    
function UIChanges(){
    var localBlow = globalInterfaceValues.planetSize/1000;
    var localPlanet = globalInterfaceValues.planetName;
    spaceObjects[localPlanet].group.children[0].scale.set(localBlow,localBlow,localBlow);
    
}
    
//this renders the scene
function render() {
    
    UIChanges();
    console.log(globalControlValues.keyStartPause);
    
    
        
    requestAnimationFrame( render );
    //setTimeout (render, 1000/60);

    // current time in ms since 1.1.1970 -> 00:00:00 UTC Worldtime 
    now = Date.now();
    difftime = (now - lasttime) * 1e-3;
    
    difftime *= 1e2;
    
    if(!globalControlValues.keyStartPause){
    calculatePhysics(difftime, spaceObjects);
    }

    //rotation mercury
    //sphere_mercury.position.x += 1;
    //time += 0.0003;
    
    //Movement for groups
    //console.log(spaceObjects.sun.group.children[0]); MESH
    spaceObjects.sun.group.children[0].rotateY(0.5);
    
    //Earth cloudmap moving
    spaceObjects.earth.group.children[0].rotateY(0.0001);
    /*
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
    //console.log (spaceObjects.earth.speedy);
    }


    

 return universe;
}
