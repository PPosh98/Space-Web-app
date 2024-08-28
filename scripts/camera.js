import { camera } from './scene.js';
import { clickedModel, diameter } from './loader.js';

export let cameraFollowEnabled = false;

export function cameraFollow() {
    if (clickedModel !== null && cameraFollowEnabled) {
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
