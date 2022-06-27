import * as THREE from 'three';
import * as TWEEN from 'tween';

import {GridShader} from "../shaders/GridShader.js";

export default class Speaker extends THREE.Group {

    constructor() {
        super();
        this.animations = [];
        this.loadingDone = false;
        this.volume = 0.5;
        this.phone = null;
        this.addParts();

        this.state = {
            powerOn: false,
            lowerVolume: false,
            higherVolume: false,
            bluetoothOn: false,
            musicPlayingSpeaker: false
        }
    }

    addParts() {

        const corpusTexture = new THREE.TextureLoader().load('src/images/fabric/Fabric_BaseColor.jpg');
        corpusTexture.wrapS = THREE.RepeatWrapping;
        corpusTexture.wrapT = THREE.RepeatWrapping;
        corpusTexture.repeat.set(8, 8);

        const envMap = new THREE.TextureLoader()
            .load('../../lib/three.js-r139/examples/textures/2294472375_24a3b8ef46_o.jpg');
        envMap.mapping = THREE.EquirectangularReflectionMapping;
        envMap.encoding = THREE.sRGBEncoding;

        //Materials
        const corpusMaterial = new THREE.MeshStandardMaterial({
            color: 0x2e2d2b,
            flatShading: true,
            map: new THREE.TextureLoader().load('src/images/fabric/Fabric_BaseColor.jpg'),
            normalMap: new THREE.TextureLoader().load('src/images/fabric/Fabric_Normal.jpg'),
            roughnessMap: new THREE.TextureLoader().load('src/images/fabric/Fabric_Roughness.jpg'),
            aoMap: new THREE.TextureLoader().load('src/images/fabric/Fabric_AmbientOcclusion.jpg'),
            displacementScale: 0.1,
            bumpScale: 1.0
        });
        const frontGridMaterial = new THREE.MeshStandardMaterial({
            roughness: 0.3,
            metalness: 0.4,
            map: new THREE.TextureLoader().load('src/images/panels/front_grid.png'),
            normalMap: new THREE.TextureLoader().load('src/images/panels/frontGrid_normal.png'),
            envMap: envMap,
            envMapIntensity: 5
        });
        const frontGridMaterial2 = new THREE.ShaderMaterial({
            vertexShader: GridShader.vertexShader,
            fragmentShader: GridShader.fragmentShader,
            uniforms: {
                color: {type: 'c', value: new THREE.Color(0x2e2d2b)},
                slots: {type: 'f', value: 40.0},
            }
        });
        const sidePanelMaterial = new THREE.MeshPhongMaterial({
            color: 0x808080,
            flatShading: true,
            specular: 0x111111,
            map: new THREE.TextureLoader().load('src/images/panels/usb_speaker.png'),
            normalMap: new THREE.TextureLoader().load('src/images/panels/usb_panelNormal.png'),
        });
        const strapMaterial = new THREE.MeshPhongMaterial({
            color: 0x624a2e,
            flatShading: true,
            map: new THREE.TextureLoader().load('src/images/Leather_006_COLOR.jpg'),
        });
        const backPanelMaterial = new THREE.MeshPhongMaterial({
            flatShading: true,
            specular: 0x111111,
            map: new THREE.TextureLoader().load('src/images/panels/back_panel.png'),
            normalMap: new THREE.TextureLoader().load('src/images/panels/backPanel_normal.png'),
        });
        const buttonMaterial = new THREE.MeshPhongMaterial({
            flatShading: true,
            map: new THREE.TextureLoader().load('src/images/plastic/Plastic_basecolor.jpg'),
            normalMap: new THREE.TextureLoader().load('src/images/plastic/Plastic_normal.jpg'),
            aoMap: new THREE.TextureLoader().load('src/images/plastic/Plastic_ambientOcclusion.jpg')
        });
        const bluetoothMaterial = new THREE.MeshPhongMaterial({
            flatShading: true,
            map: new THREE.TextureLoader().load('src/images/buttons/bluetooth_button.png'),
            normalMap: new THREE.TextureLoader().load('src/images/buttons/bluetooth_normal.png'),
        });
        const volumeUpMaterial = new THREE.MeshPhongMaterial({
            flatShading: true,
            map: new THREE.TextureLoader().load('src/images/buttons/volume_up_button.png'),
            normalMap: new THREE.TextureLoader().load('src/images/buttons/up_normal.png'),
        });
        const volumeDownMaterial = new THREE.MeshPhongMaterial({
            flatShading: true,
            map: new THREE.TextureLoader().load('src/images/buttons/volume_down_button.png'),
            normalMap: new THREE.TextureLoader().load('src/images/buttons/low_normal.png'),
        });
        const playMaterial = new THREE.MeshPhongMaterial({
            flatShading: true,
            map: new THREE.TextureLoader().load('src/images/buttons/play_button.png'),
            normalMap: new THREE.TextureLoader().load('src/images/buttons/play_normal.png'),
        });
        const powerMaterial = new THREE.MeshPhongMaterial({
            flatShading: true,
            map: new THREE.TextureLoader().load('src/images/buttons/power_button.png'),
            normalMap: new THREE.TextureLoader().load('src/images/buttons/power_normal.png'),
        });
        const powerLightMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xeb4034,
            roughness: 0.5,
            transmission: 0.9
        });
        const bluetoothLightMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x039dfc,
            roughness: 0.5,
            transmission: 0.9
        });

        //Corpus
        const corpusGeometry = new THREE.BoxGeometry(60, 25, 15);
        const corpus = new THREE.Mesh(corpusGeometry, corpusMaterial);
        corpus.rotation.set(0, THREE.Math.degToRad(180), 0);
        corpus.castShadow = true;
        corpus.receiveShadow = true;
        corpus.name = "corpus";
        this.add(corpus);

        //Front Grid
        const frontGridGeometry = new THREE.PlaneGeometry(56, 21);
        const frontGrid = new THREE.Mesh(frontGridGeometry, frontGridMaterial);
        frontGrid.position.set(0, 0, 7.6);
        corpus.add(frontGrid);

        //Strap
        const strapShape = new THREE.Shape().absellipse(
            20, 0,
            3, 0.2,
            0, THREE.MathUtils.degToRad(360)
        );
        const strapSpline = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-0.5, 0, 0),
            new THREE.Vector3(-1, 15, 0),
            new THREE.Vector3(1, 15, 0),
            new THREE.Vector3(0.5, 0, 0)
        ]);
        strapSpline.curveType = 'catmullrom';
        strapSpline.tension = 1;
        strapSpline.closed = true;
        const extrudeSettings = {
            steps: 1000,
            curveSegments: 100,
            bevelEnabled: true,
            extrudePath: strapSpline
        };
        const strapGeometry = new THREE.ExtrudeGeometry(strapShape, extrudeSettings);
        const strap = new THREE.Mesh(strapGeometry, strapMaterial);
        strap.position.set(30, 12, 20);
        strap.rotation.set(0, THREE.Math.degToRad(0), THREE.Math.degToRad(-45));
        strap.castShadow = true;
        corpus.add(strap);

        //Back Panel
        const backPanelGeometry = new THREE.PlaneGeometry(54, 21);
        const backPanel = new THREE.Mesh(backPanelGeometry, backPanelMaterial);
        backPanel.position.set(0, 0, -8);
        backPanel.rotation.set(0, THREE.Math.degToRad(180), 0);
        corpus.add(backPanel);

        //Side Panel
        const sidePanelGeometry = new THREE.PlaneGeometry(6, 11);
        const sidePanel = new THREE.Mesh(sidePanelGeometry, sidePanelMaterial);
        sidePanel.position.set(-30.1, 0, 0);
        sidePanel.rotation.set(0, THREE.Math.degToRad(-90), 0);
        corpus.add(sidePanel);

        //Label
        const labelGeometry = new THREE.BoxGeometry(0.5, 4, 7);
        const label = new THREE.Mesh(labelGeometry, buttonMaterial);
        label.position.set(2.7, 0, 0);
        label.rotation.set(THREE.Math.degToRad(90), 0, 0);
        sidePanel.add(label);

        //Play Button
        const playGeometry = new THREE.CylinderGeometry(2, 2, 5, 32, 32);
        const playButton = new THREE.Mesh(playGeometry, buttonMaterial);
        playButton.position.set(0, 10.5, 0);
        corpus.add(playButton);
        const playPlane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), playMaterial);
        playPlane.position.set(0, 2.6, 0);
        playPlane.rotation.set(THREE.Math.degToRad(-90), 0, 0);
        playButton.name = 'playButton';
        playPlane.name = 'playButton';
        playButton.add(playPlane);

        //Volume Up Button
        const highVolumeGeometry = new THREE.CylinderGeometry(2, 2, 5, 32, 32);
        const volumeUpButton = new THREE.Mesh(highVolumeGeometry, buttonMaterial);
        volumeUpButton.position.set(5, 10.5, 0);
        corpus.add(volumeUpButton);
        const upPlane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), volumeUpMaterial);
        upPlane.position.set(0, 2.6, 0);
        upPlane.rotation.set(THREE.Math.degToRad(-90), 0, 0);
        volumeUpButton.name = 'volumeUpButton';
        upPlane.name = 'volumeUpButton';
        volumeUpButton.add(upPlane);

        //Volume Down Button
        const lowVolumeGeometry = new THREE.CylinderGeometry(2, 2, 5, 32, 32);
        const volumeDownButton = new THREE.Mesh(lowVolumeGeometry, buttonMaterial);
        volumeDownButton.position.set(-5, 10.5, 0);
        corpus.add(volumeDownButton);
        const downPlane = new THREE.Mesh(new THREE.PlaneGeometry(2, 1), volumeDownMaterial);
        downPlane.position.set(0, 2.6, 0);
        downPlane.rotation.set(THREE.Math.degToRad(-90), 0, 0);
        volumeDownButton.name = 'volumeDownButton';
        downPlane.name = 'volumeDownButton';
        volumeDownButton.add(downPlane);

        //Bluetooth Button
        const bluetoothGeometry = new THREE.CylinderGeometry(2, 2, 5, 32, 32);
        const bluetoothButton = new THREE.Mesh(bluetoothGeometry, buttonMaterial);
        bluetoothButton.position.set(10, 10.5, 0);
        corpus.add(bluetoothButton);
        const bluetoothPlane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), bluetoothMaterial);
        bluetoothPlane.position.set(0, 2.6, 0);
        bluetoothPlane.rotation.set(THREE.Math.degToRad(-90), 0, 0);
        bluetoothButton.name = 'bluetoothButton';
        bluetoothPlane.name = 'bluetoothButton';
        bluetoothButton.add(bluetoothPlane);

        //Power Button
        const powerGeometry = new THREE.CylinderGeometry(2, 2, 5, 32, 32);
        const powerButton = new THREE.Mesh(powerGeometry, buttonMaterial);
        powerButton.position.set(-10, 10.5, 0);
        corpus.add(powerButton);
        const powerPlane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), powerMaterial);
        powerPlane.position.set(0, 2.6, 0);
        powerPlane.rotation.set(THREE.Math.degToRad(-90), 0, 0);
        powerButton.name = 'powerButton';
        powerPlane.name = 'powerButton';
        powerButton.add(powerPlane);

        //Light: Power Button
        const lightPowerGeometry = new THREE.CylinderGeometry(0.5, 0.5, 5, 32, 32);
        const lightPower = new THREE.Mesh(lightPowerGeometry, powerLightMaterial);
        lightPower.position.set(-15, 10.2, 0);
        lightPower.name = 'lightPower';
        corpus.add(lightPower);

        //Light: Bluetooth Button
        const lightBluetoothGeometry = new THREE.CylinderGeometry(0.5, 0.5, 5, 32, 32);
        const lightBluetooth = new THREE.Mesh(lightBluetoothGeometry, bluetoothLightMaterial);
        lightBluetooth.position.set(15, 10.2, 0);
        corpus.add(lightBluetooth);

        //add animation to buttons
        for (let i = 4; i < 10; i++) {
            let button = this.children[0].children[i];
            button.downAnimation = new TWEEN.Tween(button.position)
                .to(new THREE.Vector3(
                    button.position.x, button.position.y - 0.2, button.position.z), 400)
                .repeat(1)
                .yoyo(true)
                .onComplete(this.updateFunctionalState.bind(this))
                .easing(TWEEN.Easing.Quadratic.Out);
        }

        this.loadingDone = true;
    }

    updateFunctionalState() {
        if (this.state.powerOn) {
            this.phone.state.musicPlayingPhone = false;
            this.children[0].children[9].material.transmission = 0;
            if (this.state.bluetoothOn) {
                this.children[0].children[10].material.transmission = 0;

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
                this.children[0].children[10].material.transmission = 0.9;
                this.phone.screenPlane.material.map = this.phone.playTexture;
                this.sound.pause();
            }
        } else {
            this.phone.screenPlane.material.map = this.phone.playTexture;
            this.children[0].children[9].material.transmission = 0.9;
            this.children[0].children[10].material.transmission = 0.9;
            this.sound.pause();
        }
    }

    addPhysics() {
        if (this.loadingDone === false) {
            window.setTimeout(this.addPhysics.bind(this), 100);
        } else {
            window.physics.addBox(this, 5, 62, 24, 17, 0, 0.6, 0);
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
}
