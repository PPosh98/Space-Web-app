import * as THREE from 'three';
import { camera } from './scene.js';
import { clickedModel } from './loader.js';
import { updateValue } from './utils.js';

const sidebar = document.getElementById('sidebar');
const planet_name = document.getElementById("planet-name-container")

export function showProperties(model, mode) {
    const information = document.getElementById('information');

    if (model !== null) {
        if (mode === 'simple') {
            planet_name.innerHTML = `<p>Name: ${model.userData.name}</p>`;
            planet_name.style.display = 'block'; // Show the properties box
        } else if (mode === 'complex') {
            let informationHTML = `
                <p>Name: <input type="text" id="nameInput" value="${model.userData.name}"></p>
                <p>Orbit Radius: <input type="range" id="radiusSlider" min="0" max="1000" value="${model.userData.orbitRadius}"> <input type="text" id="radiusValue" value="${model.userData.orbitRadius}"></p>
                <p>Orbit Speed: <input type="range" id="speedSlider" min="0" max="100" value="${model.userData.orbitSpeed}"> <input type="text" id="speedValue" value="${model.userData.orbitSpeed}"></p>
                <p>Position: <span id="positionValue">${model.userData.position.toArray().map(value => value.toFixed(2)).join(', ')}</span></p>
                <p>Orbiting: <input type="text" id="targetNameInput" value="${model.userData.targetName}"></p>
                <p>Size: <input type="range" id="sizeSlider" min="0" max="1000" value="${model.userData.desiredDiameter}"> <input type="text" id="sizeValue" value="${model.userData.desiredDiameter}"> km</p>`;
            information.innerHTML = informationHTML;

            // Add event listeners to update model.userData
            document.getElementById('nameInput').addEventListener('input', (e) => {
                model.userData.name = e.target.value;
            });

            // Update orbitRadius and reflect it in the model and orbit function
            document.getElementById('radiusSlider').addEventListener('input', (e) => {
                const newOrbitRadius = parseFloat(e.target.value);
                model.userData.orbitRadius = newOrbitRadius;
                updateValue('radiusValue', newOrbitRadius);
            });

            // Update orbitSpeed and reflect it in the model and orbit function
            document.getElementById('speedSlider').addEventListener('input', (e) => {
                const newOrbitSpeed = parseFloat(e.target.value);
                model.userData.orbitSpeed = newOrbitSpeed;
                updateValue('speedValue', newOrbitSpeed);
            });

            document.getElementById('targetNameInput').addEventListener('input', (e) => {
                model.userData.targetName = e.target.value;
            });

            document.getElementById('sizeSlider').addEventListener('input', (e) => {
                model.userData.desiredDiameter = e.target.value;
                updateValue('sizeValue', e.target.value);
            });

            // Start the update loop for position
            updatePositionLoop(model);
        }
    }
}

function updatePositionLoop(model) {
    function update() {
        if (model) {
            const fixedPosition = model.userData.position.toArray().map(value => value.toFixed(2));
            const positionElement = document.getElementById('positionValue');
            if (positionElement) {
                positionElement.textContent = fixedPosition.join(', ');
            }
        }
        requestAnimationFrame(update); // Continuously update on each frame
    }
    update();
}
export function updatePropertiesPosition(model) {

    if (model !== null) {
        const objectPosition = model.userData.position;
        const vector = new THREE.Vector3(objectPosition.x, objectPosition.y, objectPosition.z);
        vector.project(camera);

        const widthHalf = window.innerWidth / 2;
        const heightHalf = window.innerHeight / 2;

        const x = (vector.x * widthHalf) + widthHalf;
        const y = -(vector.y * heightHalf) + heightHalf;

        planet_name.style.left = `${x - 10}px`; // Adjust position slightly to the right
        planet_name.style.top = `${y}px`;
        planet_name.style.display = 'block';
    }
}

export function openSidebar() {
    sidebar.style.width = '250px';
    showProperties(clickedModel, 'complex');
}

export function closeSidebar() {
    sidebar.style.width = '0px';
}
