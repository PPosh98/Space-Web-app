import { renderer, scene, camera } from './scene.js';
import { updateControls } from './controls.js';
import * as THREE from 'three';

export function animation() {
    renderer.setAnimationLoop(animate);
}

function animate() {
    updateControls();
    orbit()
    renderer.render(scene, camera);
}

function orbit() {
    //Clock for smooth animation
    const clock = new THREE.Clock()
    const elapsedTime = clock.getElapsedTime();
    scene.children.forEach(child => {
        const time = Date.now();
        if (child.userData.orbitRadius && child.userData.orbitSpeed) {
            const orbitTime = elapsedTime * child.userData.orbitSpeed;
            child.position.x = Math.cos(orbitTime) * child.userData.orbitRadius;
            child.position.z = Math.sin(orbitTime) * child.userData.orbitRadius;
        }


    });
}
