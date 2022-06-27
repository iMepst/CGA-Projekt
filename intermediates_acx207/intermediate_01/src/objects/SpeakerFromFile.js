import * as THREE from 'three';
import {GLTFLoader} from 'gltfloader';

export default class SpeakerFromFile extends THREE.Group {

    constructor() {
        super();

        this.gltfLoader = new GLTFLoader();
        this.animationMixer = null;
        this.animations = new Map();
        this.loadingDone = false;
        this.phone = null;
        this.volume = 0.5;
        this.load(this);

        this.state = {
            powerOn: false,
            lowerVolume: false,
            higherVolume: false,
            bluetoothOn: false,
            musicPlayingSpeaker: false
        }

    }

    load(thisSpeaker) {
        this.gltfLoader.load('src/models/speaker/scene.gltf', function (gltf) {
            gltf.scene.traverse(function (child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.parentSpeaker = thisSpeaker;
                }

                thisSpeaker.animationMixer = new THREE.AnimationMixer(gltf.scene);
                for (let i = 0; i < gltf.animations.length; i++) {
                    let action = thisSpeaker.animationMixer.clipAction(gltf.animations[i]);
                    action.clampWhenFinished = true;
                    action.setLoop(THREE.LoopOnce);
                    thisSpeaker.animations.set(gltf.animations[i].name, action);
                }

            });
            thisSpeaker.add(gltf.scene);
            thisSpeaker.loadingDone = true;
            thisSpeaker.animationMixer.addEventListener('finished', thisSpeaker.updateFunctionalState.bind(thisSpeaker));

        });
    }

    updateFunctionalState() {
        let bluetoothLight = null;
        let powerLight = null;
        this.traverse(function (child) {
            if (child.name === 'bluetooth_LightGLTF') {
                bluetoothLight = child;
            }
            if (child.name === 'power_LightGLTF') {
                powerLight = child;
            }
        });


        if (this.state.powerOn) {
            powerLight.material.color.setHex(0xeb4034);
            if (this.state.bluetoothOn) {
                bluetoothLight.material.color.setHex(0x66deff);

                if (this.state.higherVolume) {
                    this.sound.setVolume(this.sound.getVolume()+1);
                    console.log(this.sound.getVolume());
                    this.state.higherVolume = false;
                } else if (this.state.lowerVolume) {
                    this.sound.setVolume(this.sound.getVolume()-1);
                    console.log(this.sound.getVolume());
                    this.state.lowerVolume = false;
                }

                if (this.state.musicPlayingSpeaker || this.phone.state.musicPlayingPhone) {
                    this.phone.screenPlane.material.map = this.phone.stopTexture;
                    this.sound.play();
                } else {
                    this.phone.screenPlane.material.map = this.phone.playTexture;
                    this.sound.pause()
                }
            } else {
                this.sound.pause();
                bluetoothLight.material.color.setHex(0x707070);
                this.phone.screenPlane.material.map = this.phone.playTexture;
            }
        } else {
            powerLight.material.color.setHex(0x707070);
            bluetoothLight.material.color.setHex(0x707070);
            this.sound.pause();
            this.phone.screenPlane.material.map = this.phone.playTexture;
        }
    }

    addSound() {
        this.sound = new THREE.PositionalAudio(window.audioListener);
        const audioLoader = new THREE.AudioLoader();

        audioLoader.load('src/sounds/oneMoreTime.wav', (buffer) => {
            this.sound.setBuffer(buffer);
            this.sound.setRefDistance(20);
            this.sound.setVolume(0.5);
            this.sound.setLoop(false);
        });
        this.add(this.sound)
    }

    addPhysics() {
        if (this.loadingDone === false) {
            window.setTimeout(this.addPhysics.bind(this), 100);
        } else {
            window.physics.addBox(this, 5, 65, 23, 17, 0, 14, 0.5);
        }
    }
}