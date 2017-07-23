/* 
This program is licensed under the GNU General Public License as described in the file „LICENSE“
Copyright (C) 2017 TH Nürnberg
Authors: Marius Reuther Franziska Braun, Lea Uhlenbrock, Selina Forster, Theresa Breitenhuber, Marco Lingenhöl
Contact: openspacesimulation@gmail.com
*/



//fill global with key-values, datatype: boolean
var global = {
    started: false,
    audio: false,
    fuelPrompt: false //false means hasnt been shown yet
};

//do we want to load textures? false for fast (and ugly) debugging mode
var loadTextures = false;
var throttleSound;
var rocket;
var rocketGroup;
var launchpad;
var launchpadGroup;

var spaceTaxiUsed = false;

var particleSystem;
var spawnerOptions;
var options;
var firePower; 
var tick = 0;
var clock = new THREE.Clock();

var ground_mesh;

var spaceObjects = {};
var camera, controls, ui_camera, lens_camera;
var camFactor = 6;

var line_count = 0;

var sphere_nav;
var scene;

var renderNavball = true;

//variables that indicate, if these pieces are already ready
//are used for loading screen
var readyVars = {
    physics : false,
    rocket : false,
    planets : false,
    interface : false,
    navball : false,
    launchpad : false,
    ground: false,
    skybox: false,
    earthshader : false,
    render : false,
    particleSystem : false,
    animate : false
}

var renderCounter = 0;

/* Builds the whole Galaxy */
function buildUniverse() {

    //loaders
    var loader = new THREE.TextureLoader();

    //Instant Variables
    var universe = {};
    var container;
    //, stats

    var sceneVol, ui_scene, renderer, lens_scene;

    var segments = 64;
    var group_galaxy;
    var sun, earth, moon, mercury, venus, mars, jupiter, saturn, uranus, neptune;
    var camElement;
    var audioLoader, audioListener, sound;
    
    var uniforms1;
    var mesh_sun;

    //variables for physics
    var now, difftime;
    var lasttime;
    var newPos, lastPos, diffPos;
    
    var counter = 1;

    
    var height_atmos = 100000;
    var renderCount = 0;
    
    //SHADOW
    
    //Variables for shadow
    //var mesh_torus,    mesh_ground,    mesh_moon,    mesh_earth,    mesh_mars;
    //var meshVol_torus, meshVol_ground, meshVol_moon, meshVol_earth, meshVol_mars;
    /*var arr_geoVol  = [];
    var arr_faceNum = [];
    var arr_shader  = [];
    var arr_meshVol = [];
    var arr_mesh    = [];
    */
    var un_test = {
        texture: { value: loader.load( "textures/earth_moon_map.jpg" ) }
    };
    
    var color1 = [new THREE.Color(0x00ffff), new THREE.Color(0xff0000), new THREE.Color(0xff0000)];
    var color2 = [new THREE.Color(0x00ffff), new THREE.Color(0x00ffff), new THREE.Color(0xff0000)];
    
    var lightVec = new THREE.Vector3( -1, -1, -1);         
    var light = new THREE.Vector3().copy(lightVec).negate().normalize();

    //universe functions
    universe.init = init;
    universe.render = render;
    
    //uniforms
    uniforms1 = {
        sunPosition:     { value: new THREE.Vector4(0.0,0.0,0.0,1.0) },
        dayTexture:      { value: loader.load( "textures/earth_map.jpg" ) },
        nightTexture:    { value: loader.load( "textures/earth_map_lights_2.jpg" )},
        specularTexture: { value: loader.load( "textures/earth_mapspec_2.png" ) },
        bumpTexture:     { value: loader.load( "textures/earth_normalmap_test.png" ) },
        scale: { type: "f", value: 1e4 },
        displacement: { type: "f", value: 1e-2},
        time: { type: "f", value: 0}
    };

    /* The initial State */
    function init(data) {
        //creating a scene, camera
        scene    = new THREE.Scene();
        sceneVol = new THREE.Scene();
        camera   = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1e27); //1e27
        //camera.position.set(0, 0, 695508e3 + 10e10);
        //camera.lookAt (scene.position);
        //camera.position.set( data.earth.x, data.earth.y, data.earth.z +6371.00e3 ); //EARTH

        //second scene + camera for UI
        ui_scene = new THREE.Scene();
        lens_scene = new THREE.Scene();
        ui_camera = new THREE.OrthographicCamera( -window.innerWidth/camFactor,         
                                                    window.innerWidth/camFactor,
                                                    window.innerHeight/camFactor,
                                                    -window.innerHeight/camFactor, 
                                                    0, 1e27);
        ui_camera.position.set(0, 0, 10);
        lens_camera = camera;
        //building the skybox
        buildSkybox();
        
        //audio
        audioListener = new THREE.AudioListener();
        camera.add( audioListener );
        sound = new THREE.Audio( audioListener );
        scene.add( sound );
        audioLoader = new THREE.AudioLoader();
        audioLoader.load( 'sounds/background.ogg', function( buffer ) {
            sound.setBuffer( buffer );
            sound.setLoop(true);
            sound.setVolume(0.5);
            sound.play();
        });
        throttleSound = new THREE.PositionalAudio( audioListener );
            scene.add( throttleSound );
            audioLoader = new THREE.AudioLoader();
            audioLoader.load( 'sounds/throttle.ogg', function( buffer ) {
                throttleSound.setBuffer( buffer );
                throttleSound.setRefDistance( 200 );
                throttleSound.setLoop(true);
                throttleSound.setVolume(0.0);
                throttleSound.play();
        });
        
        /* Helpers 
        //axisHelper
        var axisHelper = new THREE.AxisHelper(1e15); //
        //scene.add(axisHelper);
        var helper = new THREE.GridHelper( 10000, 20, 0xffffff, 0xffffff );
        scene.add( helper ); 
        */

        //creating an ambient light
        //var ambLight = new THREE.AmbientLight(0x3e3e3e3e); //0x3e3e3e3e
        //scene.add(ambLight);


        

        //building the Galaxy, Planets and Rocket
        buildGalaxy();
        buildPlanets(data);
        placeRocket();
        placeLaunchpad();
        
        placeGround();
        
        buildNavBall();
        
        //lensflare
        
        var lenslight = new THREE.PointLight( 0xffffff, 1.5, 0 );
        lenslight.position.set(0,0,0); //695508e3 + 1000
        scene.add(lenslight);
        var textureLoader = new THREE.TextureLoader();
        var textureFlare1 = textureLoader.load( "/textures/lens1.png" );
		var textureFlare2 = textureLoader.load( "/textures/lens2.png" );
		var textureFlare3 = textureLoader.load( "/textures/lens3.png" );

        //textureFlare.depthTest = false;
        var flareColor = new THREE.Color( 0xffffff );
        flareColor.setHSL( 0.55, 0.9 , 0.5 + 0.5 );
        
        lensFlare = new THREE.LensFlare( textureFlare1, 800, 0.0, THREE.AdditiveBlending, flareColor );
        //lensFlare.add ( textureFlare2, 30, 0.1, THREE.AdditiveBlending, flareColor );
        //lensFlare.add ( textureFlare2, 40, 0.2, THREE.AdditiveBlending, flareColor );
        //lensFlare.add ( textureFlare2, 80, 0.2, THREE.AdditiveBlending, flareColor );
        //lensFlare.add ( textureFlare2, 20, 0.4, THREE.AdditiveBlending, flareColor );
        //lensFlare.add ( textureFlare2, 20, 0.5, THREE.AdditiveBlending, flareColor );
        lensFlare.add ( textureFlare2, 50, 0.6, THREE.AdditiveBlending, flareColor );
        lensFlare.add ( textureFlare2, 90, 0.7, THREE.AdditiveBlending, flareColor );
        lensFlare.add ( textureFlare2, 100, 0.7, THREE.AdditiveBlending, flareColor );
        lensFlare.add ( textureFlare2, 300, 0.8, THREE.AdditiveBlending, flareColor );
        lensFlare.add ( textureFlare2, 60, 0.8, THREE.AdditiveBlending, flareColor );
        lensFlare.add ( textureFlare2, 100, 0.9, THREE.AdditiveBlending, flareColor );
        lensFlare.add ( textureFlare2, 70, 0.95, THREE.AdditiveBlending, flareColor );
        
        lensFlare.add ( textureFlare3, 1000, 0.0, THREE.AdditiveBlending, flareColor );
        lensFlare.add ( textureFlare3, 1200, 0.0, THREE.AdditiveBlending, flareColor );
        
        lensFlare.position.copy( lenslight.position );
        //lensFlare.position.set(0,0,0);
        scene.add( lensFlare );
        
        
        

        
        //Shadow
       /* shadowVolume_mat = new THREE.ShaderMaterial({
            vertexShader: document.getElementById('shadowVolume_vs').textContent,
            vertexColors: THREE.VertexColors,
            fragmentShader: document.getElementById('shadowVolume_fs').textContent
        });
        
        for ( var i=0; i< arr_meshVol; i++){
            arr_meshVol[i].material = shadowVolume_mat;
        }
        
        
        ambient_spaceObj_mat = new THREE.ShaderMaterial({
            vertexShader: document.getElementById('ambient_spaceObj_vs').textContent,
			fragmentShader: document.getElementById('ambient_spaceObj_fs').textContent
		});
        
        shaderMat_basic = new THREE.ShaderMaterial({
            uniforms: { l: {type: "v3", value: light} },
            vertexShader: document.getElementById('diffSpec_spaceObj_vs').textContent,
            fragmentShader: document.getElementById('diffSpec_spaceObj_fs').textContent
        });*/
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        

        //renderer
        renderer = new THREE.WebGLRenderer({
            antialias: true,
            logarithmicDepthBuffer: true,
            alpha: true
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        //renderer.setDepthTest(true);
        renderer.autoClear = false;
        
        container = document.getElementById('container');
        container.appendChild(renderer.domElement);
        //stats = new Stats();
        //container.appendChild(stats.dom);
        
        window.addEventListener('resize', onWindowResize, false);

        //controls
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        //controls = new THREE.TrackballControls(camera, renderer.domElement);
        //controls.addEventListener( 'change', render );

        lasttime = Date.now();
        var newView = new THREE.Vector3();
        newView.copy(camera.position);
        var localPos = camera.localToWorld(newView);
        lastPos = localPos;
    }

    /* Skybox */
    function buildSkybox() {
        var imagePrefix = "textures/stars_for_skybox1/";
        var directions = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
        var imageSuffix = ".png";

        var materialArray = [];
        for (var i = 0; i < 6; i++)
            materialArray.push(new THREE.MeshBasicMaterial({
                map: loader.load(imagePrefix + directions[i] + imageSuffix),
                side: THREE.BackSide
            }));

        var skyGeometry = new THREE.CubeGeometry(1e17, 1e17, 1e17); //26
        var skyMaterial = new THREE.MeshFaceMaterial(materialArray);
        var skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
        //skyMaterial.depthTest = false; for Lensflare
        //scene.add(skyBox);
        lens_scene.add(skyBox);
        readyVars.skybox = true;
    }

    /* When user changes size of window */
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        if (ui_camera.isOrthographicCamera) {
            ui_camera.left = -window.innerWidth / camFactor;
            ui_camera.right = window.innerWidth / camFactor;
            ui_camera.top = window.innerHeight / camFactor;
            ui_camera.bottom = -window.innerHeight / camFactor;
            ui_camera.updateProjectionMatrix();
        }
        renderer.setSize(window.innerWidth, window.innerHeight);
        //render(); no double calling
    }

    /* Build the galaxy */
    function buildGalaxy() {
        group_galaxy = new THREE.Group();
        group_galaxy.position.set(0, 0, 0);
        scene.add(group_galaxy);
    }

    /* Build the planets */
    function buildPlanets(data) {

        for (var planet in data) {
            var LocalBlow = globalInterfaceValues.planetSize;
            //if planet has a base for example: earth and earth_moon
            var data_plan = data[planet];
            var base = data_plan.base;
            //console.log(base);

            //if "planet" is a star -> different object
            if (data_plan.star === true) {
                var group_name = new THREE.Group();
                scene.add(group_name);
                var planet_object = new SpaceObject(planet, data_plan.mass, data_plan.radius, {
                    emissive: 0xffff80,
                    color: 0x000000,
                    specular: 0
                }, group_name);
                planet_object.buildBody();
                spaceObjects[planet] = planet_object;
                planet_object.setLabel();

                //normal planets    
            } else {
                var group_name = new THREE.Group();
                scene.add(group_name);
                //console.log(data[planet].color);

                //for base objects around other planets
                var posx   = data_plan.x;
                var posy   = data_plan.y;
                var posz   = data_plan.z;
                var speedx = data_plan.speedx;
                var speedy = data_plan.speedy;
                var speedz = data_plan.speedz;
                
                
                if (base) {
                    posx   += data[base].x;
                    posy   += data[base].y;
                    posz   += data[base].z;
                    speedx += data[base].speedx;
                    speedy += data[base].speedy;
                    speedz += data[base].speedz;
                }
                
                var planet_object = new SpaceObject(planet, data_plan.mass, data_plan.radius * LocalBlow, data_plan.color, group_name, speedx, speedy, speedz);
                planet_object.buildBody();
                planet_object.setLabel();

                planet_object.setPosition(posx, posy, posz, 0);
                spaceObjects[planet] = planet_object;
                //planet_object.createEllipse(0, 0, data_plan.aphelia, data_plan.perihelion, group_galaxy);
                planet_object.setLabel();
            }
        }
        readyVars.planets = true;
    }

    /* Places the Rocket into the Universe */
    function placeRocket() {
        
        //LOD
        var loader_2 = new THREE.TextureLoader();
        
            var dotGeometry = new THREE.Geometry();
            dotGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
            var material_point = new THREE.PointsMaterial({
                color: 0xffffff,
                size: 20,
                sizeAttenuation: false,
                map: loader_2.load("textures/rocket.png")
            });
            material_point.transparent = true;
            var mp = new THREE.Points(dotGeometry, material_point);
        
        
        var earthGroup = spaceObjects.earth.group;
        earthGroup.angularMomentum = new THREE.Quaternion(0,0,0,1);
        var xAxis = new THREE.Vector3();
        var yAxis = new THREE.Vector3();
        var zAxis = new THREE.Vector3();
        var quaternion = earthGroup.quaternion;
        var matrix = new THREE.Matrix4();
        matrix = matrix.makeRotationFromQuaternion ( quaternion );
        matrix.extractBasis(xAxis, yAxis, zAxis);
        earthGroup.angularMomentum.set (yAxis.x, yAxis.y, yAxis.z, 50) .normalize ();
        //earthGroup.quaternion.multiply(earthGroup.angularMomentum);
        
        var loader = new THREE.ColladaLoader(); 
        loader.options.convertUpAxis = true; 
      
        loader.load("models/saturnV_3.dae", function(collada) {   
            rocketGroup = new THREE.Group();
            
            rocketGroup.add(mp);
            
            rocket = collada.scene;
            rocket.name = "saturnV";
            spaceTaxiUsed = false;
            //var skin = collada.skins[ 0 ];
            //rocket.scale.set(695508e3, 695508e3, 695508e3);
            rocketGroup.add(rocket);
            scene.add(rocketGroup);
            var r = spaceObjects.earth.radius;
            var xE = r * Math.sin(Math.PI/180 * 45) * Math.cos(Math.PI/180 * 90);
            var yE = r * Math.sin(Math.PI/180 * 45) * Math.sin(Math.PI/180 * 90);
            var zE = r * Math.cos(Math.PI/180 * 45);
            var vec = new THREE.Vector3(xE, yE, zE);
            vec = vec.applyAxisAngle ( 1,0,0, Math.PI/180 * 120 );
            //rocketGroup.position.x = spaceObjects.earth.group.position.x + xE + 1;
            //rocketGroup.position.y = spaceObjects.earth.group.position.y + yE + 1;
            //rocketGroup.position.z = spaceObjects.earth.group.position.z + zE + 1;
            
            rocketGroup.position.x =  xE + 2;
            rocketGroup.position.y =  yE + 5;
            rocketGroup.position.z =  zE ;
             rocketGroup.speed = new THREE.Vector3 (0, 0, 0);
             rocketGroup.rotateX(Math.PI/180 * 45);
             rocketGroup.angularMomentum = new THREE.Quaternion(0,0,0,1);
             rocketGroup.angularAcceleration = new THREE.Quaternion(0,0,0,1);
             earthGroup.add(rocketGroup);
             rocketGroup.add(throttleSound);
            var axisH = new THREE.AxisHelper(1e7);
            rocketGroup.add(axisH);
            buildFire();
        });

        if(geo_line_rocket) scene.add( geo_line_rocket );
        earthGroup.add(geo_line_rocket);
        if(geo_line_rocket_future) scene.add( geo_line_rocket_future );
        earthGroup.add(geo_line_rocket_future);
        //var rocketObject = new SpaceObject();
        readyVars.rocket = true;
        //var rocketObject = new SpaceObject("rocket", 0, 0, "0x000000", "rocketGroup", rocketGroup.speed.x, rocketGroup.speed.y, rocketGroup.speed.z);
        //spaceObjects["rocket"] = planet_object;   
    }

    /* Places Launchpad */
    function placeLaunchpad() {
        var earthGroup = spaceObjects.earth.group;
        var loader = new THREE.ColladaLoader(); 
        loader.options.convertUpAxis = true; 
        loader.load("models/launchpad_font.dae", function(collada) {
            launchpadGroup = new THREE.Group();
            launchpad = collada.scene;   //var skin = collada.skins[ 0 ];
            launchpad.scale.set(10, 10, 10);
            launchpadGroup.add(launchpad);
            var r = spaceObjects.earth.radius;
            var xE = r * Math.sin(Math.PI/180 * 45) * Math.cos(Math.PI/180 * 90);
            var yE = r * Math.sin(Math.PI/180 * 45) * Math.sin(Math.PI/180 * 90);
            var zE = r * Math.cos(Math.PI/180 * 45);
            launchpadGroup.position.x = xE;
            launchpadGroup.position.y = yE +3 ;
            launchpadGroup.position.z = zE;
            launchpadGroup.rotateX(Math.PI/180 * 45);
            
            
            var axisH_launch = new THREE.AxisHelper(1e6);
            launchpadGroup.add(axisH_launch);
            //launchpadGroup.position.set(0, 0, 0 );
            earthGroup.add(launchpadGroup);
        });
        readyVars.launchpad = true;
    }
    
    /* Places Launchpad */
    function placeGround() {
        var earthGroup = spaceObjects.earth.group;
        
        var ground_geo = new THREE.PlaneGeometry(5000, 5000);
        var ground_mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true });
        ground_mat.map = loader.load("models/textures/launchgras.png");
        var ground_mesh = new THREE.Mesh(ground_geo, ground_mat);

        var r = spaceObjects.earth.radius;
        var xE = r * Math.sin(Math.PI/180 * 45) * Math.cos(Math.PI/180 * 90);
        var yE = r * Math.sin(Math.PI/180 * 45) * Math.sin(Math.PI/180 * 90);
        var zE = r * Math.cos(Math.PI/180 * 45);
        ground_mesh.position.x = xE + 1;
        ground_mesh.position.y = yE + 1;
        ground_mesh.position.z = zE + 1;
        ground_mesh.rotateX(Math.PI/180 * -45);

        earthGroup.add(ground_mesh);
        readyVars.ground = true;
    }
    
    //Rocket-Fire
    function buildFire(){
            particleSystem = new THREE.GPUParticleSystem( {
				maxParticles: 10000
			} );
            rocketGroup.add(particleSystem);
        
        options = {
            position: new THREE.Vector3(),
				positionRandomness: 0,
				velocity: new THREE.Vector3(),
				velocityRandomness: 1.3,
                color: 0xff5500,
				colorRandomness: .5,
				turbulence: 0,
				lifetime: 0,
                size: 2,
                sizeRandomness: 2
        };
        options.position.x = 0;
        options.position.z = 0;
        options.position.y = 0;
        spawnerOptions = {
				spawnRate: 0,
				horizontalSpeed: 1,
				verticalSpeed: 1,
				timeScale: 1
			};
            readyVars.particleSystem = true;
    }

    /* create a planet with mesh, position and orbit */
    //SpaceObject(name of object, mass of object, radius(size) of object, parameters, in which group object is)
    function SpaceObject(name, mass, radius, color, group, speedx, speedy, speedz) {
        var mesh;
        this.name = name;
        this.mass = mass;
        this.radius = radius;
        this.color = color;
        this.group = group;
        this.speedx = speedx;
        this.speedy = speedy;
        this.speedz = speedz;

        /* This builds the Body */
        this.buildBody = function() {

            var geometry, geoVol, geoVol_faceNum;
            var material;

            if (name == "sun") { 
                var pointLight = new THREE.PointLight(0xffffe0, 1.2, 0);
                
                geometry = new THREE.SphereGeometry(radius, segments, segments);
                material = new THREE.MeshBasicMaterial();
                material.depthTest = false; //for lensFlare
                if(loadTextures){
                    material.map = loader.load('textures/sun_map_2.jpg');
                }
                mesh_sun = new THREE.Mesh(geometry, material);
                group.rotateX(Math.PI/180 * 120);
                
                pointLight.add( mesh_sun );
                scene.add( pointLight );
                
                group.add(mesh_sun);
                
            } else { //other planets
                var path = "textures/" + name + ".png";
                var path_tex = "textures/" + name;
                
                geometry = new THREE.SphereGeometry(radius, segments, segments);
                
                //SHADOW
                /*geoVol   = new THREE.SphereGeometry(radius, segments, segments);
                geoVol_faceNum = geoVol.faces.length;
                
                for (var i = 0; i < geoVol_faceNum; i++) {        
                        geoVol.faces.push(new THREE.Face3( geoVol.faces[i].a,          //vertex-position
                                                           geoVol.faces[i].b,          //vertex-position
                                                           geoVol.faces[i].a,          //vertex-position
                                                           geoVol.faces[i].normal,     //orientation -> light
                                                           color2));                   //tagging-attribute for vertices
                        
                        geoVol.faces.push(new THREE.Face3( geoVol.faces[i].b,
                                                           geoVol.faces[i].b,
                                                           geoVol.faces[i].a,
                                                           geoVol.faces[i].normal,
                                                           color1));
                        
                        geoVol.faces.push(new THREE.Face3( geoVol.faces[i].b,
                                                           geoVol.faces[i].c,
                                                           geoVol.faces[i].b,
                                                           geoVol.faces[i].normal,
                                                           color2));
                        
                        geoVol.faces.push(new THREE.Face3( geoVol.faces[i].c,
                                                           geoVol.faces[i].c,
                                                           geoVol.faces[i].b,
                                                           geoVol.faces[i].normal,
                                                           color1));
                        
                        geoVol.faces.push(new THREE.Face3( geoVol.faces[i].c,
                                                           geoVol.faces[i].a,
                                                           geoVol.faces[i].c,
                                                           geoVol.faces[i].normal,
                                                           color2));
                        
                        geoVol.faces.push(new THREE.Face3( geoVol.faces[i].a,
                                                           geoVol.faces[i].a,
                                                           geoVol.faces[i].c,
                                                           geoVol.faces[i].normal,
                                                           color1));
                        
                        geoVol.faceVertexUvs[0].push([new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2()]);
                        geoVol.faceVertexUvs[0].push([new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2()]);
                        geoVol.faceVertexUvs[0].push([new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2()]);
                        geoVol.faceVertexUvs[0].push([new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2()]);
                        geoVol.faceVertexUvs[0].push([new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2()]);
                        geoVol.faceVertexUvs[0].push([new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2()]);
                    
                    }*/
                    
                if (name == "earth" ){
                    
                    var light_earth = new THREE.PointLight( 0xffffff, 1, 1e10, 2 );
                    
                    group.add( light_earth );
                    //material.depthTest = false; for lensFlare
                    if(loadTextures){

                    material = new THREE.ShaderMaterial( {
						uniforms: uniforms1,
						vertexShader: document.getElementById( 'vertexShader' ).textContent,
						fragmentShader: document.getElementById( 'fragmentShader_1' ).textContent
				    } );
                    }else{
                        material = new THREE.MeshPhongMaterial({
                        color: 0x0000ff
                    });
                    }
                    //material.depthTest = false;
                    
                    var geometry_cloud = new THREE.SphereGeometry(radius * 1.02, segments, segments);
                    if(loadTextures){
                        var material_cloud = new THREE.MeshLambertMaterial({
                        map: loader.load(path_tex + "_mapcloud.png"),
                        side: THREE.DoubleSide,
                        opacity: 0.8,
                        transparent: true,
                        depthWrite: false
                    });
                    var cloudMesh = new THREE.Mesh(geometry_cloud, material_cloud);
                    cloudMesh.name = "clouds";
                    group.add(cloudMesh);
                    }
                    
                    height_atmos = radius * 1.01587;
                    var geo_atmos = new THREE.SphereGeometry(height_atmos, segments, segments); //atmosphere 100km above earth
                    var mat_atmos = new THREE.MeshLambertMaterial({
                        color: 0x00bfff,
                        side: THREE.DoubleSide,
                        opacity: 0.0,
                        transparent: true,
                        depthWrite: false
                    });
                    var mesh_atmos = new THREE.Mesh(geo_atmos, mat_atmos);
                    mesh_atmos.name = "mesh_atmos";
                    group.add(mesh_atmos);
                    
                }else {
                    material = new THREE.MeshPhongMaterial({
                        color: 0xffffff
                    });
                    
                    if(loadTextures){
                        material.map = loader.load(path_tex + "_map.jpg");
                        material.normalMap = loader.load(path_tex + "_normalmap.png");
                        material.bumpMap = loader.load(path_tex + "_bumpmap.jpg");
                        material.bumpScale = 4.0;
                    }
                }
                    
            mesh = new THREE.Mesh(geometry, material);
                
            //SHADOW
            /*
            arr_mesh.push(mesh);

            meshVol = new THREE.Mesh(geoVol);
            sceneVol.add(meshVol);
            
            arr_meshVol.push(meshVol);
            
            shaderName = new THREE.ShaderMaterial({
                uniforms: un_test,
                vertexShader: document.getElementById( 'spaceObj_vs' ).textContent,
				fragmentShader: document.getElementById( 'spaceObj_fs' ).textContent
            });
                
            arr_shader.push(shaderName);*/
                
                
                
                
            
                
            group.rotateX(Math.PI/180 * 120);
            
            if(name == "earth"){
                //group.position.x = Math.cos(0)*23.4393;
                //group.position.y = Math.sin(0)*23.4393;
                //group.position.z = Math.cos(0)*23.4393;
            }
                
            group.add(mesh);
            }
            
            
            //Rings of saturn
            if (name == "saturn"){
                var geometry_ring = new THREE.BoxGeometry( radius*4+1e7, 1e2, radius*4+1e7);
                var material_ring = new THREE.MeshPhongMaterial( { color: 0xffffff, transparent:true, side:THREE.DoubleSide } );
                material_ring.map = loader.load(path_tex + "_ring.png");
                var ring = new THREE.Mesh( geometry_ring, material_ring );
                group.add(ring);
            }

            //point level of detail (LOD) with texture
            var dot_path = "textures/" + name + ".png";
            var dotGeometry = new THREE.Geometry();
            dotGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
            var material_point = new THREE.PointsMaterial({
                color: 0xffffff,
                size: 4,
                sizeAttenuation: false,
                map: loader.load(dot_path)
            });
            material_point.transparent = true;
            var mesh_point = new THREE.Points(dotGeometry, material_point);
            group.add(mesh_point);
            
            
            //Initializing trails
            var geo_buf = new THREE.BufferGeometry();
            
            const MAX_POINTS = 5000;
            
            // attributes
            var positions = new Float32Array( MAX_POINTS * 3 ); // 3 vertices per point
            geo_buf.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
            // draw range
            var drawCount = 0; // draw the first 2 points, only
            geo_buf.setDrawRange( 0, drawCount );
            
            var mat_geo = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 1 } );
        
            // line
            var geo_line = new THREE.Line( geo_buf,  mat_geo );
            
            
            var oldX = 1;
            var oldY = 1;
            var oldZ = 1;
            var oldVec = new THREE.Vector3( oldX, oldY, oldZ);
            
            
            this.addTrailPoint = function( x, y, z){
                
                if (drawCount > MAX_POINTS - 3) {
                    // sliding buffer wäre besser (2x MAX_POINTS Größe)
                    positions.copyWithin (0, 3);
                    drawCount--;
                }
                
                var currentVec = new THREE.Vector3( x, y, z);
                //if ( Math.abs(x - oldX) >= 1e9 || Math.abs(y - oldY >= 1e11) ||  Math.abs(z - oldZ >= 1e7)){
                //if ( Math.abs(currentVec.dot(oldVec) >= 1.2e5) ){
                //console.log('Drawing');
                    oldX = positions[drawCount*3]   = x;
                    oldY = positions[drawCount*3+1] = y;
                    oldZ = positions[drawCount*3+2] = z;  
                    oldVec = new THREE.Vector3(oldX, oldY, oldZ);
                    drawCount ++;
                //}
                
                geo_buf.attributes.position.needsUpdate = true;
                geo_buf.setDrawRange( 0, drawCount );
            };
            this.trailLine = geo_line;
            scene.add( geo_line );
        }

        /* Set Position of the Planet */
        this.setPosition = function(x, y, z, equatorial_inclination) {
            group.position.set(x, y, z);
            //mesh.rotation.z = equatorial_inclination * Math.PI / 180;
        }

        /* Ellipse around planet */
/*        this.createEllipse = function(aX, aY, aphelion, perihelion, center) {
            var segments = 1000;
            var curve = new THREE.EllipseCurve(
                aX, aY, // aX, aY
                aphelion, perihelion, // xRadius, yRadius
                0, 2 * Math.PI, // aStartAngle, aEndAngle
                false, // aClockwise
                0 // aRotation
            );

            var path = new THREE.Path(curve.getPoints(segments));
            var path_geometry = path.createPointsGeometry(segments);
            var path_material = new THREE.LineBasicMaterial(color);

            var ellipse = new THREE.Line(path_geometry, path_material);
            //ellipse.rotation.x = Math.Pi * ellipse_rotation_angle;
            center.add(ellipse);
        }*/
        

        /* Label above planet */
        this.setLabel = function() {
            var path = "textures/" + name + "_label.png";
            var nameGeometry = new THREE.Geometry();
            nameGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
            var material_name = new THREE.PointsMaterial({
                color: 0xffffff,
                size: 64,
                sizeAttenuation: false,
                map: loader.load(path)
            });
            material_name.transparent = true;
            material_name.depthTest = false;
            var mesh_name = new THREE.Points(nameGeometry, material_name);
            mesh_name.position.x = radius * 2;
            group.add(mesh_name);
        }
    }
    
    //Nav-Ball
    function buildNavBall(){
        
        
        //crosshair
        var crosshair = new THREE.PlaneGeometry(10, 10, 64);
        var cross_material = new THREE.MeshBasicMaterial( {transparent: true, color: 0xffff00} );
        cross_material.map = loader.load("textures/crosshair3.png");
        var cross_mesh = new THREE.Mesh( crosshair, cross_material);
        cross_mesh.position.y= -75;
        ui_scene.add(cross_mesh);
         
        //navball
        var nav_geometry = new THREE.SphereGeometry( 30, 64, 64 );
        var nav_material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
        nav_material.map = loader.load("textures/navball.png");
        sphere_nav = new THREE.Mesh( nav_geometry, nav_material );
        sphere_nav.position.y = -75;
        sphere_nav.rotateX(Math.PI/180 * 90);
        sphere_nav.rotateY(Math.PI/180 * 90);
        sphere_nav.angularMomentum = new THREE.Quaternion(0,0,0,1);
        sphere_nav.angularAcceleration = new THREE.Quaternion(0,0,0,1);
        ui_scene.add(sphere_nav);
        readyVars.navball = true;
        var axisHelper = new THREE.AxisHelper(1e15); //
        sphere_nav.add(axisHelper);
        
    }
    
    /* This is called when UI is changed */
    function UIChanges() {

        //scale planets
        var localBlow = globalInterfaceValues.planetSize;
        var localPlanet = globalInterfaceValues.planetName;
        for (mesh in spaceObjects[localPlanet].group.children) {
            spaceObjects[localPlanet].group.children[mesh].scale.set(localBlow, localBlow, localBlow);
            /*      
                if (mesh.type == "Mesh"){
                    //spaceObjects[localPlanet].group.children[mesh].scale.set(localBlow, localBlow, localBlow );
                }
            */
        }

        //change camera position
        var newElement = globalInterfaceValues.planetCamera;
        //console.log(newElement);
        if (newElement != camElement) {
            
            if (spaceObjects[newElement] !== undefined) {
                    lensFlare.visible = true;
                    camera.near = 100000;
                    camera.updateProjectionMatrix();
                    spaceObjects[newElement].group.add(camera);
                    //camera.position.add( direction.multiplyScalar(spaceObjects[e].radius*3) );
                    camera.position.x = camera.position.y = 0;
                    camera.position.z = spaceObjects[newElement].radius*3;
                    controls.update();
                }
            /* #######//for future development //####### 
            if (newElement !== "sun") {  // XXXX Test only
                if (spaceObjects[newElement] !== undefined) {
                    spaceObjects[newElement].group.add(camera);
                    //camera.position.add( direction.multiplyScalar(spaceObjects[e].radius*3) );
                    camera.position.x = camera.position.y = 0;
                    camera.position.z = spaceObjects[newElement].radius*3;
                    controls.update();
                }
            }
            */
        
            if (newElement == "launchpad") {
                    lensFlare.visible = false;
                    camera.near = 0.1;
                    camera.updateProjectionMatrix();
                    launchpadGroup.add(camera);
                    camera.position.y = camera.position.z = 20;
                    camera.position.x = 50;
                    //camera.rotateY(Math.PI/180 * 120);
                    controls.update();
            }
            if (newElement == "rocket") {
                lensFlare.visible = false;
                camera.near = 0.1;
                camera.updateProjectionMatrix();
                rocketGroup.add(camera);
                camera.position.y = 20;
                    camera.position.z = -20;
                camera.position.x = -50;
                //camera.rotateY(Math.PI/180 * 120);
                controls.update();
            } 
            camElement = newElement;
        }
        
        //reset
        /*if (globalControlValues.keyReset){
            if (a == true){
                a = false;
                console.log(a);
            } else {
                a = true;
                console.log(a);
            }
        }*/

        globalInterfaceValues.changed = false;
    }
    
    //calculate opacity fot atmosphere
    function calcOpacity(){
        var focusedObj = globalInterfaceValues.planetCamera;
            if(focusedObj == "rocket"){
                if (rocketHeight){
                    var vec = new THREE.Vector3();
                    var nb = 1 - (rocketHeight *0.00001);
                    var op = THREE.Math.clamp(nb, 0.1, 0.9);  
                }else{
                    var op = 0.9;
                }
            }else if(focusedObj == "launchpad"){
                var op = 0.9;
            }
        else op = 0.1;
        return op;
    }
    

var clock = new THREE.Clock();
    /* This renders the scene */
    function render() {
        
        requestAnimationFrame(render);
         
        /* for camera tracking shot */
        //console.log(camera.position.x, camera.position.y, camera.position.z);
        
        //setTimeout (render, 1000/60);

        /* current time in ms since 1.1.1970 -> 00:00:00 UTC Worldtime */
        now = Date.now();
        
        //convert difftime from ms to seconds
        difftime = (now - lasttime) * 1e-3;
        if (difftime > .1) {
            difftime = .1;      // keine zu großen Zeitschritte (debugging, browser hickups)
        }

        //difftime *= 1e2;

        /* Pause the Game */
        if (!globalControlValues.keyStartPause) {
            calculatePhysics(difftime, spaceObjects);
            //besser: neuer Knoten für renderer, der OrbitLines Knoten im Szenengraphen zeichnet
            //drawOrbit();
            //console.log(spaceObjects.earth);
        }

         /* camera */
        /* #######//for future development //#######
        scene.updateMatrixWorld();
        var newView = new THREE.Vector3();
        newView.copy(camera.position);
        newPos = camera.localToWorld(newView);
        if (globalInterfaceValues.planetCamera === "sun") {
            var direction = new THREE.Vector3();
            direction.subVectors( newPos, lastPos );
            direction.multiplyScalar( 1 / (difftime * timefactor) );
            //console.log(direction);
            //diffPos = newPos - lastPos;
            //diffPos = Math.sqrt( Math.pow((newPos.x - lastPos.x),2) + Math.pow((newPos.y - lastPos.y),2) + Math.pow((newPos.z - lastPos.z),2) ) ;
            //var vel = diffPos / difftime;
            console.log(difftime+ " * " + timefactor + " : " + direction.length());
            scene.add (camera);
            camera.position.copy( newPos );
            camera.lookAt(spaceObjects.earth.group.position);
            camera.updateMatrixWorld();
            controls.target = new THREE.Vector3(spaceObjects.earth.group.position.x, spaceObjects.earth.group.position.y, spaceObjects.earth.group.position.z);
            controls.update();
            globalInterfaceValues.planetCamera = "foo";
        }
        */
        
        /* changes of User Interface */ 
        if (globalInterfaceValues.changed) {
            UIChanges();
        }
        
        
        /* audio check */
        /*if (global.audio){
            throttleSound.play();
            global.audio = false;
        }*/
        if (globalControlValues.sound){
            throttleSound.setVolume(0);
            sound.setVolume(0);
        } else {
            sound.setVolume(1.0);
            //throttleSound.setVolume(1.0);
        }


        /* Earth cloudmap moving */
        spaceObjects.earth.group.children[1].rotateY(0.00015 * globalInterfaceValues.timeFactor);
        spaceObjects.earth.group.children[1].rotateX(0.00005);
        
        
        
        if(rocketGroup){
            //Choice Rocket
            if (globalInterfaceValues.rocketName == "spaceTaxi" && spaceTaxiUsed == false){
                rocket.visible = false;
                var loader = new THREE.ColladaLoader(); 
                loader.options.convertUpAxis = true; 
                loader.load("models/taxi_y.dae", function(collada) {   
                    rocket = collada.scene;   
                    rocket.name = "spaceTaxi";
                    rocketGroup.add(rocket);         
                    rocket.visible = true;
                });
                spaceTaxiUsed = true;
            } else if (globalInterfaceValues.rocketName == "saturnV" && spaceTaxiUsed == true){
                rocket.visible = false;
                var loader = new THREE.ColladaLoader(); 
                loader.options.convertUpAxis = true; 
                loader.load("models/saturnV_3.dae", function(collada) {   
                    rocket = collada.scene;   
                    rocket.name = "saturnV";
                    rocketGroup.add(rocket);       
                    rocket.visible = true;
                });
                 spaceTaxiUsed = false;
                
            }
            
            //Atmosphere
            spaceObjects.earth.group.children[2].material.opacity = calcOpacity();
            
            //Rocket-Fire
            var delta = difftime; //clock.getDelta() * spawnerOptions.timeScale;
			tick += delta;
			if ( tick < 0 ) tick = 0;
			if ( delta > 0 ) {
                spawnerOptions.spawnRate = throttle*150;
                options.lifetime = throttle/50;
                for ( var x = 0; x < spawnerOptions.spawnRate * delta; x++ ) {
					particleSystem.spawnParticle( options );
				}
			}
			particleSystem.update( tick );
            readyVars.animate = true;
        }
        
        /* Earth cloudmap moving */
        //spaceObjects.earth.rotateY(0.001);

        /* The Rendering */
        
        //Rendering the earth shader
        mesh_sun.updateMatrixWorld();   //mesh_sun -> spaceObjects.sun.group.children[0]
        uniforms1.sunPosition.value.set (0, 0, 0, 1);
        uniforms1.sunPosition.value.applyMatrix4 (mesh_sun.matrixWorld);
        uniforms1.sunPosition.value.applyMatrix4 (camera.matrixWorldInverse);
        
        uniforms1.time.value = counter / 1e6;
        counter ++;
        
        readyVars.earthshader = true;
        
        
        
        
        //SHADOW
        /*
        renderer.clear();
        var gl = renderer.context;
        
        for (var i = 0; i<arr_mesh; i++){
            arr_mesh[i].material = ambient_spaceObj_mat;
        }
        
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LESS);
        renderer.render(scene, camera);
        
        gl.colorMask(false, false, false, false);
        gl.depthMask(false);
        gl.enable(gl.STENCIL_TEST);
        gl.disable(gl.CULL_FACE);
        gl.stencilOpSeparate(gl.FRONT, gl.KEEP, gl.KEEP, gl.INCR_WRAP);
        gl.stencilOpSeparate(gl.BACK, gl.KEEP, gl.KEEP, gl.DECR_WRAP);
        gl.stencilFunc(gl.ALWAYS, 0, 0xFF);
        renderer.render(sceneVol, camera);
        
        
        for (var i = 0; i<arr_mesh; i++){
            arr_mesh[i].material = shaderMat_basic;
        }
        gl.colorMask(true, true, true, true);
        gl.depthMask(true);
        gl.enable(gl.CULL_FACE);
        gl.stencilOpSeparate(gl.FRONT, gl.KEEP, gl.KEEP, gl.KEEP);
        gl.stencilOpSeparate(gl.BACK, gl.KEEP, gl.KEEP, gl.KEEP);
        gl.depthFunc(gl.LEQUAL);
        gl.stencilFunc(gl.EQUAL, 0, 0xFF);
        renderer.render(scene, camera);*/
        
        /**if (stats !== undefined) {
            stats.update();
            controls.update();
        }*/
        
        
        
        
        
        if (renderer !== undefined) {
            renderer.clear();
            renderer.render(lens_scene, camera);
           
            
            //render second scene
            renderer.sortObjects = false;
            renderer.clearDepth();
            renderer.render(scene, camera);
            
            //render third Scene
            if( renderNavball ){
                //ui_scene.visible = false;
                ui_scene.children[0].visible = true;
                ui_scene.children[1].visible = true;
            
            }
            else {
                ui_scene.children[0].visible = false;
                ui_scene.children[1].visible = false;
            }
            renderer.sortObjects = false;
            renderer.clearDepth();
            renderer.render(ui_scene, ui_camera);
            readyVars.render = true;

           
        }

        //console.log (Date.now() - now);
        lasttime = now;
        lastPos = newPos;
        renderCount++;
        
        //checks if all resources are loaded, removes loading screen(div)
        var everythingLoaded = setTimeout(function() {
            if (document.readyState === "complete" && renderCounter == 0) {
                clearInterval(everythingLoaded);
                loadingDone();
                renderCounter++;
            }
        }, 100);
    }

    return universe;
}
