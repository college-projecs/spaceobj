import * as THREE from 'three';
import { BaseBody } from './BaseBody';

export class Sun extends BaseBody {
  private light: THREE.PointLight | null = null;
  private emissiveIntensity: number = 1;
  private lightIntensity: number = 1.5;

  constructor(
    radius?: number,
    color?: number,
    rotationSpeed?: number,
  ) {
    super(radius, color, rotationSpeed);
  }
  
  create(): this {
    this.geometry = new THREE.SphereGeometry(this.radius, 32, 32);
    this.material  = new THREE.MeshLambertMaterial({
      color: this.color,
      emissive: this.color,
      emissiveIntensity: this.emissiveIntensity
    });
    
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    if (this.scene) this.scene.add(this.mesh);
    return this;
  }
  
  createLight(intensity?: number): this {
    if (this.light) {
        if (this.scene) this.scene.remove(this.light);
    }
    
    this.light = new THREE.PointLight(this.color, intensity ?? this.lightIntensity, 100);
    this.light.position.set(0, 0, 0);
    if (this.scene) this.scene.add(this.light);
    return this;
  }
  
  getEmissiveIntensity(): number {
    return this.emissiveIntensity;
  }
  
  setBrightness(intensity: number): this {
    this.emissiveIntensity = intensity;
    if (this.mesh) {
      (this.mesh.material as THREE.MeshLambertMaterial).emissiveIntensity = intensity;
      (this.mesh.material as THREE.MeshLambertMaterial).needsUpdate = true;
    }
    if (this.light) {
      this.light.intensity = this.lightIntensity * intensity;
    }
    
    return this;
    // mes
  }
}
