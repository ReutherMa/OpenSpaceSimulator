function build3D_UI() {
    
    //loaders
    var loader = new THREE.TextureLoader();
    
    //
    var scene_ui, ui_camera, ui_renderer, ui_container;
    
    init();
    render();
    
    /* The initial State */
    function init() {
        //creating a scene, camera
        scene_ui = new THREE.Scene();
        ui_camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 1000);
        ui_camera.position.set(0, 0, 50);
        

        //axisHelper
        //var axisHelper = new THREE.AxisHelper(100);
        //scene.add(axisHelper);

        //renderer
        ui_renderer = new THREE.WebGLRenderer({
            antialias: true,
            logarithmicDepthBuffer: true
        });
        
        ui_renderer.setPixelRatio(window.devicePixelRatio);
        ui_renderer.setSize(window.innerWidth, window.innerHeight);

        ui_container = document.getElementById('ui_container');
        ui_container.appendChild(ui_renderer.domElement);

        window.addEventListener('resize', onWindowResize, false);

        //controls
        ui_controls = new THREE.OrbitControls(ui_camera, ui_renderer.domElement);
        //controls.addEventListener( 'change', render );
        
        buildNavBall();

    }
    
    function onWindowResize() {
        ui_camera.aspect = window.innerWidth / window.innerHeight;
        ui_camera.updateProjectionMatrix();
        ui_renderer.setSize(window.innerWidth, window.innerHeight);
        //render(); no double calling
    }
    
    function buildNavBall(){
        //Nav-Ball
        //2. Kamrea, die direkt vor uns ist und nav ball sehr klein, keliner Abstand. Eingabe: Contols in three.js, in diesem Bereich sind wir selbst zuständig, 2. Orbitcontrolls...
        var nav_geometry = new THREE.SphereGeometry( 10, 64, 64 );
        var nav_material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
        nav_material.map = loader.load("textures/navball.png");
        var sphere_nav = new THREE.Mesh( nav_geometry, nav_material );
        
//        var vec = new THREE.Vector3( 0, 0, -100 );
//        vec.applyQuaternion( camera.quaternion );
//        sphere_nav.position.copy( vec );
    
        scene_ui.add( sphere_nav );
        
    }
    
    function render() {

        requestAnimationFrame(render);
        //setTimeout (render, 1000/60);

        

        //Rendering
        if (ui_renderer !== undefined) {
            ui_renderer.render(scene_ui, ui_camera);
        }

    }
}