import * as THREE from 'three';
import {GLTFLoader} from 'gltfloader';

export default class CouchFromFile extends THREE.Group {
    constructor() {
        super();

        this.gltfLoader = new GLTFLoader();
        this.load(this);
    }

    load (thisCouch) {
        this.gltfLoader.load('src/models/gray_l-shaped_couch/scene.gltf', function (gltf) {
            gltf.scene.traverse(function (node) {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            });

            thisCouch.add(gltf.scene);
        });
    }
}