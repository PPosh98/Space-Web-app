import * as THREE from 'three';
import { camera } from './scene.js';
import { clickedModel } from './loader.js';

const sidebar = document.getElementById('sidebar');
const planet_name = document.getElementById("planet-name-container")

export function showProperties(model, mode) {
    const information = document.getElementById('information');

    if (model !== null) {
        const { name, orbitRadius, orbitSpeed, targetName, desiredDiameter, position } = model.userData;
        const fixedPosition = position.toArray().map(value => value.toFixed(2));
        
        if (mode === 'simple') {
            planet_name.innerHTML = `<p>Name: ${name}</p>`;
            planet_name.style.display = 'block'; // Show the properties box
        } else if (mode === 'complex') {
            let informationHTML = `
                <p>Name: <input type="text" id="nameInput" value="${name}"></p>
                <p>Orbit Radius: <input type="range" id="radiusSlider" min="0" max="1000" value="${orbitRadius}" oninput="updateValue('radiusValue', this.value)"> <input type="text" id="radiusValue" value="${orbitRadius}"></p>
                <p>Orbit Speed: <input type="range" id="speedSlider" min="0" max="100" value="${orbitSpeed}" oninput="updateValue('speedValue', this.value)"> <input type="text" id="speedValue" value="${orbitSpeed}"></p>
                <p>Position: ${fixedPosition}</p>
                <p>Orbiting: <input type="text" id="targetNameInput" value="${targetName}"></p>
                <p>Size: <input type="range" id="sizeSlider" min="0" max="100" value="${desiredDiameter}" oninput="updateValue('sizeValue', this.value)"> <input type="text" id="sizeValue" value="${desiredDiameter}"> km</p>`;
            information.innerHTML = informationHTML;
        }
    }
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
