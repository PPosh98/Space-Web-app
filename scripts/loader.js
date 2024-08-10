import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { scene } from './scene.js';

const loader = new GLTFLoader();
export const models = []; // Array to store loaded models for animation

function modelLoader(url, options = {}) {
    const { position = [0, 0, 0], desiredDiameter, orbitRadius, orbitSpeed, name, targetName } = options;
    loader.load(url, function (gltf) {
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());

        // Calculate the current diameter (assuming the model is roughly spherical)
        const currentDiameter = Math.max(size.x, size.y, size.z);

        // Calculate the scale factor
        const scaleFactor = desiredDiameter / currentDiameter;

        // Apply the scale factor
        model.scale.set(scaleFactor, scaleFactor, scaleFactor);

        // Store initial position
        model.position.set(...position);

        // Store orbit properties
        model.userData.orbitRadius = orbitRadius + (desiredDiameter / 2); // Adjust orbit radius based on planet size
        model.userData.orbitSpeed = orbitSpeed;
        model.userData.targetName = targetName; // Store the target name to grab its position later
        model.name = name;
        model.userData.name = name;

        // Add the model to the scene
        scene.add(model);

        // Add the model to the array for animation
        models.push(model);
    }, undefined, function (error) {
        console.error(error);
    });
}

export function loadModels() {
    // Loading the Sun
    modelLoader('models/sun/scene.gltf', {
        position: [0, 0, 0],
        desiredDiameter: 500,
        name: 'Sun'
    });

    // Loading Mercury
    modelLoader('models/mercury/mercury.gltf', {
        position: [340, 0, 0],
        desiredDiameter: 1.52,
        orbitRadius: 340,
        orbitSpeed: 0,
        name: 'Mercury',
        targetName: 'Sun' // Orbit around the Sun
    });

    // Loading Venus
    modelLoader('models/venus/venus.gltf', {
        position: [435, 0, 0],
        desiredDiameter: 4.32,
        orbitRadius: 435,
        orbitSpeed: 0,
        name: 'Venus',
        targetName: 'Sun'
    });

    // Loading Earth
    modelLoader('models/earth/earth.gltf', {
        position: [520, 0, 0],
        desiredDiameter: 4.55,
        orbitRadius: 520,
        orbitSpeed: 0,
        name: 'Earth',
        targetName: 'Sun'
    });

    // Loading Mars
    modelLoader('models/mars/mars.gltf', {
        position: [580, 0, 0],
        desiredDiameter: 2.28,
        orbitRadius: 580,
        orbitSpeed: 0,
        name: 'Mars',
        targetName: 'Sun'
    });

    // Loading Jupiter
    modelLoader('models/jupiter/jupiter.gltf', {
        position: [655, 0, 0],
        desiredDiameter: 50,
        orbitRadius: 655,
        orbitSpeed: 0,
        name: 'Jupiter',
        targetName: 'Sun'
    });

    // Loading Saturn
    modelLoader('models/saturn/saturn.gltf', {
        position: [738, 0, 0],
        desiredDiameter: 40.9,
        orbitRadius: 738,
        orbitSpeed: 0,
        name: 'Saturn',
        targetName: 'Sun'
    });

    // Loading Uranus
    modelLoader('models/uranus/scene.gltf', {
        position: [815, 0, 0],
        desiredDiameter: 18.2,
        orbitRadius: 815,
        orbitSpeed: 0,
        name: 'Uranus',
        targetName: 'Sun'
    });

    // Loading Neptune
    modelLoader('models/neptune/neptune.gltf', {
        position: [875, 0, 0],
        desiredDiameter: 10.7,
        orbitRadius: 875,
        orbitSpeed: 0,
        name: 'Neptune',
        targetName: 'Sun'
    });

    // Loading the Moon (Earth's Moon)
    modelLoader('models/moon/moon.gltf', {
        position: [525, 0, 0],
        desiredDiameter: 1.14,
        orbitRadius: 5, // Adjust relative to Earth
        orbitSpeed: 1,
        name: 'Moon',
        targetName: 'Earth' // Orbit around Earth
    });

    // Loading Pluto
    modelLoader('models/pluto/scene.gltf', {
        position: [935, 0, 0],
        desiredDiameter: 0.9,
        orbitRadius: 935,
        orbitSpeed: 0.8,
        name: 'Pluto',
        targetName: 'Sun'
    });
}