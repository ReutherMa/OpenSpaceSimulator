//fill global with key-values, datatype: boolean
var global = {
    started: false
};
var rocket;
var rocketGroup;
var launchpad;
var launchpadGroup;
var spaceObjects = {};
var camera, controls, ui_camera;
var camFactor = 6;

var line_count = 0;

/* Builds the whole Galaxy */
function buildUniverse() {

    //loaders
    var loader = new THREE.TextureLoader();

    //Instant Variables
    var universe = {};
    var container, stats;
    var scene, ui_scene, renderer;
    var segments = 64;
    var group_galaxy;
    var sun, earth, moon, mercury, venus, mars, jupiter, saturn, uranus, neptune;
    
    var uniforms1;
    var mesh_sun;

    //variables for physics
    var now, difftime;
    var lasttime;
    
    var counter = 1;

    //universe functions
    universe.init = init;
    universe.render = render;
    
    //uniforms
    uniforms1 = {
        sunPosition:     { value: new THREE.Vector4(0.0,0.0,0.0,1.0) },
        dayTexture:      { value: loader.load( "textures/earth_map.jpg" ) },
        nightTexture:    { value: loader.load( "textures/earth_map_lights.jpg" )},
        specularTexture: { value: loader.load( "textures/earth_mapspec_2.png" ) },
        scale: { type: "f", value: 1e4 },
        displacement: { type: "f", value: 1e-2},
        time: { type: "f", value: 0}
    };

    /* The initial State */
    function init(data) {
        //creating a scene, camera
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1e27); //1e27
        camera.position.set(0, 0, 695508e3 + 10e10);
        //camera.lookAt (scene.position);
        //camera.position.set( data.earth.x, data.earth.y, data.earth.z +6371.00e3 ); //EARTH

        //second scene + camera for UI
        ui_scene = new THREE.Scene();
        ui_camera = new THREE.OrthographicCamera( -window.innerWidth/camFactor,         
                                                    window.innerWidth/camFactor,
                                                    window.innerHeight/camFactor,
                                                    -window.innerHeight/camFactor, 
                                                    0, 1e27);
        ui_camera.position.set(0, 0, 10);
        
        //console.log(ui_camera);

        //building the skybox
        buildSkybox();

        /* Helpers 
        //axisHelper
        var axisHelper = new THREE.AxisHelper(1e15); //
        //scene.add(axisHelper);
        var helper = new THREE.GridHelper( 10000, 20, 0xffffff, 0xffffff );
        scene.add( helper ); 
        */

        //creating an ambient light
        var ambLight = new THREE.AmbientLight(0x3e3e3e3e); //0x3e3e3e3e
        //scene.add(ambLight);

        //light_shader
/*        var fShader = document.getElementById("fragmentshader1");
        var vShader = document.getElementById("vertexshader");
        var shaderMaterial = new THREE.ShaderMaterial({
            vertexShader: vShader.textContent,
            fragmentShader: fShader.textContent
        });*/

        //building the Galaxy, Planets and Rocket
        buildGalaxy();
        buildPlanets(data);
        //placeRocket();
        placeLaunchpad();
        buildNavBall();
        
        
////////////////////////////
        
/*                    var geo_earth = new THREE.SphereGeometry(1000*6.371e6, segments, segments);
                    var mat_earth = new THREE.ShaderMaterial( {
						uniforms: uniforms1,
						vertexShader: document.getElementById( 'vertexshader' ).textContent,
						fragmentShader: document.getElementById( 'fragmentshader1' ).textContent
				    } );
                    
                    
                    mat_earth.bumpMap = loader.load("../textures/earth_bumpmap.jpg");
                    mat_earth.bumpScale = 4.0;
                    
                    var geometry_cloud = new THREE.SphereGeometry(radius * 1.02, segments, segments);
                    var material_cloud = new THREE.MeshPhongMaterial({
                        map: loader.load(path_tex + "_mapcloud.png"),
                        side: THREE.DoubleSide,
                        opacity: 0.8,
                        transparent: true,
                        depthWrite: true,
                    });
                    var cloudMesh = new THREE.Mesh(geometry_cloud, material_cloud);
                    group.add(cloudMesh);
                    
                    mesh_earth = new THREE.Mesh(geo_earth, mat_earth);
                    //mesh_earth.castShadow = true;
                    //mesh_earth.receiveShadow = true;
                    mesh_earth.position.set(4*695508e3, 0, 0);
                        
                    scene.add(mesh_earth);*/
        
        
///////////////////////////

        //renderer
        renderer = new THREE.WebGLRenderer({
            antialias: true,
            logarithmicDepthBuffer: true
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.BasicShadowMap;
        //renderer.setDepthTest(true);
        renderer.autoClear = false;
        
        container = document.getElementById('container');
        container.appendChild(renderer.domElement);
        stats = new Stats();
        container.appendChild(stats.dom);
        
        window.addEventListener('resize', onWindowResize, false);

        //controls
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        //controls = new THREE.TrackballControls(camera, renderer.domElement);
        //controls.addEventListener( 'change', render );

        lasttime = Date.now();
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

        var skyGeometry = new THREE.CubeGeometry(1e15, 1e15, 1e15); //26
        var skyMaterial = new THREE.MeshFaceMaterial(materialArray);
        var skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
        scene.add(skyBox);
    }

    /* When user changes size of window */
    function onWindowResize() {
        if(camera.inPerspectiveMode){
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        } else {
        ui_camera.left = -window.innerWidth / camFactor;
        ui_camera.right = window.innerWidth / camFactor;
        ui_camera.top = window.innerHeight / camFactor;
        ui_camera.bottom = -window.innerHeight / camFactor;
        ui_camera.updateProjectionMarix();
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
                var posx = data_plan.x;
                var posy = data_plan.y;
                var posz = data_plan.z;
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
    }

    /* Places the Rocket into the Universe */
    function placeRocket() {
        var earthGroup = spaceObjects.earth.group;
        var loader = new THREE.ColladaLoader(); 
        loader.options.convertUpAxis = true; 
        loader.load("models/saturnV.dae", function(collada) {   
            rocketGroup = new THREE.Group();
            rocket = collada.scene;   //var skin = collada.skins[ 0 ];
            //rocket.scale.set(695508e3, 695508e3, 695508e3);
            rocketGroup.add(rocket);
            rocketGroup.position.set(0, 20000000000, 0);
            earthGroup.add(rocketGroup);
        });
    }

    /* Places Launchpad */
    function placeLaunchpad() {
        var earthGroup = spaceObjects.earth.group;
        var loader = new THREE.ColladaLoader(); 
        loader.options.convertUpAxis = true; 
        loader.load("models/launchpad.dae", function(collada) {
            launchpadGroup = new THREE.Group();
            launchpad = collada.scene;   //var skin = collada.skins[ 0 ];
            launchpad.scale.set(10, 10, 10);
            launchpadGroup.add(launchpad);
            /*launchpadGroup.position.x = spaceObjects.earth.radius; //0.1
            launchpadGroup.position.y = spaceObjects.earth.radius * 0.5;
            launchpadGroup.position.z = spaceObjects.earth.radius * 0.9;*/
            //launchpad.rotateX(Math.PI/180 * 60);
            //spaceObjects.sun.group.add(launchpadGroup);
            launchpadGroup.position.set(695508e3*5,0,0);
            scene.add(launchpadGroup);
        });
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

            var geometry;
            var material;

            if (name == "sun") { 
                var pointLight = new THREE.PointLight(0xffffe0, 1.2, 0);
                scene.add(pointLight);
                
                geometry = new THREE.SphereGeometry(radius, segments, segments);
                material = new THREE.MeshPhongMaterial(color);

                mesh_sun = new THREE.Mesh(geometry, material);
                group.rotateX(Math.PI/180 * 120);
                
                pointLight.add(mesh_sun);
                group.add(mesh_sun);
                
            } else { //other plants
                var path = "textures/" + name + ".png";
                var path_tex = "textures/" + name;
                
                geometry = new THREE.SphereGeometry(radius, segments, segments);
                
                if (name == "earth"){
                    material = new THREE.ShaderMaterial( {
						uniforms: uniforms1,
						vertexShader: document.getElementById( 'vertexShader' ).textContent,
						fragmentShader: document.getElementById( 'fragmentShader_1' ).textContent
				    } );
                    
                    
                    material.bumpMap = loader.load(path_tex + "_bumpmap.jpg");
                    material.bumpScale = 4.0;
                    //material.depthTest = false;
                    
                    var geometry_cloud = new THREE.SphereGeometry(radius * 1.02, segments, segments);
                    var material_cloud = new THREE.MeshLambertMaterial({
                        map: loader.load(path_tex + "_mapcloud.png"),
                        side: THREE.DoubleSide,
                        opacity: 0.8,
                        transparent: true,
                        depthWrite: true
                    });
                    var cloudMesh = new THREE.Mesh(geometry_cloud, material_cloud);
                    group.add(cloudMesh);
                    
                }
                else {
                    material = new THREE.MeshPhongMaterial({
                        color: 0xffffff
                    });
                    material.map = loader.load(path_tex + "_map.jpg");
                    material.bumpMap = loader.load(path_tex + "_bumpmap.jpg");
                    material.bumpScale = 4.0;
                }
                    
            mesh = new THREE.Mesh(geometry, material);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
                
            group.rotateX(Math.PI/180 * 120);
            group.add(mesh);
            }
            
            
            //Rings of saturn
            if (name == "saturn"){
                var geometry_ring = new THREE.BoxGeometry( radius*4+1e7, 1e2, radius*4+1e7);
                var material_ring = new THREE.MeshPhongMaterial( { color: 0xffffff, transparent:true } );
                material_ring.map = loader.load(path_tex + "_ring.png");
                var ring = new THREE.Mesh( geometry_ring, material_ring );
                ring.castShadow = true;
                ring.receiveShadow = true;
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
            
            const MAX_POINTS = 1000;
            
            // attributes
            var positions = new Float32Array( MAX_POINTS * 3 ); // 3 vertices per point
            geo_buf.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
            // draw range
            var drawCount = 0; // draw the first 2 points, only
            geo_buf.setDrawRange( 0, drawCount );
            
            var mat_geo = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 20 } );
        
            // line
            var geo_line = new THREE.Line( geo_buf,  mat_geo );
            
            this.addTrailPoint = function( x, y, z){
                
                if (drawCount > MAX_POINTS - 3) {
                    // sliding buffer wäre besser (2x MAX_POINTS Größe)
                    positions.copyWithin (0, 3);
                    drawCount--;
                }
                    
                positions[drawCount*3] = x;
                positions[drawCount*3+1] = y;
                positions[drawCount*3+2] = z;

                drawCount ++;
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
        //2. Kamrea, die direkt vor uns ist und nav ball sehr klein, keliner Abstand. Eingabe: Contols in three.js, in diesem Bereich sind wir selbst zuständig, 2. Orbitcontrolls...
        var nav_geometry = new THREE.SphereGeometry( 30, 64, 64 );
        var nav_material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
        nav_material.map = loader.load("textures/navball.png");
        var sphere_nav = new THREE.Mesh( nav_geometry, nav_material );
        sphere_nav.position.y = -75;
        ui_scene.add(sphere_nav);
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
        var element = globalInterfaceValues.planetCamera;
        for (e in spaceObjects) {
            if (e == element) {
                spaceObjects[e].group.add(camera);
                camera.position.x = camera.position.y = 0;
                camera.position.z = spaceObjects[e].radius*3;
                controls.update();
            }
        }
        if (element == "launchpad") {
                launchpadGroup.add(camera);
                camera.position.x = camera.position.y = 0;
                camera.position.z = 50;
                controls.update();
        }
        if (element == "rocket") {
            //rocketGroup.add(camera);
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
    

var clock = new THREE.Clock();
    /* This renders the scene */
    function render() {

        /* changes of User Interface */ 
        if (globalInterfaceValues.changed) {
            UIChanges();
        }

        requestAnimationFrame(render);
        //setTimeout (render, 1000/60);

        /* current time in ms since 1.1.1970 -> 00:00:00 UTC Worldtime */
        now = Date.now();
        difftime = (now - lasttime) * 1e-3;

        difftime *= 1e2;

        /* Pause the Game */
        if (!globalControlValues.keyStartPause) {
            calculatePhysics(difftime, spaceObjects);
            //besser: neuer Knoten für renderer, der OrbitLines Knoten im Szenengraphen zeichnet
            //drawOrbit();
            //console.log(spaceObjects.earth);
        }


        /* Earth cloudmap moving */
        spaceObjects.earth.group.children[0].rotateY(0.001);

        /* The Rendering */
        
        //Rendering the earth shader
        mesh_sun.updateMatrixWorld();   //mesh_sun -> spaceObjects.sun.group.children[0]
        uniforms1.sunPosition.value.set (0, 0, 0, 1);
        uniforms1.sunPosition.value.applyMatrix4 (mesh_sun.matrixWorld);
        uniforms1.sunPosition.value.applyMatrix4 (camera.matrixWorldInverse);
        
        uniforms1.time.value = counter / 1e6;
        counter ++;
        
        if (stats !== undefined) {
            stats.update();
            controls.update();
        }
        if (renderer !== undefined) {
            renderer.clear();
            renderer.render(scene, camera);
            //render second Scene
            renderer.clearDepth();
            renderer.render(ui_scene, ui_camera);

        }

        //console.log (Date.now() - now);
        lasttime = now;
    }

    return universe;
}
