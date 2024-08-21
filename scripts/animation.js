import { renderer, scene, camera } from './scene.js';
import { updateControls } from './controls.js';
import { updateModelPositions } from './loader.js';
import { animateStars, orbit } from './orbit.js';
import { cameraFollow, cameraFollowEnabled } from './camera.js';

export function animation() {
    renderer.setAnimationLoop(animate);
}

function animate() {
    updateControls();
    animateStars();
    orbit()
    updateModelPositions();
    if (cameraFollowEnabled) cameraFollow();
    renderer.render(scene, camera);
}
