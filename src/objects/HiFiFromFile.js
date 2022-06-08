import * as THREE from 'three';
import {GLTFLoader} from 'gltfloader';

export default class HiFiFromFile extends THREE.Group {
    constructor() {
        super();

        this.gltfLoader = new GLTFLoader();
        this.load(this);
    }

    load (thisHiFi) {
        this.gltfLoader.load('src/models/vintage_stereo_hi-fi_stack_w_speakers/scene.gltf', function (gltf) {
            gltf.scene.traverse(function (child) {
                if (child.isMesh) {
                    child.castShadow = true;
                }
            });
            thisHiFi.add(gltf.scene);
        });
    }

    addSound() {
        const sound = new THREE.PositionalAudio(window.audioListener);
        const audioLoader = new THREE.AudioLoader();
        audioLoader.load('src/sounds/oneMoreTime.wav', function (buffer) {
            sound.setBuffer(buffer);
            sound.setRefDistance(20);
            sound.setVolume(1);
            sound.setLoop(true);
            //sound.play();
        });
        this.add(sound);
    }
}