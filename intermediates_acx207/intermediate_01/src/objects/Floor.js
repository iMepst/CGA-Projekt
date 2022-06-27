import * as THREE from 'three';

export default class Floor extends THREE.Group {
    constructor() {
        super();
        const floorGeometry = new THREE.BoxGeometry(600, 600, 4);
        const floorMaterial = new THREE.MeshStandardMaterial({color: 0xffffff, roughness: 0.3});

        const floorTexture = new THREE.TextureLoader().load('src/images/wood.jpg');
        floorTexture.repeat.set(4, 4);
        floorTexture.wrapS = THREE.RepeatWrapping;
        floorTexture.wrapT = THREE.RepeatWrapping;
        floorMaterial.map = floorTexture;

        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.set(THREE.MathUtils.degToRad(-90), 0, 0);
        floor.receiveShadow = true;
        this.add(floor);
    }

}