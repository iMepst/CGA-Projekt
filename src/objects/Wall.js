import * as THREE from 'three';

export default class Wall extends THREE.Group {
    constructor() {
        super();
        const wallGeometry = new THREE.PlaneGeometry(500, 250);

        const wallMaterial = new THREE.MeshStandardMaterial({color: 0xffffff, roughness: 0.3});

        const wallTexture = new THREE.TextureLoader().load('src/images/brick-wall.jpg');
        wallTexture.repeat.set(4, 4);
        wallTexture.wrapS = THREE.RepeatWrapping;
        wallTexture.wrapT = THREE.RepeatWrapping;
        wallMaterial.map = wallTexture;

        const wall = new THREE.Mesh(wallGeometry, wallMaterial);
        wall.rotation.set(0, 0, 0);
        wall.receiveShadow = true;
        this.add(wall);
    }
}
