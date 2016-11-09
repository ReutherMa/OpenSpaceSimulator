function buildUniverse(data){
    
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
            camera = new THREE.PerspectiveCamera(60 , window.innerWidth/window.innerHeight , 0.01, 1e27);
            camera.position.set( 0, 100, 40000 );
            
            buildSkybox();
            console.log(data);
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
            
    //point LOD (level of detail)    
    var dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(new THREE.Vector3( 0, 0, 0));
    var material = new THREE.PointsMaterial({color:0xffffff,size:10, sizeAttenuation: false});
    var mesh = new THREE.Points(dotGeometry,  material);
    mesh.position.x = 15000;
    mesh.position.y = 1000;
    scene.add( mesh );

            //sun
            var sun = new SpaceObject("Sun", 1000, 10000, {emissive: 0xffff80, color: 0x000000, specular: 0 } );
            sun.buildBody();
            sun.setPosition(0,0,0);
            
            //earth
            var earth = new SpaceObject("Earth", 1000, 1000, {color: 0x0000ff});
            earth.buildBody();
            earth.setPosition(25000,0,0);
            
            //orbit line
            var orbit_line_geometry = new THREE.CircleGeometry( 50000, 256 );
            var orbit_line_material = new THREE.LineBasicMaterial( { color: 0xffff00 } );
            var orbit_line = new THREE.Line( orbit_line_geometry, orbit_line_material );
            orbit_line.rotation.x = Math.PI*.5;
            scene.add( orbit_line );
        
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
            var axisHelper = new THREE.AxisHelper( 50000 );
            scene.add( axisHelper ); 
            
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

        var skyGeometry = new THREE.CubeGeometry( 1e26, 1e26, 1e26 );
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
        var mesh;
        this.name = name;
        this.mass = mass;
        this.radius = radius;
        
        this.buildBody = function(){
            var geometry = new THREE.SphereGeometry( radius, segments, segments );
            var material = new THREE.MeshPhongMaterial(color);
            mesh = new THREE.Mesh(geometry,  material);
            scene.add( mesh );
        }
        this.setPosition = function(x,y,z){
            mesh.position.x = x;
            mesh.position.y = y;
            mesh.position.z = z;
        }
    }
        
	function render() {
            requestAnimationFrame( render );
            
            //rotation mercury
            //sphere_mercury.position.x += 1;
            time += 0.0003;
        
            stats.update();
            renderer.render( scene, camera );
	}
    
 return universe;
}