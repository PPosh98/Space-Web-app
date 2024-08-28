import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { scene, camera } from './scene.js';
import { setCameraFollowEnabled } from './camera.js';
import { controls, getMousePosition } from './controls.js';
import { openSidebar } from './properties.js';
import { onPointerMove } from './interactions.js';

const loader = new GLTFLoader();
export const models = []; // Array to store loaded models for animation
export let stars;
export let clickedModel = null;
export let diameter = 0;
let planetaryObjects = [
    { url: 'models/sun/scene.gltf', options: { id: 0, position: [0, 0, 0], desiredDiameter: 500, name: 'Sun' } },
    { url: 'models/mercury/mercury.gltf', options: { id: 1, position: [340, 0, 0], desiredDiameter: 1.52, orbitRadius: 340, orbitSpeed: 0, name: 'Mercury', targetName: 'Sun' } },
    { url: 'models/venus/venus.gltf', options: { id: 2, position: [435, 0, 0], desiredDiameter: 4.32, orbitRadius: 435, orbitSpeed: 0, name: 'Venus', targetName: 'Sun' } },
    { url: 'models/earth/earth.gltf', options: { id: 3, position: [520, 0, 0], desiredDiameter: 4.55, orbitRadius: 520, orbitSpeed: 0, name: 'Earth', targetName: 'Sun' } },
    { url: 'models/mars/mars.gltf', options: { id: 4, position: [580, 0, 0], desiredDiameter: 2.28, orbitRadius: 580, orbitSpeed: 0, name: 'Mars', targetName: 'Sun' } },
    { url: 'models/jupiter/jupiter.gltf', options: { id: 5, position: [655, 0, 0], rotation: [1, 1, 1], desiredDiameter: 50, orbitRadius: 655, orbitSpeed: 1, name: 'Jupiter', targetName: 'Sun' } },
    { url: 'models/saturn/saturn.gltf', options: { id: 6, position: [738, 0, 0], desiredDiameter: 40.9, orbitRadius: 738, orbitSpeed: 0, name: 'Saturn', targetName: 'Sun' } },
    { url: 'models/uranus/scene.gltf', options: { id: 7, position: [815, 0, 0], desiredDiameter: 18.2, orbitRadius: 815, orbitSpeed: 0, name: 'Uranus', targetName: 'Sun' } },
    { url: 'models/neptune/neptune.gltf', options: { id: 8, position: [875, 0, 0], desiredDiameter: 10.7, orbitRadius: 875, orbitSpeed: 0, name: 'Neptune', targetName: 'Sun' } },
    { url: 'models/moon/moon.gltf', options: { id: 9, position: [525, 0, 0], desiredDiameter: 1.14, orbitRadius: 5, orbitSpeed: 5, name: 'Moon', targetName: 'Earth' } },
    { url: 'models/pluto/scene.gltf', options: { id: 10, position: [935, 0, 0], desiredDiameter: 0.9, orbitRadius: 935, orbitSpeed: 0, name: 'Pluto', targetName: 'Sun' } },
];

const raycaster = new THREE.Raycaster();

export function onMouseClick() {
    // Set raycaster from the camera's position and direction
    raycaster.setFromCamera(getMousePosition(), camera);

    // Calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(models, true);
    if (intersects.length > 0) {
        clickedModel = intersects[0].object;
        document.getElementById('crosshair').style.display = 'none';
        document.removeEventListener("pointermove", onPointerMove)
        openSidebar();
        document.getElementById('planet-name-container').style.display = 'none';
        controls.unlock();

        // Get the bounding box of the clicked model
        const boundingBox = new THREE.Box3().setFromObject(clickedModel);
        const size = boundingBox.getSize(new THREE.Vector3());
        diameter = Math.max(size.x, size.y, size.z);
        setCameraFollowEnabled(true)
    }
}

function loadModel(url, options = {}) {
    const { id = 0, position = [0, 0, 0], rotation = [0, 0, 0], desiredDiameter = 0, orbitRadius = 0, orbitSpeed = 0, name = "", targetName = 'none' } = options;

    loader.load(
        url,
        (gltf) => {
            const model = gltf.scene;
            const box = new THREE.Box3().setFromObject(model);
            const size = box.getSize(new THREE.Vector3());

            const currentDiameter = Math.max(size.x, size.y, size.z);
            const scaleFactor = desiredDiameter / currentDiameter;

            model.scale.set(scaleFactor, scaleFactor, scaleFactor);
            model.position.set(...position);
            model.rotation.set(...rotation);

            model.traverse((child) => {
                child.userData = { ...child.userData, id, position, orbitRadius, orbitSpeed, targetName, name, desiredDiameter, currentDiameter, scaleFactor, rotation };
            });

            scene.add(model);
            models.push(model);

        },
        undefined,
        (error) => {
            console.error(`Error loading model ${name}:`, error);
        }
    );
}

export function updateModelPositions() {
    models.forEach((model) => {
        model.traverse((child) => {
            const worldPosition = new THREE.Vector3();
            child.getWorldPosition(worldPosition);
            child.userData.position = worldPosition;
        });
    });
}

function loadPlanetaryModels(planetaryModels) {
    planetaryModels.forEach(({ url, options }) => loadModel(url, options));
}

function createStars() {
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });

    const starVertices = [];
    for (let i = 0; i < 10000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 5000;
        starVertices.push(x, y, z);
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    return stars;
}

export function loadModels() {
    // Load the initial scene state if available
    const savedState = localStorage.getItem('sceneState');
    const data = JSON.parse(savedState).objects;
    updatePlanetaryModels(data)
    loadPlanetaryModels(planetaryObjects)
    stars = createStars();
}

function updatePlanetaryModels(data) {
    planetaryObjects = planetaryObjects.map(model => {
        const matchedData = data.find(item => item.id === model.options.id);
        if (matchedData) {
            return {
                ...model,
                options: {
                    id: matchedData.id,
                    position: [matchedData.position.x, matchedData.position.y, matchedData.position.z],
                    rotation: matchedData.rotation || [0, 0, 0],
                    orbitRadius: matchedData.orbitRadius,
                    orbitSpeed: matchedData.orbitSpeed,
                    desiredDiameter: matchedData.size,
                    name: matchedData.name,
                    targetName: matchedData.orbiting
                }
            };
        } else {
            return model;
        }
    });
}


