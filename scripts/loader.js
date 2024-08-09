import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { scene } from './scene.js';

const loader = new GLTFLoader();

function modelLoader(url, options = {}) {
    const { scale = [1, 1, 1], position = [0, 0, 0] } = options;
    loader.load(url, function (gltf) {
        gltf.scene.scale.set(...scale);
        gltf.scene.position.set(...position);
        scene.add(gltf.scene);
    }, undefined, function (error) {
        console.error(error);
    });
}
export function loadModels() {
    console.log('Hello')
    //Loading sun
    modelLoader('models/sun/scene.gltf', {
        scale: [5, 5, 5],
        position: [0, 0, 0]
    });
    //Loading Mercury
    modelLoader('models/mercury/mercury.gltf', {
        scale: [0.1, 0.1, 0.1],
        position: [120, 0, 0]
    });
    //Loading Venus
    modelLoader('models/venus/venus.gltf', {
        scale: [0.25, 0.25, 0.25],
        position: [200, 0, 0]
    })
    //Loading Earth
    modelLoader('models/earth/earth.gltf', {
        scale: [0.1, 0.1, 0.1],
        position: [280, 0, 0]
    })
    //Loading Mars
    modelLoader('models/mars/mars.gltf', {
        scale: [0.1, 0.1, 0.1],
        position: [330, 0, 0]
    })
    //Loaded Jupiter
    modelLoader('models/jupiter/jupiter.gltf', {
        scale: [0.1, 0.1, 0.1],
        position: [400, 0, 0]
    })
}
