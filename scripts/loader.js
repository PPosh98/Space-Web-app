import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { scene, camera } from './scene.js'; // Assuming you have camera and renderer exported from your scene module

const loader = new GLTFLoader();
export const models = []; // Array to store loaded models for animation
export let stars;
export let clickedModel = null;
export let diameter = 0;

const raycaster = new THREE.Raycaster();

function onMouseClick() {
    // Set raycaster from the camera's position and direction
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);

    // Calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(models, true);

    // console.log(intersects)

    if (intersects.length > 0) {
        clickedModel = intersects[0].object;
        // Get the bounding box of the clicked model
        const boundingBox = new THREE.Box3().setFromObject(clickedModel);
        const size = boundingBox.getSize(new THREE.Vector3());
        diameter = Math.max(size.x, size.y, size.z);
        camera.position.set(clickedModel.userData.position[0] + diameter, clickedModel.userData.position[1] + diameter / 2, clickedModel.userData.position[2] + diameter)
        camera.lookAt(...clickedModel.userData.position);
        // Perform any action here, e.g., show details, highlight, etc.
    }
}

export function nullifyclickedModel() {
    clickedModel = null;
}

function loadModel(url, options = {}) {
    const { position = [0, 0, 0], desiredDiameter, orbitRadius = 0, orbitSpeed = 0, name, targetName = 'none' } = options;

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

            model.traverse((child) => {
                child.userData = { ...child.userData, position, orbitRadius, orbitSpeed, targetName, name, desiredDiameter };
                child.name = name;  // Set the name on all meshes

            });

            // model.userData = {
            //     orbitRadius: orbitRadius + desiredDiameter / 2,
            //     orbitSpeed,
            //     targetName,
            //     name,
            // };

            // model.name = name;

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

function loadPlanetaryModels() {
    const planets = [
        { url: 'models/sun/scene.gltf', options: { position: [0, 0, 0], desiredDiameter: 500, name: 'Sun' } },
        { url: 'models/mercury/mercury.gltf', options: { position: [340, 0, 0], desiredDiameter: 1.52, orbitRadius: 340, orbitSpeed: 0, name: 'Mercury', targetName: 'Sun' } },
        { url: 'models/venus/venus.gltf', options: { position: [435, 0, 0], desiredDiameter: 4.32, orbitRadius: 435, orbitSpeed: 0, name: 'Venus', targetName: 'Sun' } },
        { url: 'models/earth/earth.gltf', options: { position: [520, 0, 0], desiredDiameter: 4.55, orbitRadius: 520, orbitSpeed: 0, name: 'Earth', targetName: 'Sun' } },
        { url: 'models/mars/mars.gltf', options: { position: [580, 0, 0], desiredDiameter: 2.28, orbitRadius: 580, orbitSpeed: 0, name: 'Mars', targetName: 'Sun' } },
        { url: 'models/jupiter/jupiter.gltf', options: { position: [655, 0, 0], desiredDiameter: 50, orbitRadius: 655, orbitSpeed: 0.1, name: 'Jupiter', targetName: 'Sun' } },
        { url: 'models/saturn/saturn.gltf', options: { position: [738, 0, 0], desiredDiameter: 40.9, orbitRadius: 738, orbitSpeed: 0, name: 'Saturn', targetName: 'Sun' } },
        { url: 'models/uranus/scene.gltf', options: { position: [815, 0, 0], desiredDiameter: 18.2, orbitRadius: 815, orbitSpeed: 0, name: 'Uranus', targetName: 'Sun' } },
        { url: 'models/neptune/neptune.gltf', options: { position: [875, 0, 0], desiredDiameter: 10.7, orbitRadius: 875, orbitSpeed: 0, name: 'Neptune', targetName: 'Sun' } },
        { url: 'models/moon/moon.gltf', options: { position: [525, 0, 0], desiredDiameter: 1.14, orbitRadius: 5, orbitSpeed: 5, name: 'Moon', targetName: 'Earth' } },
        { url: 'models/pluto/scene.gltf', options: { position: [935, 0, 0], desiredDiameter: 0.9, orbitRadius: 935, orbitSpeed: 0, name: 'Pluto', targetName: 'Sun' } },
    ];

    planets.forEach(({ url, options }) => loadModel(url, options));
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
    loadPlanetaryModels();
    stars = createStars();
}

window.addEventListener('click', onMouseClick, false);
