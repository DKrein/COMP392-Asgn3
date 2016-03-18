/// <reference path="_reference.ts"/>
// MAIN GAME FILE
// THREEJS Aliases
var Scene = Physijs.Scene;
var Renderer = THREE.WebGLRenderer;
var PerspectiveCamera = THREE.PerspectiveCamera;
var BoxGeometry = THREE.BoxGeometry;
var CubeGeometry = THREE.CubeGeometry;
var PlaneGeometry = THREE.PlaneGeometry;
var SphereGeometry = THREE.SphereGeometry;
var Geometry = THREE.Geometry;
var AxisHelper = THREE.AxisHelper;
var LambertMaterial = THREE.MeshLambertMaterial;
var MeshBasicMaterial = THREE.MeshBasicMaterial;
var LineBasicMaterial = THREE.LineBasicMaterial;
var PhongMaterial = THREE.MeshPhongMaterial;
var Material = THREE.Material;
var Texture = THREE.Texture;
var Line = THREE.Line;
var Mesh = THREE.Mesh;
var Object3D = THREE.Object3D;
var SpotLight = THREE.SpotLight;
var PointLight = THREE.PointLight;
var AmbientLight = THREE.AmbientLight;
var Control = objects.Control;
var GUI = dat.GUI;
var Color = THREE.Color;
var Vector3 = THREE.Vector3;
var Face3 = THREE.Face3;
var Point = objects.Point;
var CScreen = config.Screen;
var Clock = THREE.Clock;
//Custom Game Objects
var gameObject = objects.gameObject;
// Setup a Web Worker for Physijs
Physijs.scripts.worker = "/Scripts/lib/Physijs/physijs_worker.js";
Physijs.scripts.ammo = "/Scripts/lib/Physijs/examples/js/ammo.js";
// setup an IIFE structure (Immediately Invoked Function Expression)
var game = (function () {
    // declare game objects
    var havePointerLock;
    var element;
    var scene = new Scene(); // Instantiate Scene Object
    var renderer;
    var camera;
    var control;
    var gui;
    var stats;
    var blocker;
    var instructions;
    var spotLight;
    var ambientLight;
    var groundGeometry;
    var groundPhysicsMaterial;
    var groundMaterial;
    var ground;
    var groundTexture;
    var groundTextureNormal;
    var clock;
    var playerGeometry;
    var playerMaterial;
    var player;
    var sphereGeometry;
    var sphereMaterial;
    var sphere;
    var keyboardControls;
    var mouseControls;
    var isGrounded;
    var velocity = new Vector3(0, 0, 0);
    var prevTime = 0;
    var directionLineMaterial;
    var directionLineGeometry;
    var directionLine;
    var islandGeometry;
    var islandPhysicsMaterial;
    var islandMaterial;
    var island;
    var islandTwoGeometry;
    var islandTwoPhysicsMaterial;
    var islandTwoMaterial;
    var islandTwo;
    var islandThreeGeometry;
    var islandThreePhysicsMaterial;
    var islandThreeMaterial;
    var islandThree;
    var islandFourGeometry;
    var islandFourPhysicsMaterial;
    var islandFourMaterial;
    var islandFour;
    var wallTexture;
    var wallGeometry;
    var wallPhysicsMaterial;
    var wallMaterial;
    var wall;
    var wallTwoGeometry;
    var wallTwoPhysicsMaterial;
    var wallTwoMaterial;
    var wallTwo;
    var wallThreeGeometry;
    var wallThreePhysicsMaterial;
    var wallThreeMaterial;
    var wallThree;
    var wallFourGeometry;
    var wallFourPhysicsMaterial;
    var wallFourMaterial;
    var wallFour;
    var wallFiveGeometry;
    var wallFivePhysicsMaterial;
    var wallFiveMaterial;
    var wallFive;
    var wallSixGeometry;
    var wallSixPhysicsMaterial;
    var wallSixMaterial;
    var wallSix;
    function init() {
        // Create to HTMLElements
        blocker = document.getElementById("blocker");
        instructions = document.getElementById("instructions");
        //check to see if pointerlock is supported
        havePointerLock = 'pointerLockElement' in document ||
            'mozPointerLockElement' in document ||
            'webkitPointerLockElement' in document;
        // Instantiate Game Controls
        keyboardControls = new objects.KeyboardControls();
        mouseControls = new objects.MouseControls();
        // Check to see if we have pointerLock
        if (havePointerLock) {
            element = document.body;
            instructions.addEventListener('click', function () {
                // Ask the user for pointer lock
                console.log("Requesting PointerLock");
                element.requestPointerLock = element.requestPointerLock ||
                    element.mozRequestPointerLock ||
                    element.webkitRequestPointerLock;
                element.requestPointerLock();
            });
            document.addEventListener('pointerlockchange', pointerLockChange);
            document.addEventListener('mozpointerlockchange', pointerLockChange);
            document.addEventListener('webkitpointerlockchange', pointerLockChange);
            document.addEventListener('pointerlockerror', pointerLockError);
            document.addEventListener('mozpointerlockerror', pointerLockError);
            document.addEventListener('webkitpointerlockerror', pointerLockError);
        }
        // Scene changes for Physijs
        scene.name = "Main";
        scene.fog = new THREE.Fog(0xffffff, 0, 750);
        scene.setGravity(new THREE.Vector3(0, -10, 0));
        scene.addEventListener('update', function () {
            scene.simulate(undefined, 2);
        });
        // setup a THREE.JS Clock object
        clock = new Clock();
        setupRenderer(); // setup the default renderer
        setupCamera(); // setup the camera
        // Spot Light
        spotLight = new SpotLight(0xffffff);
        spotLight.position.set(20, 50, -15);
        spotLight.castShadow = true;
        spotLight.intensity = 2;
        spotLight.lookAt(new Vector3(0, 0, 0));
        spotLight.shadowCameraNear = 2;
        spotLight.shadowCameraFar = 200;
        spotLight.shadowCameraLeft = -5;
        spotLight.shadowCameraRight = 5;
        spotLight.shadowCameraTop = 5;
        spotLight.shadowCameraBottom = -5;
        spotLight.shadowMapWidth = 2048;
        spotLight.shadowMapHeight = 2048;
        spotLight.shadowDarkness = 0.5;
        spotLight.name = "Spot Light";
        scene.add(spotLight);
        console.log("Added spotLight to scene");
        //AmbientLight
        ambientLight = new AmbientLight(0x404040);
        scene.add(ambientLight);
        // Ground Object
        groundTexture = new THREE.TextureLoader().load('../../Assets/images/grass.jpg');
        groundTexture.wrapS = THREE.RepeatWrapping;
        groundTexture.wrapT = THREE.RepeatWrapping;
        groundTexture.repeat.set(8, 8);
        // groundTextureNormal = new THREE.TextureLoader().load('../../Assets/images/GravelCobbleNormal.png');
        // groundTextureNormal.wrapS = THREE.RepeatWrapping;
        // groundTextureNormal.wrapT = THREE.RepeatWrapping;
        // groundTextureNormal.repeat.set(8, 8);
        groundMaterial = new PhongMaterial();
        groundMaterial.map = groundTexture;
        //groundMaterial.bumpMap = groundTextureNormal;
        //groundMaterial.bumpScale = 0.2;
        groundGeometry = new BoxGeometry(20, 1, 20);
        groundPhysicsMaterial = Physijs.createMaterial(groundMaterial, 0, 0);
        ground = new Physijs.ConvexMesh(groundGeometry, groundPhysicsMaterial, 0);
        ground.receiveShadow = true;
        ground.name = "Ground";
        scene.add(ground);
        console.log("Added Ground to scene");
        islandGeometry = new BoxGeometry(6, 1, 25);
        islandPhysicsMaterial = Physijs.createMaterial(groundMaterial, 0, 0);
        island = new Physijs.ConvexMesh(islandGeometry, islandPhysicsMaterial, 0);
        island.position.set(-17, 0, 0);
        island.receiveShadow = true;
        island.name = "Island1";
        scene.add(island);
        console.log("Added Island1 to scene");
        islandTwoGeometry = new BoxGeometry(6, 1, 25);
        islandTwoPhysicsMaterial = Physijs.createMaterial(groundMaterial, 0, 0);
        islandTwo = new Physijs.ConvexMesh(islandTwoGeometry, islandTwoPhysicsMaterial, 0);
        islandTwo.position.set(17, 0, 0);
        islandTwo.receiveShadow = true;
        islandTwo.name = "Island2";
        scene.add(islandTwo);
        console.log("Added Island2 to scene");
        islandThreeGeometry = new BoxGeometry(6, 1, 25);
        islandThreePhysicsMaterial = Physijs.createMaterial(groundMaterial, 0, 0);
        islandThree = new Physijs.ConvexMesh(islandThreeGeometry, islandThreePhysicsMaterial, 0);
        islandThree.position.set(0, 0, -17);
        islandThree.rotateY(1.5708);
        islandThree.receiveShadow = true;
        islandThree.name = "Island3";
        scene.add(islandThree);
        console.log("Added Island3 to scene");
        islandFourGeometry = new BoxGeometry(6, 1, 25);
        islandFourPhysicsMaterial = Physijs.createMaterial(groundMaterial, 0, 0);
        islandFour = new Physijs.ConvexMesh(islandFourGeometry, islandFourPhysicsMaterial, 0);
        islandFour.position.set(0, 0, 17);
        islandFour.rotateY(1.5708);
        islandFour.receiveShadow = true;
        islandFour.name = "Island4";
        scene.add(islandFour);
        console.log("Added Island4 to scene");
        //Wall Objects
        wallTexture = new THREE.TextureLoader().load('../../Assets/images/wall.jpg');
        wallTexture.wrapS = THREE.RepeatWrapping;
        wallTexture.wrapT = THREE.RepeatWrapping;
        wallTexture.repeat.set(8, 8);
        wallMaterial = new PhongMaterial();
        wallMaterial.map = wallTexture;
        wallGeometry = new BoxGeometry(20, 6, .5);
        wallPhysicsMaterial = Physijs.createMaterial(wallMaterial, 0, 0);
        wall = new Physijs.ConvexMesh(wallGeometry, wallPhysicsMaterial, 0);
        wall.position.set(14.2, 3.5, -4.1);
        wall.rotateY(1.5708);
        wall.receiveShadow = true;
        wall.name = "Wall";
        scene.add(wall);
        console.log("Added Wall to scene");
        wallTwoGeometry = new BoxGeometry(20, 6, .5);
        wallTwoPhysicsMaterial = Physijs.createMaterial(wallMaterial, 0, 0);
        wallTwo = new Physijs.ConvexMesh(wallTwoGeometry, wallTwoPhysicsMaterial, 0);
        wallTwo.position.set(6, 3.5, 6.4);
        wallTwo.rotateY(1.5708);
        wallTwo.receiveShadow = true;
        wallTwo.name = "Wall2";
        scene.add(wallTwo);
        console.log("Added Wall2 to scene");
        wallThreeGeometry = new BoxGeometry(20, 6, .5);
        wallThreePhysicsMaterial = Physijs.createMaterial(wallMaterial, 0, 0);
        wallThree = new Physijs.ConvexMesh(wallThreeGeometry, wallThreePhysicsMaterial, 0);
        wallThree.position.set(-10, 3.5, -6.1);
        wallThree.rotateY(1.5708);
        wallThree.receiveShadow = true;
        wallThree.name = "Wall3";
        scene.add(wallThree);
        console.log("Added Wall3 to scene");
        wallFourGeometry = new BoxGeometry(10, 6, .5);
        wallFourPhysicsMaterial = Physijs.createMaterial(wallMaterial, 0, 0);
        wallFour = new Physijs.ConvexMesh(wallFourGeometry, wallFourPhysicsMaterial, 0);
        wallFour.position.set(-1.9, 3.5, -13);
        wallFour.rotateY(1.5708);
        wallFour.receiveShadow = true;
        wallFour.name = "Wall4";
        scene.add(wallFour);
        console.log("Added Wall4 to scene");
        wallFiveGeometry = new BoxGeometry(20, 6, .5);
        wallFivePhysicsMaterial = Physijs.createMaterial(wallMaterial, 0, 0);
        wallFive = new Physijs.ConvexMesh(wallFiveGeometry, wallFivePhysicsMaterial, 0);
        wallFive.position.set(-7.7, 3.5, 9.7);
        wallFive.receiveShadow = true;
        wallFive.name = "Wall5";
        scene.add(wallFive);
        console.log("Added Wall5 to scene");
        wallSixGeometry = new BoxGeometry(20, 6, .5);
        wallSixPhysicsMaterial = Physijs.createMaterial(wallMaterial, 0, 0);
        wallSix = new Physijs.ConvexMesh(wallSixGeometry, wallSixPhysicsMaterial, 0);
        wallSix.position.set(-7.6, 3.5, -3.85);
        wallSix.receiveShadow = true;
        wallSix.name = "Wall6";
        scene.add(wallSix);
        console.log("Added Wall6 to scene");
        // Player Object
        playerGeometry = new BoxGeometry(2, 4, 2);
        playerMaterial = Physijs.createMaterial(new LambertMaterial({ color: 0x00ff00 }), 0.4, 0);
        player = new Physijs.BoxMesh(playerGeometry, playerMaterial, 1);
        player.position.set(0, 20, 0);
        player.receiveShadow = true;
        player.castShadow = true;
        player.name = "Player";
        scene.add(player);
        console.log("Added Player to Scene");
        // Collision Check
        player.addEventListener('collision', function (event) {
            console.log(event);
            if (event.name === "Ground") {
                console.log("player hit the ground");
                isGrounded = true;
            }
            if (event.name === "Sphere") {
                console.log("player hit the sphere");
            }
        });
        // Add DirectionLine
        directionLineMaterial = new LineBasicMaterial({ color: 0xffff00 });
        directionLineGeometry = new Geometry();
        directionLineGeometry.vertices.push(new Vector3(0, 0, 0)); // line origin
        directionLineGeometry.vertices.push(new Vector3(0, 0, -50)); // end of the line
        directionLine = new Line(directionLineGeometry, directionLineMaterial);
        player.add(directionLine);
        console.log("Added DirectionLine to the Player");
        // create parent-child relationship with camera and player
        player.add(camera);
        camera.position.set(0, 1, 0);
        // Sphere Object
        sphereGeometry = new SphereGeometry(2, 32, 32);
        sphereMaterial = Physijs.createMaterial(new LambertMaterial({ color: 0x00ff00 }), 0.4, 0);
        sphere = new Physijs.SphereMesh(sphereGeometry, sphereMaterial, 1);
        sphere.position.set(0, 60, 5);
        sphere.receiveShadow = true;
        sphere.castShadow = true;
        sphere.name = "Sphere";
        //scene.add(sphere);
        //console.log("Added Sphere to Scene");
        // add controls
        gui = new GUI();
        control = new Control();
        addControl(control);
        // Add framerate stats
        addStatsObject();
        console.log("Added Stats to scene...");
        document.body.appendChild(renderer.domElement);
        gameLoop(); // render the scene	
        scene.simulate();
        window.addEventListener('resize', onWindowResize, false);
    }
    //PointerLockChange Event Handler
    function pointerLockChange(event) {
        if (document.pointerLockElement === element) {
            // enable our mouse and keyboard controls
            keyboardControls.enabled = true;
            mouseControls.enabled = true;
            blocker.style.display = 'none';
        }
        else {
            // disable our mouse and keyboard controls
            keyboardControls.enabled = false;
            mouseControls.enabled = false;
            blocker.style.display = '-webkit-box';
            blocker.style.display = '-moz-box';
            blocker.style.display = 'box';
            instructions.style.display = '';
            console.log("PointerLock disabled");
        }
    }
    //PointerLockError Event Handler
    function pointerLockError(event) {
        instructions.style.display = '';
        console.log("PointerLock Error Detected!!");
    }
    // Window Resize Event Handler
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    function addControl(controlObject) {
        /* ENTER CODE for the GUI CONTROL HERE */
    }
    // Add Frame Rate Stats to the Scene
    function addStatsObject() {
        stats = new Stats();
        stats.setMode(0);
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';
        document.body.appendChild(stats.domElement);
    }
    // Setup main game loop
    function gameLoop() {
        stats.update();
        checkControls();
        // render using requestAnimationFrame
        requestAnimationFrame(gameLoop);
        // render the scene
        renderer.render(scene, camera);
    }
    // Check Controls Function
    function checkControls() {
        if (keyboardControls.enabled) {
            velocity = new Vector3();
            var time = performance.now();
            var delta = (time - prevTime) / 1000;
            if (isGrounded) {
                var direction = new Vector3(0, 0, 0);
                if (keyboardControls.moveForward) {
                    velocity.z -= 400.0 * delta;
                }
                if (keyboardControls.moveLeft) {
                    velocity.x -= 400.0 * delta;
                }
                if (keyboardControls.moveBackward) {
                    velocity.z += 400.0 * delta;
                }
                if (keyboardControls.moveRight) {
                    velocity.x += 400.0 * delta;
                }
                if (keyboardControls.jump) {
                    velocity.y += 4000.0 * delta;
                    if (player.position.y > 4) {
                        isGrounded = false;
                    }
                }
                player.setDamping(0.7, 0.1);
                // Changing player's rotation
                player.setAngularVelocity(new Vector3(0, mouseControls.yaw, 0));
                direction.addVectors(direction, velocity);
                direction.applyQuaternion(player.quaternion);
                if (Math.abs(player.getLinearVelocity().x) < 20 && Math.abs(player.getLinearVelocity().y) < 10) {
                    player.applyCentralForce(direction);
                }
                cameraLook();
            } // isGrounded ends
            //reset Pitch and Yaw
            mouseControls.pitch = 0;
            mouseControls.yaw = 0;
            prevTime = time;
        } // Controls Enabled ends
        else {
            player.setAngularVelocity(new Vector3(0, 0, 0));
        }
    }
    // Camera Look function
    function cameraLook() {
        var zenith = THREE.Math.degToRad(90);
        var nadir = THREE.Math.degToRad(-90);
        var cameraPitch = camera.rotation.x + mouseControls.pitch;
        // Constrain the Camera Pitch
        camera.rotation.x = THREE.Math.clamp(cameraPitch, nadir, zenith);
    }
    // Setup default renderer
    function setupRenderer() {
        renderer = new Renderer({ antialias: true });
        renderer.setClearColor(0x404040, 1.0);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(CScreen.WIDTH, CScreen.HEIGHT);
        renderer.shadowMap.enabled = true;
        console.log("Finished setting up Renderer...");
    }
    // Setup main camera for the scene
    function setupCamera() {
        camera = new PerspectiveCamera(35, config.Screen.RATIO, 0.1, 100);
        //camera.position.set(0, 10, 30);
        //camera.lookAt(new Vector3(0, 0, 0));
        console.log("Finished setting up Camera...");
    }
    window.onload = init;
    return {
        scene: scene
    };
})();
//# sourceMappingURL=game.js.map