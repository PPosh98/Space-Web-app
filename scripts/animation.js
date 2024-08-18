import * as THREE from 'three';
import { renderer, scene, camera } from './scene.js';
import { updateControls } from './controls.js';
import { models } from './loader.js';
import { stars } from './loader.js';
import { clickedModel, diameter, updateModelPositions, nullifyclickedModel } from './loader.js'


export function animation() {
    renderer.setAnimationLoop(animate)
}

function animate() {
    updateControls()
    orbit()
    animateStars()
    updateModelPositions()
    if (cameraFollowEnabled === true) {
        cameraFollow();
    }
    showProperties()

    renderer.render(scene, camera)
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
        const targetPosition = clickedModel.userData.position;
        console.log(targetPosition)
        camera.position.set(
            targetPosition.x + diameter,
            targetPosition.y + diameter / 2,
            targetPosition.z + diameter
        );
        camera.lookAt(...targetPosition);
    }
}

function toggleCameraFollow(event) {
    if (event.key === 't') { // Change 't' to any key you prefer
        cameraFollowEnabled = !cameraFollowEnabled;
        if (!cameraFollowEnabled) {
            nullifyclickedModel()
        }
        console.log('Camera follow enabled:', cameraFollowEnabled);
        // Hide the properties element when camera follow is disabled
        const propertiesElement = document.getElementById('planet-properties');
        if (!cameraFollowEnabled) {
            propertiesElement.style.display = 'none';
        }
        cameraFollowEnabled = !cameraFollowEnabled;
    }

}

document.addEventListener('keydown', toggleCameraFollow);

function showProperties() {
    if (clickedModel != null && cameraFollowEnabled) {
        let objectName = clickedModel.userData.name;
        let objectRadius = clickedModel.userData.orbitRadius;
        let objectSpeed = clickedModel.userData.orbitSpeed;
        let objectPosition = clickedModel.userData.position;
        console.log(objectPosition)
        const propertiesElement = document.getElementById('planet-properties');
        propertiesElement.innerHTML = `
        <p> Name: ${objectName} </p>
        <p> Orbit Radius: ${objectRadius} </p>
        <p> Orbit Speed: ${objectSpeed} </p>
        <p> Position: ${objectPosition.x.toFixed(2)}, ${objectPosition.y.toFixed(2)}, ${objectPosition.z.toFixed(2)} </p>
        `;
        // propertiesElement.style.display = 'none'; // Show the properties box
    }
}

document.addEventListener('click', updatePropertiesPosition);

function updatePropertiesPosition(event) {
    if (clickedModel != null && cameraFollowEnabled) {
        const objectPosition = clickedModel.userData.position;
        const propertiesElement = document.getElementById('planet-properties');

        // Convert 3D position to 2D screen position
        const vector = new THREE.Vector3(objectPosition.x, objectPosition.y, objectPosition.z);
        vector.project(camera);

        const widthHalf = window.innerWidth / 2;
        const heightHalf = window.innerHeight / 2;

        const x = (vector.x * widthHalf) + widthHalf;
        const y = -(vector.y * heightHalf) + heightHalf;

        propertiesElement.style.left = `${x - 10}px`; // Adjust position slightly to the right
        propertiesElement.style.top = `${y}px`;
        propertiesElement.style.display = 'block'
    }
}




