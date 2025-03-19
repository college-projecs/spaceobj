import * as THREE from 'three';
import { gsap } from 'gsap';
import { BaseBody } from './BaseBody';

export class Planet extends BaseBody {
  private orbitLine: THREE.Mesh | null = null;
  private orbitAngle: number = 0;
  
  constructor(
    radius?: number,
    color?: number,
    rotationSpeed?: number,
    private orbitRadius: number = 10,
    private orbitSpeed: number = 0.01
  ) {
    super(radius, color, rotationSpeed);
  }
  
  create(): this {
    this.geometry = new THREE.SphereGeometry(this.radius, 32, 16);
    this.material = new THREE.MeshStandardMaterial({ color: this.color });
    
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.x = this.orbitRadius;
    
    if (this.scene) this.scene.add(this.mesh);
    return this;
  }
  
  createOrbit(): this {
    if (this.orbitLine && this.scene) {
        this.scene.remove(this.orbitLine);
    }
    
    const orbitGeometry = new THREE.RingGeometry(
      this.orbitRadius - 0.02, 
      this.orbitRadius + 0.02, 
      128
    );
    
    const orbitMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      opacity: 0.2,
      transparent: true
    });
    
    this.orbitLine = new THREE.Mesh(orbitGeometry, orbitMaterial);
    this.orbitLine.rotation.x = Math.PI / 2;
    if (this.scene) this.scene.add(this.orbitLine);
    return this;
  }
  
  getOrbitRadius(): number {
    return this.orbitRadius;
  }
  
  setOrbitRadius(radius: number): this {
    this.orbitRadius = radius;
    this.createOrbit();
    return this;
  }
  
  getOrbitSpeed(): number {
    return this.orbitSpeed;
  }
  
  setOrbitSpeed(speed: number): this {
    this.orbitSpeed = speed;
    return this;
  }
  
  startOrbiting(): this {
    this.orbitAngle = Math.random() * Math.PI * 2; // Random start position
    return this;
  }
  
  update(): this {
    if (!this.mesh) return this;
    
    this.orbitAngle += this.orbitSpeed * 0.01;
    
    this.mesh.position.x = Math.cos(this.orbitAngle) * this.orbitRadius;
    this.mesh.position.z = Math.sin(this.orbitAngle) * this.orbitRadius;
    
    return this;
  }
  
  rotate(): this {
    if (this.mesh) {
      const tilt = Math.random() * 0.5;
      this.mesh.rotation.x = tilt;
      
      gsap.to(this.mesh.rotation, {
        y: `+=${Math.PI * 2}`,
        duration: 10 / this.rotationSpeed,
        ease: "linear",
        repeat: -1
      });
    }
    return this;
  }
}
