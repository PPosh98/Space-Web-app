import * as THREE from 'three';
import { camera } from './scene.js';
import { clickedModel } from './loader.js';
import { models } from './loader.js';

const sidebar = document.getElementById('sidebar');
const planet_name = document.getElementById("planet-name-container")
const radius_slider = document.getElementById("radiusSlider")
const name_input = document.getElementById("nameInput")
const speed_slider = document.getElementById("speedSlider")
const size_slider = document.getElementById("sizeSlider")
const rotationX_Slider = document.getElementById("rotationXSlider")
const rotationY_Slider = document.getElementById("rotationYSlider")
const rotationZ_Slider = document.getElementById("rotationZSlider")
const position_value = document.getElementById("positionValue")
const radius_value = document.getElementById("radiusValue")
const size_value = document.getElementById("sizeValue")
const speed_value = document.getElementById("speedValue")
const rotationX_Value = document.getElementById("rotationXValue")
const rotationY_Value = document.getElementById("rotationYValue")
const rotationZ_Value = document.getElementById("rotationZValue")
const target_name_select = document.getElementById("targetNameSelect")

export function showPlanetName(model) {
    if (model !== null) {
        planet_name.innerHTML = `<p>Name: ${model.userData.name}</p>`;
        planet_name.style.display = 'block'; // Show the properties box
        updatePlanetNamePosition(model)
    }
}

export function showProperties(model) {
    if (model !== null) {
        // Generate options for the target dropdown
        const targetOptions = models.map(m => `<option value="${m.userData.name}" ${m.userData.name === model.userData.targetName ? 'selected' : ''}>${m.userData.name}</option>`).join('');
        console.log(targetOptions)
        name_input.value = model.userData.name
        radius_slider.value = model.userData.orbitRadius
        speed_slider.value = model.userData.orbitSpeed
        size_slider.value = model.userData.desiredDiameter
        rotationX_Slider.value = model.userData.rotation[0]
        rotationY_Slider.value = model.userData.rotation[1]
        rotationZ_Slider.value = model.userData.rotation[2]
        radius_value.value = model.userData.orbitRadius
        speed_value.value = model.userData.orbitSpeed
        size_value.value = model.userData.desiredDiameter
        rotationX_Value.value = model.userData.rotation[0]
        rotationY_Value.value = model.userData.rotation[1]
        rotationZ_Value.value = model.userData.rotation[2]
        target_name_select.innerHTML = targetOptions

        name_input.addEventListener('input', e => model.userData.name = e.target.value);
        radius_slider.addEventListener('input', e => model.userData.orbitRadius = +e.target.value);
        speed_slider.addEventListener('input', e => model.userData.orbitSpeed = +e.target.value);
        target_name_select.addEventListener('change', e => model.userData.targetName = e.target.value);
        rotationX_Slider.addEventListener('input', e => model.userData.rotation[0] = +e.target.value);
        rotationY_Slider.addEventListener('input', e => model.userData.rotation[1] = +e.target.value);
        rotationZ_Slider.addEventListener('input', e => model.userData.rotation[2] = +e.target.value);
        size_slider.addEventListener('input', e => model.userData.desiredDiameter = +e.target.value);

        updatePositionLoop(model);
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
export function updatePlanetNamePosition(model) {
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
    showProperties(clickedModel);
}

export function closeSidebar() {
    sidebar.style.width = '0px';
}
