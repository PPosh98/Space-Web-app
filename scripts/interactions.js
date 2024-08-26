import * as THREE from 'three';
import { camera } from './scene.js';
import { models } from './loader.js';
import { showPlanetName } from './properties.js';
import { getMousePosition } from './controls.js';

const raycaster = new THREE.Raycaster();

export function onPointerMove() {
    raycaster.setFromCamera(getMousePosition(), camera);

    const intersects = raycaster.intersectObjects(models);

    if (intersects.length > 0) {
        const hoveredModel = intersects[0].object;
        showPlanetName(hoveredModel);
    } else {
        document.getElementById('planet-name-container').style.display = 'none';
    }
}
