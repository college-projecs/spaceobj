import * as THREE from 'three';
import { gsap } from 'gsap';

export class BaseBody {
  protected mesh: THREE.Mesh | null = null;
  protected geometry: THREE.BufferGeometry | null = null;
  protected material: THREE.Material | null = null;
  protected scene: THREE.Scene | null = null;
  
  constructor(
    protected radius: number = 1,
    protected color: number = 0xffffff,
    protected rotationSpeed: number = 0.01
  ) {}
  
  setScene(scene: THREE.Scene): this {
    this.scene = scene;
    if (this.mesh && !this.mesh.parent) {
      scene.add(this.mesh);
    }
    return this;
  }
  
  create(): this {
    return this;
  }
  
  getMesh(): THREE.Mesh | null {
    return this.mesh;
  }
  
  getRadius(): number {
    return this.radius;
  }
  
  getRotationSpeed(): number {
    return this.rotationSpeed;
  }
  
  setSize(radius: number): this {
    this.radius = radius;
    if (this.mesh && this.scene) {
      this.scene.remove(this.mesh);
      this.create();
    }
    return this;
  }
  
  setRotationSpeed(speed: number): this {
    this.rotationSpeed = speed;
    if (this.mesh) {
      gsap.killTweensOf(this.mesh.rotation);
      this.rotate();
    }
    return this;
  }
  
  rotate(): this {
    if (this.mesh) {
      gsap.to(this.mesh.rotation, {
        y: `+=${Math.PI * 2}`,
        duration: 10 / this.rotationSpeed,
        ease: "linear",
        repeat: -1
      });
    }
    return this;
  }
  
  update(): this {
    return this;
  }
}
