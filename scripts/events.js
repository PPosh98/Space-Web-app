import { toggleCameraFollow } from './camera.js';
import { onPointerMove } from './interactions.js';
import { updateValue } from './utils.js';

export function setupEventListeners() {
    document.addEventListener('keydown', toggleCameraFollow);
    document.addEventListener('pointermove', onPointerMove);

    document.addEventListener('input', function(event) {
        if (event.target.matches('input[type="range"]')) {
            updateValue(event.target.nextElementSibling.id, event.target.value);
        }
    });
}
