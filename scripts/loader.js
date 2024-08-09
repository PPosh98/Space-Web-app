import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { scene } from './scene.js';

const loader = new GLTFLoader();
let currentDiameter;
function modelLoader(url, options = {}) {
    const { position = [0, 0, 0], desiredDiameter, orbitRadius = 0, orbitSpeed = 0 } = options;
    loader.load(url, function (gltf) {
        const model = gltf.scene
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        // Calculate the current diameter (assuming the model is roughly spherical)
        const currentDiameter = Math.max(size.x, size.y, size.z)
        // Calculate the scale factor
        const scaleFactor = desiredDiameter / currentDiameter;
        // Apply the scale factor
        model.scale.set(scaleFactor, scaleFactor, scaleFactor);
        model.position.set(...position);
        scene.add(model);
        // store orbit properties
        model.userData.orbitRadius = orbitRadius;
        model.userData.orbitSpeed = orbitSpeed;
        console.log(model.userData)
    }, undefined, function (error) {
        console.error(error);
    });
}
export function loadModels() {
    //Loading sun
    modelLoader('models/sun/scene.gltf', {
        position: [0, 0, 0],
        desiredDiameter: 500,
    });
    //Loading Mercury
    modelLoader('models/mercury/mercury.gltf', {
        position: [340, 0, 0],
        desiredDiameter: 1.52,
        orbitRadius: 340,
        orbitSpeed: 5
    });
    //Loading Venus
    modelLoader('models/venus/venus.gltf', {
        position: [435, 0, 0],
        desiredDiameter: 4.32
    })
    //Loading Earth
    modelLoader('models/earth/earth.gltf', {
        position: [520, 0, 0],
        desiredDiameter: 4.55
    })
    //Loading Mars
    modelLoader('models/mars/mars.gltf', {
        position: [580, 0, 0],
        desiredDiameter: 2.28
    })
    //Loaded Jupiter
    modelLoader('models/jupiter/jupiter.gltf', {
        position: [655, 0, 0],
        desiredDiameter: 50
    })
    //Loaded Saturn
    modelLoader('models/saturn/saturn.gltf', {
        position: [738, 0, 0],
        desiredDiameter: 40.9
    })
    //loaded Uranus
    modelLoader('models/uranus/scene.gltf', {
        position: [815, 0, 0],
        desiredDiameter: 18.2
    })
    //loaded Neptune
    modelLoader('models/neptune/neptune.gltf', {
        position: [875, 0, 0],
        desiredDiameter: 10.7
    })
    //loaded Moon
    modelLoader('models/moon/moon.gltf', {
        position: [525, 0, 0],
        desiredDiameter: 1.14
    })
    //loaded Pluto
    modelLoader('models/pluto/scene.gltf', {
        position: [935, 0, 0],
        desiredDiameter: 0.9
    })
}
