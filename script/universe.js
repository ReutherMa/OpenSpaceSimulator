function buildUniverse(){
    
    //Instant Vairables
    var universe = {};
    var container, stats;
    var camera, controls, scene, renderer;
    var sky, sunSphere;
    var bulbLight, bulbMat;
    var sphere_mercury;
    var time = 0;
    var mesh_earth, clodMesh, mesh_moon, mesh_sun;
    var segments = 64;
    
    init();
    universe.render = render;
    
    function init(){
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(60 , window.innerWidth/window.innerHeight , 0.01, 500000);
            camera.position.set( 0, 100, 20000 );
            
            buildSkybox();
        
            var light = new THREE.DirectionalLight( 0xffffff );
            light.position.set( 0, 1, 0 );
            scene.add(light);
            
            //var helper = new THREE.GridHelper( 10000, 20, 0xffffff, 0xffffff );
            //scene.add( helper );
            
            
            //light_shader
            var fShader = document.getElementById("fragmentshader");
            var vShader = document.getElementById("vertexshader");
            var shaderMaterial = new THREE.ShaderMaterial({
                vertexShader: vShader.textContent,
                fragmentShader: fShader.textContent
            });
            
            //sun
            var geometry_sun = new THREE.SphereGeometry( 10000, 64, 64 );
            var material_sun = new THREE.MeshPhongMaterial();
            material_sun.map    = THREE.ImageUtils.loadTexture('textures/sun/sun_map.jpg');
            material_sun.bumpMap    = THREE.ImageUtils.loadTexture('textures/sun/sun_bump.jpg');
            material_sun.bumpScale = 4.0;
            mesh_sun = new THREE.Mesh(geometry_sun,  material_sun);
            //mesh_sun.position.x = -50000;
            scene.add( mesh_sun );
            
            //earth
            var earth = new SpaceObject("Earth", 1000, 1000, 0x0000ff);
            earth.buildBody();
        
            /*var geometry_earth = new THREE.SphereGeometry( 1000, 64, 64 );   
            var material_earth = new THREE.MeshPhongMaterial();
            material_earth.map    = THREE.ImageUtils.loadTexture('textures/earth/earthmap_2.jpg');
            material_earth.bumpMap    = THREE.ImageUtils.loadTexture('textures/earth/earthbump_2.jpg');
            material_earth.bumpScale = 3.0;
            material_earth.specularMap    = THREE.ImageUtils.loadTexture('textures/earth/earthspec_2.jpg');
            material_earth.specular  = new THREE.Color(0x111111);         
            var geometry_cloud   = new THREE.SphereGeometry(1008, 64, 64);  
            //var canvasCloud = new THREE.ImageUtils.loadTexture('textures/earth/earthcloudmap.jpg'); 
            var material_cloud  = new THREE.MeshPhongMaterial({
                map         : new THREE.ImageUtils.loadTexture('textures/earth/earthcloudmap.png'),
                side        : THREE.DoubleSide,
                opacity     : 0.8,
                transparent : true,
                depthWrite  : true,
            });
            cloudMesh = new THREE.Mesh(geometry_cloud, material_cloud);
            //mesh_earth.add(cloudMesh);
            cloudMesh.position.x = 23500;
            scene.add(cloudMesh);       
            
            mesh_earth = new THREE.Mesh(geometry_earth,  material_earth);
            mesh_earth.position.x = 23500;
            scene.add( mesh_earth );*/
            
            //moon
            var geometry_moon = new THREE.SphereGeometry( 100, 64, 64 );
            var material_moon = new THREE.MeshPhongMaterial();
            material_moon.map    = THREE.ImageUtils.loadTexture('textures/moon/moonmap2k.jpg');
            material_moon.bumpMap    = THREE.ImageUtils.loadTexture('textures/moon/moonbump.jpg');
            material_moon.bumpScale = 2.0;
            mesh_moon = new THREE.Mesh(geometry_moon,  material_moon);
            mesh_moon.position.x = 25000;
            scene.add( mesh_moon );    
            
            //controls
            controls = new THREE.OrbitControls( camera );
            //controls.addEventListener( 'change', render );
            
            //axisHelper
            var axisHelper = new THREE.AxisHelper( 500000 );
            scene.add( axisHelper ); 
            
            //renderer
            renderer = new THREE.WebGLRenderer();
            renderer.setPixelRatio( window.devicePixelRatio );
            renderer.setSize( window.innerWidth, window.innerHeight );
            //renderer.setDepthTest(true);
            container = document.getElementById( 'container' );
            container.appendChild( renderer.domElement );
            stats = new Stats();
            container.appendChild( stats.dom );
            window.addEventListener( 'resize', onWindowResize, false );
 }
    
    //skybox
    function buildSkybox(){
        var imagePrefix = "textures/stars_for_skybox3/";
        var directions  = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
        var imageSuffix = ".png";

        var materialArray = [];
        for (var i = 0; i < 6; i++)
            materialArray.push( new THREE.MeshBasicMaterial({
                map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
                side: THREE.BackSide
            }));

        var skyGeometry = new THREE.CubeGeometry( 500000, 500000, 500000 );
        var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
        var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
        scene.add( skyBox );
    }
        
    function onWindowResize() {

            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize( window.innerWidth, window.innerHeight );
            render();
    }
    
    function SpaceObject(name, mass, radius, color){
        this.name = name;
        this.mass = mass;
        this.radius = radius;
        
        function buildBody(){
            var geometry = new THREE.SphereGeometry( radius, segments, segments );
            var material = new THREE.MeshPhongMaterial(color);
            var mesh = new THREE.Mesh(geometry,  material);
            mesh.position.x = 23500;
            scene.add( mesh );
        }
        /*function setPosition(x,y,z){
            mesh.position.x = 23500;
        }*/
    }
        
	function render() {
            requestAnimationFrame( render );
            
            //rotation mercury
            //sphere_mercury.position.x += 1;
            time += 0.0003;
            
            //rotation earth
            mesh_earth.rotation.y += 0.0003;
            cloudMesh.rotation.y += 0.0005;
            cloudMesh.rotation.x += 0.0002;
            
        
            mesh_moon.rotation.y += 0.0003;
            mesh_moon.position.x = -3000*Math.cos(time) + 25000;
            mesh_moon.position.z = -5000*Math.sin(time) + 0;
        
            stats.update();
            renderer.render( scene, camera );
	}
    
 return universe;
}