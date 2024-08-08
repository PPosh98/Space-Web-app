import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const properties_sidebar = document.getElementById("properties-sidebar");
const navbar_title = document.getElementById("navbar-title");
const close_btn = document.getElementById("closebtn");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );
scene.add( directionalLight );

const loader = new GLTFLoader();

loader.load( 'models/sun/scene.gltf', function ( gltf ) {

	scene.add( gltf.scene );

}, undefined, function ( error ) {

	console.error( error );

} );

camera.position.z = 50;

function animate() {
	renderer.render( scene, camera );
}

navbar_title.addEventListener("click", openNav);
close_btn.addEventListener("click", closeNav);

function openNav() {
    properties_sidebar.style.width = "250px";
}

function closeNav() {
    properties_sidebar.style.width = "0px";
}