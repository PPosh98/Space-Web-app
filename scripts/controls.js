import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { camera } from './scene.js';
import { onMouseClick } from './loader.js';

export let controls;

export function initControls() {
    controls = new PointerLockControls(camera, document.body);

    document.addEventListener('click', (event) => {
        // Check if the click was on the Three.js canvas element
        console.log(event.target.tagName.toLowerCase())
        if (event.target.tagName.toLowerCase() === 'canvas') {
            console.log("hello")
            controls.lock();
        }
        onMouseClick();
    });

    controls.addEventListener('lock', () => {
        document.getElementById('crosshair').style.display = 'block';
    });

    controls.addEventListener('unlock', () => {
        document.getElementById('crosshair').style.display = 'none';
    });

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
}

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let moveUp = false;
let moveDown = false;
let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();
const clock = new THREE.Clock();

function onKeyDown(event) {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moveForward = true;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = true;
            break;
        case 'ArrowDown':
        case 'KeyS':
            moveBackward = true;
            break;
        case 'ArrowRight':
        case 'KeyD':
            moveRight = true;
            break;
        case 'Space':
            moveUp = true;
            break;
        case 'ControlLeft':
            moveDown = true;
            break;
    }
}

function onKeyUp(event) {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moveForward = false;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = false;
            break;
        case 'ArrowDown':
        case 'KeyS':
            moveBackward = false;
            break;
        case 'ArrowRight':
        case 'KeyD':
            moveRight = false;
            break;
        case 'Space':
            moveUp = false;
            break;
        case 'ControlLeft':
            moveDown = false;
            break;
    }
}

export function updateControls() {
    if (controls.isLocked) {
        const delta = clock.getDelta();
        velocity.x -= velocity.x * 1.0 * delta;
        velocity.y -= velocity.y * 1.0 * delta;
        velocity.z -= velocity.z * 1.0 * delta;

        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.y = Number(moveUp) - Number(moveDown);
        direction.normalize();

        if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;
        if (moveUp || moveDown) velocity.y -= direction.y * 400.0 * delta;

        controls.moveRight(-velocity.x * delta);
        controls.getObject().position.y -= velocity.y * delta;
        controls.moveForward(-velocity.z * delta);
    }
}

export function getMousePosition() {
    let mouse
    if (controls.isLocked) {
        mouse = new THREE.Vector2(0, 0)
    }
    else {
        mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }
    return mouse
}