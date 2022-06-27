import * as THREE from 'three';
import {GLTFLoader} from 'gltfloader';

export default class PhoneFromFile extends THREE.Group {

    constructor(speakerFromFile, speaker) {
        super();
        this.gltfLoader = new GLTFLoader();
        this.playTexture = null;
        this.stopTexture = null;
        this.loadingDone = false;

        this.speakerFromFile = speakerFromFile;
        speakerFromFile.phone = this;
        this.speaker = speaker;
        speaker.phone = this;

        this.load(this);

        this.state = {
            musicPlayingPhone: false
        };
    }

    load(thisPhone) {
        this.gltfLoader.load('src/models/iphone_5s/scene.gltf', function (gltf) {
            gltf.scene.traverse(function (child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.parentPhone = thisPhone;
                }

                if (child.name === 'phoneScreenGLTF') {
                    const screenPlaneMaterial = new THREE.MeshLambertMaterial({
                        color: 0xffffff,
                        side: THREE.DoubleSide,
                        wireframe: false
                    });
                    const buttonMaterial = new THREE.MeshStandardMaterial({
                        transparent: true,
                    });
                    thisPhone.playTexture = new THREE.TextureLoader().load('src/images/play_screen.png');
                    thisPhone.stopTexture = new THREE.TextureLoader().load('src/images/stop_screen.png');
                    screenPlaneMaterial.map = thisPhone.playTexture;

                    const screenPlaneGeometry = new THREE.PlaneGeometry(15.5, 27);
                    thisPhone.screenPlane = new THREE.Mesh(screenPlaneGeometry, screenPlaneMaterial);
                    thisPhone.screenPlane.position.set(-0.06, -0.01, 0.1);
                    thisPhone.screenPlane.scale.set(0.1, 0.1, 0.1);
                    thisPhone.screenPlane.rotation.set(THREE.MathUtils.degToRad(90), 0, 0);
                    thisPhone.screenPlane.name = "screenPlane";
                    child.add(thisPhone.screenPlane);

                    const buttonGeometry = new THREE.CylinderGeometry(4, 4, 1, 32, 32);
                    thisPhone.button = new THREE.Mesh(buttonGeometry, buttonMaterial);
                    thisPhone.button.rotation.set(THREE.MathUtils.degToRad(90), 0, 0);
                    thisPhone.button.position.set(0, -8.2, 0)
                    thisPhone.button.name = "playButtonPhone";
                    thisPhone.button.visible = false;
                    thisPhone.screenPlane.add(thisPhone.button);

                    child.material.format = THREE.RGBAFormat;
                    child.material.transparent = true;
                    child.material.opacity = 0.4;
                }
            });
            thisPhone.loadingDone = true;
            thisPhone.add(gltf.scene);
        });
    }

    addPhysics() {
        if (this.loadingDone === false) {
            window.setTimeout(this.addPhysics.bind(this), 100);
        } else {
            window.physics.addBox(this, 2, 17, 2, 36, 1, 0.5, 0);
        }
    }

}