import * as THREE from 'three';
import { camera } from './scene.js';
import { clickedModel } from './loader.js';
import { models } from './loader.js';
import { saveSceneState } from './sceneState.js';


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
let { handleNameInput, handleRadiusSlider, handleSpeedSlider, handleTargetNameSelect,
     handleRotationXSlider, handleRotationYSlider, handleRotationZSlider, handleSizeSlider } = 0

let intervalId = 0

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
        const targetOptions = [
            `<option value="">None</option>`, // Adds a "None" option for no orbit
            ...models
                .filter(m => m.userData.name !== model.userData.name) // Excludes the clicked model
                .map(m => `<option value="${m.userData.name}" ${m.userData.name === model.userData.targetName ? 'selected' : ''}>${m.userData.name}</option>`)
        ].join('');

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

        addInputListeners(model)

        updatePositionLoop(model);
    }
}

export function autoSave(models) {
    const savedState = saveSceneState(models);
    localStorage.setItem('sceneState', savedState);
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

function updateModelScale(model, newDesiredDiameter) {
    if (!model.userData.originalDiameter) {
        console.error("Original model size is not set. Please initialize it properly.");
        return;
    }

    const originalDiameter = model.userData.originalDiameter; // Retrieve the stored original size
    const scaleFactor = newDesiredDiameter / originalDiameter; // Calculate new scale factor based on original size

    // Reset scale to original state before applying new scaling
    model.scale.set(1, 1, 1); // Reset scale to (1, 1, 1)
    model.scale.multiplyScalar(scaleFactor); // Apply the new scale factor

    // Update userData with new desired size
    model.userData.desiredDiameter = newDesiredDiameter; // Update the desired diameter
    model.userData.scaleFactor = scaleFactor; // Optionally store new scale factor
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
    intervalId = setInterval(() => {
        autoSave(models)
    }, 1000);
}

export function closeSidebar() {
    removeInputListeners()
    sidebar.style.width = '0px';
    clearInterval(intervalId);
}

function addInputListeners(model) {
    handleNameInput = e => model.userData.name = e.target.value;
    handleRadiusSlider = e => model.userData.orbitRadius = +e.target.value;
    handleSpeedSlider = e => model.userData.orbitSpeed = +e.target.value;
    handleTargetNameSelect = e => model.userData.targetName = e.target.value;
    handleRotationXSlider = e => model.userData.rotation[0] = +e.target.value;
    handleRotationYSlider = e => model.userData.rotation[1] = +e.target.value;
    handleRotationZSlider = e => model.userData.rotation[2] = +e.target.value;
    handleSizeSlider = (e) => {
        const newDesiredDiameter = +e.target.value; // Get the new desired diameter from the slider
        models.forEach((model) => {
            if (clickedModel.userData.name === model.userData.name) {
                updateModelScale(model, newDesiredDiameter)
            }
        }); // Update all models or target specific ones
        model.userData.desiredDiameter = +e.target.value;
    }

    name_input.addEventListener('input', handleNameInput);
    radius_slider.addEventListener('input', handleRadiusSlider);
    speed_slider.addEventListener('input', handleSpeedSlider);
    target_name_select.addEventListener('change', handleTargetNameSelect);
    rotationX_Slider.addEventListener('input', handleRotationXSlider);
    rotationY_Slider.addEventListener('input', handleRotationYSlider);
    rotationZ_Slider.addEventListener('input', handleRotationZSlider);
    size_slider.addEventListener('input', handleSizeSlider);
}

function removeInputListeners() {
    name_input.removeEventListener('input', handleNameInput);
    radius_slider.removeEventListener('input', handleRadiusSlider);
    speed_slider.removeEventListener('input', handleSpeedSlider);
    target_name_select.removeEventListener('change', handleTargetNameSelect);
    rotationX_Slider.removeEventListener('input', handleRotationXSlider);
    rotationY_Slider.removeEventListener('input', handleRotationYSlider);
    rotationZ_Slider.removeEventListener('input', handleRotationZSlider);
    size_slider.removeEventListener('input', handleSizeSlider);
}
