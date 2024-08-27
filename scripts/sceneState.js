export const state = {
    objects: []
};

export function saveSceneState(models) {
    console.log("Saving state...");
    console.log(models);

    models.forEach(model => {
        const newObject = {
            id: model.userData.id,
            name: model.userData.name,
            orbiting: model.userData.targetName,
            position: model.userData.position.clone(),
            rotation: [...model.userData.rotation],
            orbitRadius: model.userData.orbitRadius,
            orbitSpeed: model.userData.orbitSpeed,
            size: model.userData.desiredDiameter
        };
    
        const existingIndex = state.objects.findIndex(obj => obj.id === newObject.id);
    
        if (existingIndex !== -1) {
            state.objects[existingIndex] = newObject;
        } else {
            state.objects.push(newObject);
        }
        console.log(state.objects)
    });
    return JSON.stringify(state);
}
