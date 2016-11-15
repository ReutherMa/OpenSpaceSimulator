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
    
    universe.init = init;
    universe.render = render;
    
    function init(data){
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(60 , window.innerWidth/window.innerHeight , 0.01, 1e27);
            camera.position.set( 0, 0, data.sun.radius + 10000 );
            
            buildSkybox();
        
        /*  var helper = new THREE.GridHelper( 10000, 20, 0xffffff, 0xffffff );
            scene.add( helper );
        */
        
            //console.log(data.earth.mass);
        
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

            //sun
            var sun = new SpaceObject("Sun", data.sun.mass, data.sun.radius, {emissive: 0xffff80, color: 0x000000, specular: 0 } );
            sun.buildBody();
            sun.setPosition(0, 0, 0, 0);
            
            //earth
            var earth = new SpaceObject("Earth", data.earth.mass, data.earth.radius, {color: 0x0099ff});
            earth.buildBody();
            earth.setPosition(data.earth.perihelion, 0, 0, data.earth.eququatorial_inclination);
            earth.create_ellipse(0, 0, data.earth.perihelion, data.earth.aphelia);
        
            //moon
            var moon = new SpaceObject("Moon", data.earth_moon.mass, data.earth.radius, {color: 0x999999});
            moon.buildBody();
            moon.setPosition(data.earth.perihelion - data.earth_moon.perihelionToEarth, 0, 0, 0);
            moon.create_ellipse(data.earth.perihelion, 0, data.earth_moon.perihelion, data.earth_moon.aphelia);   
            
            //controls
            controls = new THREE.OrbitControls( camera );
            //controls.addEventListener( 'change', render );
            
            //axisHelper
            var axisHelper = new THREE.AxisHelper( 1e26 );
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
        var imagePrefix = "textures/stars_for_skybox2/";
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
    
    //create a planet with mesh, position and orbit
    function SpaceObject(name, mass, radius, color){
        var mesh;
        this.name = name;
        this.mass = mass;
        this.radius = radius;
        this.color = color;
        
        this.buildBody = function(){
            var geometry = new THREE.SphereGeometry( radius, segments, segments );
            var material = new THREE.MeshPhongMaterial(color);
            mesh = new THREE.Mesh(geometry,  material);
            scene.add( mesh );
        }
        
        this.setPosition = function(x,y,z, equatorial_inclination){
            mesh.position.x = x;
            mesh.position.y = y;
            mesh.position.z = z;
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
            scene.add( ellipse );
                
            }
    }
        
	function render() {
            requestAnimationFrame( render );
            
            //rotation mercury
            //sphere_mercury.position.x += 1;
            time += 0.0003;
        
            if (stats !== undefined) {
                stats.update();
            }
            if (renderer !== undefined) {
                renderer.render( scene, camera );
            }
	}
    
 return universe;
}