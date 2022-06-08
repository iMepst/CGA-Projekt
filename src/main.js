import * as THREE from 'three';
import * as DATGUI from 'datgui';
import * as CONTROLS from 'controls';
import * as TWEEN from 'tween';
import Stats from 'stats';


//Own modules
import Physics from "./physics/Physics.js";
import Floor from "./objects/Floor.js";
import Wall from "./objects/Wall.js";
import Table from "./objects/TableFromFile.js";
import HiFi from './objects/HiFiFromFile.js';
import Bed from './objects/BedFromFile.js';

//Event functions
import {executeRaycast} from "./eventfunctions/executeRaycast.js";

//Variable
let floor;
let leftWall;
let rightWall;
let spotLight;
let ambientLight;
const stats = new Stats();
const table = new Table();
const hifi = new HiFi();
const bed = new Bed();

function main() {
    //Initializing the camera, scene and window
    sceneInit();
    cameraInit();
    windowInit();

    //Using the Orbit Controls
    let orbitControls = new CONTROLS.OrbitControls(window.camera, window.renderer.domElement);
    orbitControls.target = new THREE.Vector3(0,0,0); //replaces window.camera.lookAt(0, 0, 0)

    audioInit();

    //Integration of the renderer output into the HTML structure
    document.getElementById('3d_content').appendChild(window.renderer.domElement);

    //Resizes the view if the aspect ratio of the window changes
    window.addEventListener( 'resize', onWindowResize, false );

    //Initializing the geometric objects
    floorInit();
    leftWallInit();
    rightWallInit();
    tableFromFileInit();
    hifiFromFileInit();
    bedFromFileInit();

    document.body.appendChild(stats.dom);
    mainLoop();

    //Initializing the light and the GUI
    spotLightInit();
    guiInit();

    orbitControls.update(); //Activate/acquire the target
}


function mainLoop() {
    stats.begin();
    window.renderer.render(window.scene, window.camera); //Rendering the scene
    stats.end();
    requestAnimationFrame(mainLoop); //Request for the next possible execution of the mainLoop()
}

window.onload = main; //fired when the entire page loads, including its content
//window.onclick = executeRaycast;


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
function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
function cameraInit() {
    //Camera-Object
    window.camera = new THREE.PerspectiveCamera(
        45, //Opening angle 𝛼 of the camera
        window.innerWidth / window.innerHeight, //Aspect Ratio
        0.1, //Distance of the near-plane
        5000); //Distance of the far-plane

    window.camera.position.set(-600, 500, 500);

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
    window.camera.add (window.audioListener);
}

//Object functions
function floorInit() {
    floor = new Floor();
    floor.position.set(0, 0, 0);
    window.scene.add(floor);
}
function leftWallInit() {
    leftWall = new Wall();
    leftWall.position.set(0, 125, -250);
    window.scene.add(leftWall);
}
function rightWallInit() {
    rightWall = new Wall();
    rightWall.position.set(250, 125, 0);
    rightWall.rotation.set(0, THREE.MathUtils.degToRad(-90), 0);
    window.scene.add(rightWall);
}
function tableFromFileInit() {
    table.position.set(0, 0, -100);
    table.scale.set(120, 120, 120);
    window.scene.add(table);
}
function hifiFromFileInit() {
    hifi.position.set(200, 0, 50);
    hifi.scale.set(0.7, 0.7, 0.7);
    hifi.rotation.set(0, THREE.MathUtils.degToRad(-90), 0);
    hifi.addSound();
    window.scene.add(hifi);
}
function bedFromFileInit() {
    bed.position.set(-40, 0, 120);
    bed.scale.set(0.45, 0.45, 0.45);
    bed.rotation.set(0, THREE.MathUtils.degToRad(-180), 0);
    window.scene.add(bed);
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
    spotLight.shadow.mapSize.set(2048, 2048);
    spotLight.shadow.camera.aspect = 1;
    spotLight.shadow.camera.near = 10;
    spotLight.shadow.camera.far = 500;
    window.scene.add(new THREE.CameraHelper(spotLight.shadow.camera));
    window.scene.add(spotLight);
}
function ambientLightInit() {
    ambientLight = new THREE.AmbientLight(0xFFFFFF);
    ambientLight.intensity = 1.0;
    ambientLight.target = floor;
    //ambientLight.castShadow = true;
    window.scene.add(ambientLight);
}

