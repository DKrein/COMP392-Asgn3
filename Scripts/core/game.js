/// <reference path="_reference.ts"/>
// MAIN GAME FILE
// THREEJS Aliases
var Scene = Physijs.Scene;
var Renderer = THREE.WebGLRenderer;
var PerspectiveCamera = THREE.PerspectiveCamera;
var BoxGeometry = THREE.BoxGeometry;
var CubeGeometry = THREE.CubeGeometry;
var SphereGeometry = THREE.SphereGeometry;
var Geometry = THREE.Geometry;
var LambertMaterial = THREE.MeshLambertMaterial;
var LineBasicMaterial = THREE.LineBasicMaterial;
var PhongMaterial = THREE.MeshPhongMaterial;
var Line = THREE.Line;
var SpotLight = THREE.SpotLight;
var AmbientLight = THREE.AmbientLight;
var Vector3 = THREE.Vector3;
var CScreen = config.Screen;
var Clock = THREE.Clock;
var ImageUtils = THREE.ImageUtils;
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
    var deathPlaneGeometry;
    var deathPlanePhysicsMaterial;
    var deathPlaneMaterial;
    var deathPlane;
    var skyBox;
    var berryTexture;
    var berryGeometry;
    var berryPhysicsMaterial;
    var berryMaterial;
    var berry;
    var berryLocation = new Array();
    var berryNum = 0;
    var basketTexture;
    var basketGeometry;
    var basketPhysicsMaterial;
    var basketMaterial;
    var basket;
    var basketLocation = new Array();
    var basketNum = 0;
    var rockTexture;
    var rockGeometry;
    var rockPhysicsMaterial;
    var rockMaterial;
    var rock;
    var plateTexture;
    var plateGeometry;
    var platePhysicsMaterial;
    var plateMaterial;
    var plate;
    var plate2;
    var rock2a;
    var rock2b;
    //CreateJS Related Variables
    var assets;
    var canvas;
    var stage;
    var scoreLabel;
    var livesLabel;
    var scoreValue;
    var livesValue;
    var manifest = [
        { id: "Collision", src: "../../Assets/sounds/collision.mp3" },
        { id: "Collect", src: "../../Assets/sounds/collecting.mp3" },
        { id: "Falling", src: "../../Assets/sounds/falling.mp3" }
    ];
    //Create Preloader to load Assets
    function preload() {
        assets = new createjs.LoadQueue();
        assets.installPlugin(createjs.Sound);
        assets.on("complete", init, this);
        assets.loadManifest(manifest);
    }
    //Create Canvas
    function setupCanvas() {
        canvas = document.getElementById("canvas");
        canvas.setAttribute("width", config.Screen.WIDTH.toString());
        canvas.setAttribute("height", (config.Screen.HEIGHT * 0.1).toString());
        canvas.style.backgroundColor = "#000000";
        stage = new createjs.Stage(canvas);
    }
    function setupScoreboard() {
        // initialize  score and lives values
        scoreValue = 0;
        livesValue = 10;
        // Add Lives Label
        livesLabel = new createjs.Text("LIVES: " + livesValue, "40px Consolas", "#ffffff");
        livesLabel.x = config.Screen.WIDTH * 0.1;
        livesLabel.y = (config.Screen.HEIGHT * 0.15) * 0.1;
        stage.addChild(livesLabel);
        console.log("Added Lives Label to stage");
        // Add Score Label
        scoreLabel = new createjs.Text("SCORE: " + scoreValue, "40px Consolas", "#ffffff");
        scoreLabel.x = config.Screen.WIDTH * 0.8;
        scoreLabel.y = (config.Screen.HEIGHT * 0.15) * 0.1;
        stage.addChild(scoreLabel);
        console.log("Added Score Label to stage");
    }
    function labelResize() {
        livesLabel.x = config.Screen.WIDTH * 0.1;
        livesLabel.y = (config.Screen.HEIGHT * 0.15) * 0.1;
        scoreLabel.x = config.Screen.WIDTH * 0.8;
        scoreLabel.y = (config.Screen.HEIGHT * 0.15) * 0.1;
    }
    function init() {
        // Create to HTMLElements
        blocker = document.getElementById("blocker");
        instructions = document.getElementById("instructions");
        //Set up CreateJS Canvas and Stage
        setupCanvas();
        //Set up Scoreboard
        setupScoreboard();
        //check to see if pointerlock is supported
        havePointerLock = 'pointerLockElement' in document ||
            'mozPointerLockElement' in document ||
            'webkitPointerLockElement' in document;
        //define berry positions        
        berryLocation.push(new THREE.Vector3(-8.5, 1.5, -5.5));
        berryLocation.push(new THREE.Vector3(-2, 1.5, 16));
        berryLocation.push(new THREE.Vector3(17, 1.5, 0));
        berryLocation.push(new THREE.Vector3(-15, 1.5, -2));
        basketLocation.push(new THREE.Vector3(-16, 3, 14));
        basketLocation.push(new THREE.Vector3(15, 3, 16));
        basketLocation.push(new THREE.Vector3(-15, 3, -16));
        basketLocation.push(new THREE.Vector3(17, 3, -15));
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
        groundMaterial = new PhongMaterial();
        groundMaterial.map = groundTexture;
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
        island.name = "Ground";
        scene.add(island);
        console.log("Added Island1 to scene");
        islandTwoGeometry = new BoxGeometry(6, 1, 25);
        islandTwoPhysicsMaterial = Physijs.createMaterial(groundMaterial, 0, 0);
        islandTwo = new Physijs.ConvexMesh(islandTwoGeometry, islandTwoPhysicsMaterial, 0);
        islandTwo.position.set(17, 0, 0);
        islandTwo.receiveShadow = true;
        islandTwo.name = "Ground";
        scene.add(islandTwo);
        console.log("Added Island2 to scene");
        islandThreeGeometry = new BoxGeometry(6, 1, 25);
        islandThreePhysicsMaterial = Physijs.createMaterial(groundMaterial, 0, 0);
        islandThree = new Physijs.ConvexMesh(islandThreeGeometry, islandThreePhysicsMaterial, 0);
        islandThree.position.set(0, 0, -17);
        islandThree.rotateY(1.5708);
        islandThree.receiveShadow = true;
        islandThree.name = "Ground";
        scene.add(islandThree);
        console.log("Added Island3 to scene");
        islandFourGeometry = new BoxGeometry(6, 1, 25);
        islandFourPhysicsMaterial = Physijs.createMaterial(groundMaterial, 0, 0);
        islandFour = new Physijs.ConvexMesh(islandFourGeometry, islandFourPhysicsMaterial, 0);
        islandFour.position.set(0, 0, 17);
        islandFour.rotateY(1.5708);
        islandFour.receiveShadow = true;
        islandFour.name = "Ground";
        scene.add(islandFour);
        console.log("Added Island4 to scene");
        //Wall Objects
        wallTexture = new THREE.TextureLoader().load('../../Assets/images/wall.jpg');
        wallTexture.wrapS = THREE.RepeatWrapping;
        wallTexture.wrapT = THREE.RepeatWrapping;
        wallTexture.repeat.set(8, 8);
        wallMaterial = new PhongMaterial();
        wallMaterial.map = wallTexture;
        wallGeometry = new BoxGeometry(20, 4, .5);
        wallPhysicsMaterial = Physijs.createMaterial(wallMaterial, 0, 0);
        wall = new Physijs.ConvexMesh(wallGeometry, wallPhysicsMaterial, 0);
        wall.position.set(14.2, 2.5, -4.1);
        wall.rotateY(1.5708);
        wall.receiveShadow = true;
        wall.name = "Wall";
        scene.add(wall);
        console.log("Added Wall to scene");
        wallTwoGeometry = new BoxGeometry(20, 4, .5);
        wallTwoPhysicsMaterial = Physijs.createMaterial(wallMaterial, 0, 0);
        wallTwo = new Physijs.ConvexMesh(wallTwoGeometry, wallTwoPhysicsMaterial, 0);
        wallTwo.position.set(6, 2.5, 6.4);
        wallTwo.rotateY(1.5708);
        wallTwo.receiveShadow = true;
        wallTwo.name = "Wall";
        scene.add(wallTwo);
        console.log("Added Wall2 to scene");
        wallThreeGeometry = new BoxGeometry(20, 4, .5);
        wallThreePhysicsMaterial = Physijs.createMaterial(wallMaterial, 0, 0);
        wallThree = new Physijs.ConvexMesh(wallThreeGeometry, wallThreePhysicsMaterial, 0);
        wallThree.position.set(-10, 2.5, -6.1);
        wallThree.rotateY(1.5708);
        wallThree.receiveShadow = true;
        wallThree.name = "Wall";
        scene.add(wallThree);
        console.log("Added Wall3 to scene");
        wallFourGeometry = new BoxGeometry(10, 4, .5);
        wallFourPhysicsMaterial = Physijs.createMaterial(wallMaterial, 0, 0);
        wallFour = new Physijs.ConvexMesh(wallFourGeometry, wallFourPhysicsMaterial, 0);
        wallFour.position.set(-1.9, 2.5, -13);
        wallFour.rotateY(1.5708);
        wallFour.receiveShadow = true;
        wallFour.name = "Wall";
        scene.add(wallFour);
        console.log("Added Wall4 to scene");
        wallFiveGeometry = new BoxGeometry(20, 4, .5);
        wallFivePhysicsMaterial = Physijs.createMaterial(wallMaterial, 0, 0);
        wallFive = new Physijs.ConvexMesh(wallFiveGeometry, wallFivePhysicsMaterial, 0);
        wallFive.position.set(-7.7, 2.5, 9.7);
        wallFive.receiveShadow = true;
        wallFive.name = "Wall";
        scene.add(wallFive);
        console.log("Added Wall5 to scene");
        wallSixGeometry = new BoxGeometry(20, 4, .5);
        wallSixPhysicsMaterial = Physijs.createMaterial(wallMaterial, 0, 0);
        wallSix = new Physijs.ConvexMesh(wallSixGeometry, wallSixPhysicsMaterial, 0);
        wallSix.position.set(-7.6, 2.5, -3.85);
        wallSix.receiveShadow = true;
        wallSix.name = "Wall";
        scene.add(wallSix);
        console.log("Added Wall6 to scene");
        deathPlaneGeometry = new BoxGeometry(90, 4, 90);
        deathPlanePhysicsMaterial = new THREE.MeshLambertMaterial({ color: 0xE5E5FF, transparent: true, opacity: 0.1 });
        deathPlane = new Physijs.ConvexMesh(deathPlaneGeometry, deathPlanePhysicsMaterial, 0);
        deathPlane.position.set(0, -20, 0);
        deathPlane.receiveShadow = false;
        deathPlane.name = "DeathPlane";
        scene.add(deathPlane);
        console.log("Added DeathPlane to scene");
        skyBox = new gameObject(new SphereGeometry(60, 60, 60), new LambertMaterial({ map: ImageUtils.loadTexture('../../Assets/Images/skyBG.jpg') }), 2, 2, 2);
        skyBox.material.side = THREE.DoubleSide;
        skyBox.name = "Skybox";
        scene.add(skyBox);
        console.log("Added skyBox to scene");
        //Collectables Object
        berryTexture = new THREE.TextureLoader().load('../../Assets/images/berry.jpg');
        berryTexture.wrapS = THREE.RepeatWrapping;
        berryTexture.wrapT = THREE.RepeatWrapping;
        berryMaterial = new PhongMaterial();
        berryMaterial.map = berryTexture;
        berryGeometry = new BoxGeometry(.5, .5, .5);
        berryPhysicsMaterial = Physijs.createMaterial(berryMaterial, 0, 0);
        berry = new Physijs.ConvexMesh(berryGeometry, berryPhysicsMaterial, 0);
        berry.position.set(-8.5, 1.5, -5.5);
        berry.receiveShadow = true;
        berry.name = "Berry";
        scene.add(berry);
        console.log("Added Berry to scene");
        basketTexture = new THREE.TextureLoader().load('../../Assets/images/bask.jpg');
        basketTexture.wrapS = THREE.RepeatWrapping;
        basketTexture.wrapT = THREE.RepeatWrapping;
        basketMaterial = new PhongMaterial();
        basketMaterial.map = basketTexture;
        basketGeometry = new BoxGeometry(.5, .5, .5);
        basketPhysicsMaterial = Physijs.createMaterial(basketMaterial, 0, 0);
        basket = new Physijs.ConvexMesh(basketGeometry, basketPhysicsMaterial, 0);
        basket.position.set(-16, 3, 14);
        basket.receiveShadow = true;
        basket.name = "Basket";
        scene.add(basket);
        console.log("Added basket to scene");
        //Collision Object
        rockTexture = new THREE.TextureLoader().load('../../Assets/images/rock.jpg');
        rockTexture.wrapS = THREE.RepeatWrapping;
        rockTexture.wrapT = THREE.RepeatWrapping;
        rockMaterial = new PhongMaterial();
        rockMaterial.map = rockTexture;
        rockGeometry = new SphereGeometry(1, 5, 5);
        rockPhysicsMaterial = Physijs.createMaterial(rockMaterial, 0, 0);
        rock = new Physijs.ConvexMesh(rockGeometry, rockPhysicsMaterial, 1);
        rock.position.set(-4, 10, -5.5);
        rock.receiveShadow = true;
        rock.name = "Rock";
        rock2a = new Physijs.ConvexMesh(rockGeometry, rockPhysicsMaterial, 1);
        rock2a.position.set(-17, 10, -8);
        rock2a.receiveShadow = true;
        rock2a.name = "Rock";
        rock2b = new Physijs.ConvexMesh(rockGeometry, rockPhysicsMaterial, 1);
        rock2b.position.set(-18, 10, 2);
        rock2b.receiveShadow = true;
        rock2b.name = "Rock";
        //Plate Object
        plateTexture = new THREE.TextureLoader().load('../../Assets/images/PressurePlate.jpg');
        plateTexture.wrapS = THREE.RepeatWrapping;
        plateTexture.wrapT = THREE.RepeatWrapping;
        plateMaterial = new PhongMaterial();
        plateMaterial.map = plateTexture;
        plateGeometry = new CubeGeometry(1, 0.001, 1);
        platePhysicsMaterial = Physijs.createMaterial(plateMaterial, 0, 0);
        plate = new Physijs.ConvexMesh(plateGeometry, platePhysicsMaterial, 0);
        plate.position.set(1, .5, -5.5);
        plate.receiveShadow = true;
        plate.name = "Plate";
        scene.add(plate);
        plate2 = new Physijs.ConvexMesh(plateGeometry, platePhysicsMaterial, 0);
        plate2.position.set(-18.7, .5, -3);
        plate2.receiveShadow = true;
        plate2.name = "Plate2";
        scene.add(plate2);
        // Player Object
        playerGeometry = new BoxGeometry(2, 4, 2);
        playerMaterial = Physijs.createMaterial(new LambertMaterial({ color: 0x00ff00 }), 0.4, 0);
        player = new Physijs.BoxMesh(playerGeometry, playerMaterial, 1);
        player.position.set(0, 20, 0);
        player.receiveShadow = true;
        player.castShadow = true;
        player.name = "Player";
        //player._physijs.mass = 1.7;
        scene.add(player);
        console.log("Added Player to Scene");
        player.setAngularFactor(new THREE.Vector3(0, 0, 0));
        // Collision Check
        player.addEventListener('collision', function (event) {
            if (event.name === "Ground" || event.name === "Wall") {
                console.log("player hit the ground");
                isGrounded = true;
            }
            if (event.name === "Berry") {
                createjs.Sound.play("Collect");
                collectablePicked(event);
                console.log("player ate a berry");
            }
            if (event.name === "Basket") {
                createjs.Sound.play("Collect");
                collectablePicked(event);
                console.log("player ate a basket");
            }
            if (event.name === "Plate") {
                scene.add(rock);
                console.log("Added Rock to scene");
            }
            if (event.name === "Plate2") {
                scene.add(rock2a);
                scene.add(rock2b);
                console.log("Added Rock to scene");
            }
            if (event.name === "DeathPlane") {
                createjs.Sound.play("Falling");
                addDeath();
                console.log("Dead by falling");
            }
            if (event.name === "Rock" && event.position.y > 2) {
                createjs.Sound.play("Collision");
                addDeath();
                console.log("YOU GOT HIT BY A ROCK!");
            }
        });
        //Rock eventHandler
        rock.addEventListener('collision', function (event) {
            if (event.name === "Ground" || event.name === "Wall") {
                resetRock();
            }
        });
        rock2a.addEventListener('collision', function (event) {
            if (event.name === "Ground" || event.name === "Wall") {
                resetRock();
            }
        });
        rock2b.addEventListener('collision', function (event) {
            if (event.name === "Ground" || event.name === "Wall") {
                resetRock();
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
        // Add framerate stats
        addStatsObject();
        console.log("Added Stats to scene...");
        document.body.appendChild(renderer.domElement);
        gameLoop(); // render the scene	
        scene.simulate();
        window.addEventListener('resize', onWindowResize, false);
    }
    //reset rock
    function resetRock() {
        scene.remove(rock);
        scene.remove(rock2a);
        scene.remove(rock2b);
        rock.position.set(-4, 10, -5.5);
        rock2a.position.set(-17, 10, -8);
        rock2b.position.set(-18, 10, 2);
    }
    //Check player position and kills player if they fall
    function collectablePicked(collectable) {
        scene.remove(collectable);
        if (collectable.name === "Berry") {
            berryNum = berryNum === (berryLocation.length - 1) ? 0 : (berryNum + 1);
            collectable.position.x = berryLocation[berryNum].x;
            collectable.position.y = berryLocation[berryNum].y;
            collectable.position.z = berryLocation[berryNum].z;
            scoreValue += 2;
        }
        if (collectable.name === "Basket") {
            basketNum = basketNum === (basketLocation.length - 1) ? 0 : (basketNum + 1);
            collectable.position.x = basketLocation[basketNum].x;
            collectable.position.y = basketLocation[basketNum].y;
            collectable.position.z = basketLocation[basketNum].z;
            scoreValue += 5;
        }
        scoreLabel.text = "SCORE: " + scoreValue;
        scene.add(collectable);
    }
    //Check player position and kills player if they fall
    function addDeath() {
        livesValue--;
        livesLabel.text = "LIVES: " + livesValue;
        scene.remove(player);
        player.position.set(0, 30, 0);
        scene.add(player);
        console.log("YOU HAVE DIED!");
        resetRock();
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
        canvas.style.width = "100%";
        labelResize();
        stage.update();
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
        stage.update();
        // render using requestAnimationFrame
        requestAnimationFrame(gameLoop);
        // render the scene
        renderer.render(scene, camera);
    }
    // Check Controls Function
    function checkControls() {
        if (keyboardControls.moveBackward) {
            console.log(player.position);
        }
        if (keyboardControls.enabled) {
            velocity = new Vector3();
            var time = performance.now();
            var delta = (time - prevTime) / 1000;
            var speed = 600.0;
            //if (isGrounded) {
            var direction = new Vector3(0, 0, 0);
            if (keyboardControls.moveForward) {
                velocity.z -= speed * delta;
            }
            if (keyboardControls.moveLeft) {
                velocity.x -= speed * delta;
            }
            if (keyboardControls.moveBackward) {
                velocity.z += speed * delta;
            }
            if (keyboardControls.moveRight) {
                velocity.x += speed * delta;
            }
            if (keyboardControls.jump && isGrounded) {
                if (player.position.y >= 1 && player.position.y <= 3) {
                    velocity.y += 10 * speed * delta;
                }
                else if (player.position.y > 3) {
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
            //}
            // isGrounded ends
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
    window.onload = preload;
    // window.onload = init;
    return {
        scene: scene
    };
})();
//# sourceMappingURL=game.js.map