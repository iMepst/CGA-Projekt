import * as THREE from 'three';
import {GLTFLoader} from 'gltfloader';

export default class OfficeFromFile extends THREE.Group {
    constructor() {
        super();

        this.gltfLoader = new GLTFLoader();
        this.load(this);
    }

    load(thisScene) {
        this.gltfLoader.load('src/models/home_office__blender_asset_pack/scene.gltf', function (gltf) {
            gltf.scene.traverse(function (node) {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            });
            thisScene.add(gltf.scene);
        });
    }
}