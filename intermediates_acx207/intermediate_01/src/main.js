import * as THREE from 'three';
import * as DATGUI from 'datgui';
import * as CONTROLS from 'controls';
import * as TWEEN from 'tween';
import Stats from 'stats';


//Own modules
import Floor from "./objects/Floor.js";
import Wall from "./objects/Wall.js";
import Office from "./objects/OfficeFromFile.js";
import Couch from './objects/CouchFromFile.js';
import CoffeeTable from './objects/CoffeeTableFromFile.js';
import Phone from './objects/PhoneFromFile.js';
import SpeakerFromFile from './objects/SpeakerFromFile.js';
import Speaker from './objects/Speaker.js';
import Physics from './physics/Physics.js';

//Event functions
import {executeRaycast} from "./eventfunctions/executeRaycast.js";
import {calculateMousePosition} from "./eventfunctions/calculateMousePosition.js";
import {keyDownAction, keyUpAction} from "./eventfunctions/executeKeyAction.js";

//Variable
let floor;
let leftWall;
let rightWall;
let spotLight;
const stats = new Stats();
const office = new Office();
const couch = new Couch();
const coffeeTable = new CoffeeTable();
const speaker = new Speaker();
const speakerFromFile = new SpeakerFromFile();
const phone = new Phone(speakerFromFile, speaker);

const clock = new THREE.Clock();

function main() {
    //Initializing the camera, scene and window
    sceneInit();
    cameraInit();
    windowInit();

    //Using the Orbit Controls
    let orbitControls = new CONTROLS.OrbitControls(window.camera, window.renderer.domElement);
    orbitControls.target = new THREE.Vector3(0, 0, 0); //replaces window.camera.lookAt(0, 0, 0)

    audioInit();
    physicInit();

    //Integration of the renderer output into the HTML structure
    document.getElementById('3d_content').appendChild(window.renderer.domElement);

    //Resizes the view if the aspect ratio of the window changes
    window.addEventListener('resize', onWindowResize, false);

    //Initializing the geometric objects
    coffeeTableInit();
    floorInit();
    leftWallInit();
    rightWallInit();
    officeFromFileInit();
    couchFromFileInit();
    checkLoaded();

    //Initializing the light and the GUI
    spotLightInit();
    guiInit();

    document.body.appendChild(stats.dom);
    mainLoop();

    orbitControls.update(); //Activate/acquire the target
}


function mainLoop() {
    stats.begin();
    window.renderer.render(window.scene, window.camera); //Rendering the scene

    const delta = clock.getDelta();
    TWEEN.update(); //Update tweens

    if (speakerFromFile.animationMixer !== null) {
        speakerFromFile.animationMixer.update(delta);
    }
    window.physics.update(delta);
    stats.end();
    requestAnimationFrame(mainLoop); //Request for the next possible execution of the mainLoop()
}

document.getElementById("startButton").addEventListener("click", function (event) {
    main();
    document.getElementById("overlay").remove();
    window.onclick = executeRaycast;
    window.onmousemove = calculateMousePosition; //Mouse position
    window.onkeydown = keyDownAction; //Keyboard events
    window.onkeyup = keyUpAction;
});


//Scene, window, camera, GUI and physics functions
function sceneInit() {
    window.scene = new THREE.Scene(); //Scene graph Object
    window.scene.add(new THREE.AxesHelper(50)); //Length of the Coordinate axes
}

function windowInit() {
    window.renderer = new THREE.WebGLRenderer({antialias: true}); //Renderer-Object
    window.renderer.setSize(window.innerWidth, window.innerHeight); //Size of the Framebuffer
    window.renderer.setClearColor(0xFFFFFF); //Background color of the frame buffer
    window.renderer.shadowMap.enabled = true;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function cameraInit() {
    //Camera-Object
    window.camera = new THREE.PerspectiveCamera(
        45, //Opening angle 𝛼 of the camera
        window.innerWidth / window.innerHeight, //Aspect Ratio
        0.1, //Distance of the near-plane
        5000); //Distance of the far-plane

    window.camera.position.set(-600, 500, 600);

}

function guiInit() {
    let gui = new DATGUI.GUI();

    const lightFolder = gui.addFolder('Light');
    lightFolder.add(spotLight.position, 'x', -300, 1000);
    lightFolder.add(spotLight.position, 'y', -300, 1000);
    lightFolder.add(spotLight.position, 'z', -300, 1000);

    lightFolder.open();
}

function audioInit() {
    window.audioListener = new THREE.AudioListener();
    window.camera.add(window.audioListener);
}

function physicInit() {
    window.physics = new Physics(true);
    window.physics.setup(0, -200, 0, 1 / 4096, true);
}

//Object functions
function floorInit() {
    floor = new Floor();
    floor.position.set(0, 0, 0);
    floor.rotation.set(THREE.MathUtils.degToRad(180), 0, 0);
    window.scene.add(floor);
}

function leftWallInit() {
    leftWall = new Wall();
    leftWall.position.set(0, 125, -300);
    window.scene.add(leftWall);
}

function rightWallInit() {
    rightWall = new Wall();
    rightWall.position.set(300, 125, 0);
    rightWall.rotation.set(0, THREE.MathUtils.degToRad(-90), 0);
    window.scene.add(rightWall);
}

function officeFromFileInit() {
    office.position.set(0, 4, -135);
    office.scale.set(1.3, 1.3, 1.3);
    window.scene.add(office);
}

function couchFromFileInit() {
    couch.position.set(-190, 3, 120);
    couch.scale.set(140, 140, 140);
    couch.rotation.set(0, THREE.MathUtils.degToRad(90), 0);
    window.scene.add(couch);
}

function coffeeTableInit() {
    coffeeTable.position.set(-100, 36, 60);
    coffeeTable.scale.set(60, 50, 60);
    coffeeTable.rotation.set(0, 0, 0);
    coffeeTable.addPhysics();
    window.scene.add(coffeeTable);
}

function phoneFromFileInit() {
    phone.position.set(-100, 72, 65);
    phone.scale.set(10, 10, 10);
    phone.rotation.set(0, THREE.MathUtils.degToRad(25), 0);
    phone.addPhysics();
    window.scene.add(phone);
}

function speakerFromFileInit() {
    speakerFromFile.position.set(-100, 68, 0);
    speakerFromFile.scale.set(5, 5, 5);
    speakerFromFile.rotation.set(0, THREE.MathUtils.degToRad(-180), 0);
    speakerFromFile.addPhysics();
    speakerFromFile.addSound();
    window.scene.add(speakerFromFile);
}

function speakerInit() {
    speaker.position.set(-100, 82, 120);
    speaker.rotation.set(0, 0, 0);
    speaker.addPhysics();
    speaker.addSound();
    window.scene.add(speaker);
}

//Light functions
function spotLightInit() {
    spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-230, 750, 800);
    spotLight.intensity = 1.5;
    spotLight.target = floor;
    spotLight.angle = THREE.MathUtils.degToRad(30);
    spotLight.penumbra = 1;
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.set(4096, 4096);
    spotLight.shadow.bias = -0.00001;
    spotLight.shadow.camera.near = 1; // default
    spotLight.shadow.camera.far = 5000; // default
    spotLight.shadow.focus = 0.5; // default
    window.scene.add(new THREE.CameraHelper(spotLight.shadow.camera));
    window.scene.add(spotLight);
}

function checkLoaded() {
    if (coffeeTable.loadingDone === false) {
        window.setTimeout(checkLoaded, 100);
    } else {
        console.log("Loading done");
        phoneFromFileInit();
        speakerFromFileInit();
        speakerInit();
    }
}

