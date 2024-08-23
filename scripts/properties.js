import * as THREE from 'three';
import { camera } from './scene.js';
import { clickedModel } from './loader.js';
import { updateValue } from './utils.js';
import { models } from './loader.js';

const sidebar = document.getElementById('sidebar');
const planet_name = document.getElementById("planet-name-container")

export function showProperties(model, mode) {
    const information = document.getElementById('information');

    if (model !== null) {
        if (mode === 'simple') {
            planet_name.innerHTML = `<p>Name: ${model.userData.name}</p>`;
            planet_name.style.display = 'block'; // Show the properties box
        } else if (mode === 'complex') {
            // Generate options for the target dropdown
            const targetOptions = models.map(m => `<option value="${m.userData.name}" ${m.userData.name === model.userData.targetName ? 'selected' : ''}>${m.userData.name}</option>`).join('');

            // Create HTML for complex mode
            let informationHTML = `
                <p>Name: <input type="text" id="nameInput" value="${model.userData.name}"></p>
                <p>Orbit Radius: <input type="range" id="radiusSlider" min="0" max="1000" step="1" value="${model.userData.orbitRadius}"> <input type="text" id="radiusValue" value="${model.userData.orbitRadius}"></p>
                <p>Orbit Speed: <input type="range" id="speedSlider" min="0" max="50" step="1" value="${model.userData.orbitSpeed}"> <input type="text" id="speedValue" value="${model.userData.orbitSpeed}"></p>
                <p>Position: <span id="positionValue">${model.userData.position.toArray().map(value => value.toFixed(2)).join(', ')}</span></p>
                <p>Orbiting: 
                    <select id="targetNameSelect">
                        ${targetOptions}
                    </select>
                </p>
                <p>Size: <input type="range" id="sizeSlider" min="1" max="1000" step="10" value="${model.userData.desiredDiameter}"> <input type="text" id="sizeValue" value="${model.userData.desiredDiameter}"> km</p>
                 <p>Rotation X speed: <input type="range" id="rotationXSlider" min="0" max="500" step="5" value="${model.userData.rotation[0]}"> <input type="text" id="rotationXValue" value="${model.userData.rotation[0]}"> </p>
                <p>Rotation Y speed: <input type="range" id="rotationYSlider" min="0" max="500" step="5" value="${model.userData.rotation[1]}"> <input type="text" id="rotationYValue" value="${model.userData.rotation[1]}"> </p>
                <p>Rotation Z speed: <input type="range" id="rotationZSlider" min="0" max="500" step="5" value="${model.userData.rotation[2]}"> <input type="text" id="rotationZValue" value="${model.userData.rotation[2]}"> </p>`;
            information.innerHTML = informationHTML;
            console.log(model.userData)
            // Add event listeners to update model.userData
            document.getElementById('nameInput').addEventListener('input', (e) => {
                model.userData.name = e.target.value;
            });

            document.getElementById('radiusSlider').addEventListener('input', (e) => {
                const newOrbitRadius = parseFloat(e.target.value);
                model.userData.orbitRadius = newOrbitRadius;
                updateValue('radiusValue', newOrbitRadius);
            });
            document.getElementById('radiusValue').addEventListener('input', (e) => {
                const newOrbitRadius = parseFloat(e.target.value);
                model.userData.orbitRadius = newOrbitRadius;
                updateValue('radiusSlider', newOrbitRadius);  // Sync slider
            });

            document.getElementById('speedSlider').addEventListener('input', (e) => {
                const newOrbitSpeed = parseFloat(e.target.value);
                model.userData.orbitSpeed = newOrbitSpeed;
                updateValue('speedValue', newOrbitSpeed);
            });
            document.getElementById('speedValue').addEventListener('input', (e) => {
                const newOrbitSpeed = parseFloat(e.target.value);
                model.userData.orbitSpeed = newOrbitSpeed;
                updateValue('speedSlider', newOrbitSpeed);  // Sync slider
            });

            // Update targetName using the dropdown
            document.getElementById('targetNameSelect').addEventListener('change', (e) => {
                const newTargetName = e.target.value;
                model.userData.targetName = newTargetName;
            });

            document.getElementById('sizeSlider').addEventListener('input', (e) => {
                const newDesiredDiameter = parseFloat(e.target.value);
                model.userData.desiredDiameter = newDesiredDiameter;
                updateValue('sizeValue', newDesiredDiameter);
                updateModelScale(model);
            });
            document.getElementById('sizeValue').addEventListener('input', (e) => {
                const newDesiredDiameter = parseFloat(e.target.value);
                model.userData.desiredDiameter = newDesiredDiameter;
                updateValue('sizeSlider', newDesiredDiameter);  // Sync slider
                updateModelScale(model);
            });

            document.getElementById('rotationXSlider').addEventListener('input', (e) => {
                model.userData.rotation[0] = parseFloat(e.target.value);
                updateValue('rotationXValue', model.userData.rotation[0]);
            });
            document.getElementById('rotationXValue').addEventListener('input', (e) => {
                model.userData.rotation[0] = parseFloat(e.target.value);
                updateValue('rotationXSlider', model.userData.rotation[0]);
            });

            document.getElementById('rotationYSlider').addEventListener('input', (e) => {
                model.userData.rotation[1] = parseFloat(e.target.value);
                updateValue('rotationYValue', model.userData.rotation[1]);
            });
            document.getElementById('rotationYValue').addEventListener('input', (e) => {
                model.userData.rotation[1] = parseFloat(e.target.value);
                updateValue('rotationYSlider', model.userData.rotation[1]);
            });

            document.getElementById('rotationZSlider').addEventListener('input', (e) => {
                model.userData.rotation[2] = parseFloat(e.target.value);
                updateValue('rotationZValue', model.userData.rotation[2]);
            });
            document.getElementById('rotationZValue').addEventListener('input', (e) => {
                model.userData.rotation[2] = parseFloat(e.target.value);
                updateValue('rotationZSlider', model.userData.rotation[2]);
            });

            // Start the update loop for position
            updatePositionLoop(model);
        }
    }
}



// Helper function to recalculate and update the model's scale
function updateModelScale(model) {
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const currentDiameter = Math.max(size.x, size.y, size.z);
    const scaleFactor = model.userData.desiredDiameter / currentDiameter;

    model.scale.set(scaleFactor, scaleFactor, scaleFactor);
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
