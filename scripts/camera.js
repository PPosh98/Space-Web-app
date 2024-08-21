import { camera } from './scene.js';
import { clickedModel, diameter, nullifyclickedModel } from './loader.js';
import { openSidebar, closeSidebar } from './properties.js';
import { controls } from './controls.js';

export let cameraFollowEnabled = false;

export function cameraFollow() {
    if (clickedModel !== null && cameraFollowEnabled) {
        document.getElementById('crosshair').style.display = 'none';
        controls.unlock()
        document.getElementById('planet-properties').style.display = 'none';
        openSidebar();
        const targetPosition = clickedModel.userData.position;
        camera.position.set(
            targetPosition.x + diameter,
            targetPosition.y + diameter / 2,
            targetPosition.z + diameter
        );
        camera.lookAt(...targetPosition);
    }
}

export function setCameraFollowEnabled(isEnabled) {
    if (isEnabled) cameraFollowEnabled = true
    else cameraFollowEnabled = false
}

export function toggleCameraFollow(event) {
    if (event.key === 't') { // Change 't' to any key you prefer
        controls.lock()
        cameraFollowEnabled = !cameraFollowEnabled;
        if (cameraFollowEnabled === false) {
            nullifyclickedModel();
            // closeSidebar()
        }
    }
}
