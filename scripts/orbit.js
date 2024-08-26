import { models } from './loader.js';
import { stars } from './loader.js';
import { clickedModel } from './loader.js';

export function animateStars() {
    stars.rotation.x += 0.000015;
    stars.rotation.y += 0.000015;
    stars.rotation.z += 0.000015;
}

export function orbit() {
    models.forEach(model => {
        // Compare the names of clickedModel and the current model
        if (clickedModel && clickedModel.userData.name === model.userData.name) {
            // Update model's userData properties based on clickedModel's userData
            model.userData.orbitRadius = clickedModel.userData.orbitRadius;
            model.userData.orbitSpeed = clickedModel.userData.orbitSpeed;
            model.userData.name = clickedModel.userData.name; // Update the name too if needed
            model.userData.targetName = clickedModel.userData.targetName;

            console.log(`Updated ${model.userData.name}: 
                Orbit Radius = ${model.userData.orbitRadius}, 
                Orbit Speed = ${model.userData.orbitSpeed}
            `);
        }

        const orbitRadius = model.userData.orbitRadius;
        const orbitSpeed = model.userData.orbitSpeed;
        const targetName = model.userData.targetName;

        const target = models.find(m => m.userData.name === targetName);

        if (target) {
            const targetPosition = target.position;

            // Calculate the new position
            const time = Date.now() * 0.0001 * orbitSpeed;
            model.position.x = targetPosition.x + orbitRadius * Math.cos(time);
            model.position.z = targetPosition.z + orbitRadius * Math.sin(time);
        }
        //Apply rotation to the model based on userData.rotation
        let loopRotation = model.userData.rotation;
        model.rotation.x += loopRotation[0] * 0.001
        model.rotation.y += loopRotation[1] * 0.001
        model.rotation.z += loopRotation[2] * 0.001


    });
}



