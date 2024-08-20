import * as THREE from 'three';
import { renderer, scene, camera } from './scene.js';
import { updateControls } from './controls.js';
import { models } from './loader.js';
import { stars } from './loader.js';
import { clickedModel, diameter, updateModelPositions, nullifyclickedModel } from './loader.js';

const propertiesElement = document.getElementById('planet-properties');
const information = document.getElementById('information')
const sidebar = document.getElementById('sidebar')
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(0, 0); // Center of the screen

export function animation() {
    renderer.setAnimationLoop(animate);
}

function animate() {
    updateControls();
    orbit();
    animateStars();
    updateModelPositions();
    if (cameraFollowEnabled === true) {
        cameraFollow();
    }
    renderer.render(scene, camera);
}

function animateStars() {
    stars.rotation.x += 0.000015;
    stars.rotation.y += 0.000015;
    stars.rotation.z += 0.000015;
}

function orbit() {
    models.forEach(model => {
        const orbitRadius = model.userData.orbitRadius;
        const orbitSpeed = model.userData.orbitSpeed;
        const targetName = model.userData.targetName;

        const target = models.find(m => m.name == targetName);

        if (target) {
            const targetPosition = target.position;

            // Calculate the new position
            const time = Date.now() * 0.001 * orbitSpeed;
            model.position.x = targetPosition.x + orbitRadius * Math.cos(time);
            model.position.z = targetPosition.z + orbitRadius * Math.sin(time);
        }
    });
}

let cameraFollowEnabled = true;
function cameraFollow() {
    if (clickedModel != null && cameraFollowEnabled) {
        openSidebar();
        const targetPosition = clickedModel.userData.position;
        camera.position.set(
            targetPosition.x + diameter,
            targetPosition.y + diameter / 2,
            targetPosition.z + diameter
        );
        camera.lookAt(...targetPosition);

        propertiesElement.style.display = 'none';
    }
}

function toggleCameraFollow(event) {
    if (event.key === 't') { // Change 't' to any key you prefer
        sidebar.style.width = "0px";
        cameraFollowEnabled = !cameraFollowEnabled;
        if (!cameraFollowEnabled) {
            nullifyclickedModel();
        }
        console.log('Camera follow enabled:', cameraFollowEnabled);
        // Hide the properties element when camera follow is disabled
        if (!cameraFollowEnabled) {
            propertiesElement.style.display = 'none';
        }
        cameraFollowEnabled = !cameraFollowEnabled;
    }
}

document.addEventListener('keydown', toggleCameraFollow);

function showProperties(model, mode) {
    if (model != null) {
        const objectName = model.userData.name;
        const objectRadius = model.userData.orbitRadius;
        const objectSpeed = model.userData.orbitSpeed;
        const objectTargetName = model.userData.targetName;
        const objectSize = model.userData.desiredDiameter
        const objectPosition = model.userData.position;
        const fixedPosition = objectPosition.toArray().map(value => value.toFixed(2));
        let propertiesHTML = `<p> Name: ${objectName} </p>`;
        if (mode === 'simple') {
            propertiesElement.innerHTML = propertiesHTML;
            propertiesElement.style.display = 'block'; // Show the properties box
        }
        if (mode === 'complex') {
            propertiesHTML = `
                    <p> Name: ${objectName} </p>
                    <p> Orbit Radius: ${objectRadius} </p>
                    <p> Orbit Speed: ${objectSpeed} </p>
                    <p> Position: ${fixedPosition} </p>
                    <p> Orbiting: ${objectTargetName} </p>
                    <p> Size: ${objectSize}k km </p>`
            information.innerHTML = propertiesHTML;
        }
    }
}




function updatePropertiesPosition(model) {
    if (model != null) {
        const objectPosition = model.userData.position
        // Convert 3D position to 2D screen position
        const vector = new THREE.Vector3(objectPosition.x, objectPosition.y, objectPosition.z);
        vector.project(camera);

        const widthHalf = window.innerWidth / 2;
        const heightHalf = window.innerHeight / 2;

        const x = (vector.x * widthHalf) + widthHalf;
        const y = -(vector.y * heightHalf) + heightHalf;

        propertiesElement.style.left = `${x - 10}px`; // Adjust position slightly to the right
        propertiesElement.style.top = `${y}px`;
        propertiesElement.style.display = 'block';
    }
}

function onPointerMove(event) {
    // Update the raycaster with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Calculate objects intersecting the raycaster
    const intersects = raycaster.intersectObjects(models);

    if (intersects.length > 0) {
        const hoveredModel = intersects[0].object;
        showProperties(hoveredModel, 'simple');
        updatePropertiesPosition(hoveredModel); // Update the position of the properties box
    } else {
        propertiesElement.style.display = 'none'; // Hide the properties box if no object is hovered
    }
}

function openSidebar() {
    sidebar.style.width = "250px";
    showProperties(clickedModel, 'complex')

}

document.addEventListener('pointermove', onPointerMove);
