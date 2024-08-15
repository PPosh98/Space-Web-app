import { renderer, scene, camera } from './scene.js';
import { updateControls } from './controls.js';
import { models } from './loader.js';
import { stars } from './loader.js';


export function animation() {
    renderer.setAnimationLoop(animate)
}

function animate() {
    updateControls()
    orbit()
    animateStars()
    renderer.render(scene, camera)
}

function animateStars() {
    stars.rotation.x += 0.000015;
    stars.rotation.y += 0.000015;
    stars.rotation.z += 0.000015;
}

function orbit() {
    models.forEach(model => {
        const orbitRadius = model.userData.orbitRadius;
        const orbitSpeed = model.userData.orbitSpeed;
        const targetName = model.userData.targetName;

        const target = models.find(m => m.name == targetName);

        if (target) {
            const targetPosition = target.position;

            // Calculate the new position
            const time = Date.now() * 0.001 * orbitSpeed;
            model.position.x = targetPosition.x + orbitRadius * Math.cos(time);
            model.position.z = targetPosition.z + orbitRadius * Math.sin(time);
        }
    });
}

