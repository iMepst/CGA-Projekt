import * as THREE from 'three';
import {GLTFLoader} from 'gltfloader';

export default class CoffeeTableFromFile extends THREE.Group {
    constructor() {
        super();

        this.gltfLoader = new GLTFLoader();
        this.loadingDone = false;
        this.load(this);
    }

    load(thisTable) {
        this.gltfLoader.load('src/models/simple_table_low_poly/table.gltf', function (gltf) {
            gltf.scene.traverse(function (child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            thisTable.add(gltf.scene);
            thisTable.loadingDone = true;
        });
    }

    addPhysics() {
        if (this.loadingDone === false) {
            window.setTimeout(this.addPhysics.bind(this), 100);
        } else {
            window.physics.addBox(this, 15, 112, 65, 195, 0, 2, 0);
        }
    }
}