import { renderer, scene, camera } from './scene.js';
import { updateControls } from './controls.js';

export function animate() {
    updateControls();
    renderer.render(scene, camera);
}
