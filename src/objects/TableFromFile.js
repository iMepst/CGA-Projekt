import * as THREE from 'three';
import {GLTFLoader} from 'gltfloader';

export default class TableFromFile extends THREE.Group {
    constructor() {
        super();

        this.gltfLoader = new GLTFLoader();
        this.load(this);
    }

    load (thisScene) {
        this.gltfLoader.load('src/models/home_office__blender_asset_pack/scene.gltf', function (gltf) {
            gltf.scene.traverse(function (child) {
                if (child.isMesh) {
                    child.castShadow = true;
                }
            });
            thisScene.add(gltf.scene);
        });
    }
}