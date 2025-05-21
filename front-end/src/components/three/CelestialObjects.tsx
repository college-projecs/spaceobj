import React from 'react';
import * as THREE from 'three';

export abstract class CelestialBody extends React.Component<{ position?: THREE.Vector3 }> {
  position: THREE.Vector3;
  constructor(props: any) {
    super(props);
    this.position = props.position || new THREE.Vector3(0, 0, 0);
  }
  abstract update(): void;
}
