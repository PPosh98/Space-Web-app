// Import the camera and renderer instances
import { camera, renderer } from './scene.js';

// Function to adjust the camera and renderer on window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Function to add the event listener for window resize
export function setupResizeHandler() {
    window.addEventListener('resize', onWindowResize, false);
}
