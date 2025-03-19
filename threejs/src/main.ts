import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Sun } from './classes/Sun';
import { Planet } from './classes/Planet';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

document.querySelector<HTMLDivElement>('#app')!.innerHTML = '';
document.querySelector<HTMLDivElement>('#app')!.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

camera.position.set(0, 10, 30);
controls.update();

const ambientLight = new THREE.AmbientLight("white", 0.5);
scene.add(ambientLight);

const sun = new Sun(5, 0xffff00, 0.003)
  .setScene(scene)
  .create()
  .createLight(1.5)
  .rotate();

const celestialBodies: (Sun | Planet)[] = [sun];

const mercury = new Planet(0.8, 0x8a8a8a, 0.01, 8, 0.15)
  .setScene(scene)
  .create()
  .createOrbit()
  .startOrbiting()
  .rotate();
celestialBodies.push(mercury);

const venus = new Planet(1.2, 0xe39e1c, 0.005, 11, 0.10)
  .setScene(scene)
  .create()
  .createOrbit()
  .startOrbiting()
  .rotate();
celestialBodies.push(venus);

const earth = new Planet(1.5, 0x3498db, 0.01, 14, 0.08)
  .setScene(scene)
  .create()
  .createOrbit()
  .startOrbiting()
  .rotate();
celestialBodies.push(earth);

const mars = new Planet(1.0, 0xc0392b, 0.008, 17, 0.06)
  .setScene(scene)
  .create()
  .createOrbit()
  .startOrbiting()
  .rotate();
celestialBodies.push(mars);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);
  
  celestialBodies.forEach(body => body.update());
  
  controls.update();
  renderer.render(scene, camera);
}

animate();
