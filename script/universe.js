//fill global with key-values, datatype: boolean
var global = {
    started: false
};
var rocket;
var rocketGroup;
var launchpad;
var launchpadGroup;
var spaceObjects = {};
var camera, controls;


/* Builds the whole Galaxy */
function buildUniverse() {

    //loaders
    var loader = new THREE.TextureLoader();

    //Instant Variables
    var universe = {};
    var container, stats;
    var scene, renderer;
    var segments = 64;
    var group_galaxy, group1_sun, group2_mercury, group3_venus, group4_earth, group41_moon, group5_mars, group6_jupiter,
        group7_saturn, group8_uranus, group9_neptune;
    var sun, earth, moon, mercury, venus, mars, jupiter, saturn, uranus, neptune;

    //variables for physics
    var now, difftime;
    var lasttime;

    //universe functions
    universe.init = init;
    universe.render = render;

    /* The initial State */
    function init(data) {
        //creating a scene, camera
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 1e15); //1e27
        camera.position.set(0, 0, 695508e3 + 10e10);
        //camera.position.set( data.earth.x, data.earth.y, data.earth.z +6371.00e3 ); //EARTH

        //building the skybox
        buildSkybox();

        /* 
        var helper = new THREE.GridHelper( 10000, 20, 0xffffff, 0xffffff );
        scene.add( helper ); 
        */

        //creating an ambient light
        var ambLight = new THREE.AmbientLight(0x3e3e3e3e); //0x3e3e3e3e
        scene.add(ambLight);

        //light_shader
        var fShader = document.getElementById("fragmentshader");
        var vShader = document.getElementById("vertexshader");
        var shaderMaterial = new THREE.ShaderMaterial({
            vertexShader: vShader.textContent,
            fragmentShader: fShader.textContent
        });

        //building the Galaxy, Planets and Rocket
        buildGalaxy();
        buildPlanets(data);
        //placeRocket();
        placeLaunchpad();


        /* 
        document.addEventListener('mousedown', onMouseDown, false);
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

        //axisHelper
        var axisHelper = new THREE.AxisHelper(1e15); //
        scene.add(axisHelper);

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
        container = document.getElementById('container');
        container.appendChild(renderer.domElement);
        stats = new Stats();
        container.appendChild(stats.dom);
        window.addEventListener('resize', onWindowResize, false);

        //controls
        controls = new THREE.OrbitControls(camera, renderer.domElement);
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
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
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
            var base = data[planet].base;
            //console.log(base);

            //if "planet" is a star -> different object
            if (data[planet].star === true) {
                var group_name = new THREE.Group();
                scene.add(group_name);
                var planet_object = new SpaceObject(planet, data[planet].mass, data[planet].radius, {
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

                var planet_object = new SpaceObject(planet, data[planet].mass, data[planet].radius * LocalBlow, data[planet].color, group_name, data[planet].speedx, data[planet].speedy, data[planet].speedz);
                planet_object.buildBody();
                planet_object.setLabel();

                //for base objects around other planets
                var posx = data[planet].x;
                var posy = data[planet].y;
                var posz = data[planet].z;
                if (base) {
                    posx += data[base].x;
                    posy += data[base].y;
                    posz += data[base].z;
                }
                planet_object.setPosition(posx, posy, posz, 0);
                spaceObjects[planet] = planet_object;
                planet_object.createEllipse(0, 0, data[planet].aphelia, data[planet].perihelion, group_galaxy);
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
            //texture
            if (name == "sun") { //if it is the sun
                var pointLight = new THREE.PointLight(0xffffe0, 2, 0);
                //pointLight.castShadow = true;
                scene.add(pointLight);
                
                geometry = new THREE.SphereGeometry(radius, segments, segments);
                material = new THREE.MeshPhongMaterial(color);

                mesh = new THREE.Mesh(geometry, material);
                pointLight.add(mesh);
                
            } else { //other plants
                var path = "textures/" + name + ".png";
                geometry = new THREE.SphereGeometry(radius, segments, segments);
                material = new THREE.MeshPhongMaterial({
                    color: 0xffffff
                });

                var path_tex = "textures/" + name;
                material.map = loader.load(path_tex + "_map.jpg");
                material.bumpMap = loader.load(path_tex + "_bumpmap.jpg");
                material.bumpScale = 4.0;

                if (name == "earth") { //if it is the earth
                    material.specularMap = loader.load(path_tex + "_mapspec.jpg");
                    material.specular = new THREE.Color(0x111111);
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
                }
                
                
                mesh = new THREE.Mesh(geometry, material);
                mesh.castShadow = true;
                mesh.receiveShadow = true;
            }
            group.add(mesh);
            
                //Testing for rings of saturn
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
        }

        /* Set Position of the Planet */
        this.setPosition = function(x, y, z, equatorial_inclination) {
            group.position.set(x, y, z);
            mesh.rotation.z = equatorial_inclination * Math.PI / 180;
        }

        /* Ellipse around planet */
        this.createEllipse = function(aX, aY, aphelion, perihelion, center) {
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
            //ellipse.rotation.x = Math.PI*.5;
            center.add(ellipse);
        }

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
        }

        /* Movement for groups */
        //console.log(spaceObjects.sun.group.children[0]); MESH
        //spaceObjects.sun.group.children[0].rotateY(0.5);

        /* Earth cloudmap moving */
        spaceObjects.earth.group.children[0].rotateY(0.0001);

        /* Rotate every Group */
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

        /* The Rendering */
        if (stats !== undefined) {
            stats.update();
            //controls.update();
        }
        if (renderer !== undefined) {
            renderer.render(scene, camera);
        }

        //console.log (Date.now() - now);
        lasttime = now;
    }

    return universe;
}