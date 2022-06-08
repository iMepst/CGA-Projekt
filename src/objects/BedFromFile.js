import * as THREE from 'three';
import {GLTFLoader} from 'gltfloader';

export default class BedFromFile extends THREE.Group {
    constructor() {
        super();

        this.gltfLoader = new GLTFLoader();
        this.load(this);
    }

    load (thisHiFi) {
        this.gltfLoader.load('src/models/bed_with_lamp/scene.gltf', function (gltf) {
            gltf.scene.traverse(function (child) {
                if (child.isMesh) {
                    child.castShadow = true;
                }
            });
            thisHiFi.add(gltf.scene);
        });
    }
}