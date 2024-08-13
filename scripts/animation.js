import { renderer, scene, camera } from './scene.js';
import { updateControls } from './controls.js';
import * as THREE from 'three';
import { models } from './loader.js';
import { stars } from './loader.js';


export function animation() {
    renderer.setAnimationLoop(animate);
}

function animate() {
    updateControls();
    orbit()
    stars.rotation.x += 0.000015;
    stars.rotation.y += 0.000015;
    stars.rotation.z += 0.000015;
    renderer.render(scene, camera);
}

function orbit() {
    models.forEach(model => {
        const orbitRadius = model.userData.orbitRadius;
        const orbitSpeed = model.userData.orbitSpeed;
        const targetName = model.userData.targetName;

        // Find the target model by its name
        const target = models.find(m => m.name == targetName);

        if (target) {
            console.log(target)
            const targetPosition = target.position;

            // Calculate the new position
            const time = Date.now() * 0.001 * orbitSpeed;
            model.position.x = targetPosition.x + orbitRadius * Math.cos(time);
            model.position.z = targetPosition.z + orbitRadius * Math.sin(time);
        }
    });
}

// function orbit() {
//     //Clock for smooth animation
//     const clock = new THREE.Clock()
//     const elapsedTime = clock.getElapsedTime();
//     scene.children.forEach(child => {
//         if (child.userData.orbitRadius && child.userData.orbitSpeed) {
//             console.log(child.userData.orbitSpeed)
//             const orbitTime = elapsedTime * child.userData.orbitSpeed;
//             child.position.x = Math.cos(orbitTime) * child.userData.orbitRadius;
//             child.position.z = Math.sin(orbitTime) * child.userData.orbitRadius;
//         }


//     });
// }
