import { onPointerMove } from './interactions.js';

export function setupEventListeners() {
    document.addEventListener('pointermove', onPointerMove);
}
