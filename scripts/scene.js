import * as THREE from 'three';
import { animate } from './animation.js';

export const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);

export const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);
scene.add(directionalLight);

camera.position.z = 50;

export function initScene() {
    // Any additional scene setup can go here
}