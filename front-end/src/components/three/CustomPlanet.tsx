import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Planet from './Planet';
import OrbitLine from './OrbitLine';
import { DataTexture, RGBAFormat, UnsignedByteType, RepeatWrapping } from 'three';
import { Noise } from 'noisejs';

type CustomPlanetProps = {
  seed: number;
  planetSize: number;
  orbitRadius: number;
  axialTilt: number;
  orbitSpeed: number;
  waterThreshold: number;
  showRings: boolean;
  colorMode: 'terrain' | 'gaseous';
  gasType: 'ammonia' | 'methane';
  planetName: string;
};

const AnimatedOrbit: React.FC<{ radius: number; speed: number; children: React.ReactNode }> = ({ radius, speed, children }) => {
  const groupRef = useRef<THREE.Group>(null!);
  useFrame((_, delta) => {
    groupRef.current.rotation.y += delta * speed;
  });
  return (
    <group ref={groupRef}>
      <group position={[radius, 0, 0]}>
        {children}
      </group>
    </group>
  );
};

const CustomPlanet: React.FC<CustomPlanetProps> = ({
  seed,
  planetSize,
  orbitRadius,
  axialTilt,
  orbitSpeed,
  waterThreshold,
  showRings,
  colorMode,
  gasType,
  planetName
}) => {
  const [texture, setTexture] = useState<DataTexture>();

  useEffect(() => {
    const noise = new Noise(seed);
    const dimension = 256;
    const pixelCount = dimension * dimension;
    const buffer = new Uint8Array(4 * pixelCount);

    for (let i = 0; i < pixelCount; i++) {
      const u = (i % dimension) / dimension;
      const v = Math.floor(i / dimension) / dimension;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      const x = Math.cos(theta) * Math.sin(phi);
      const y = Math.cos(phi);
      const z = Math.sin(theta) * Math.sin(phi);
      const scale = colorMode === 'gaseous' ? [2, 10, 2] : [2, 2, 2];
      const noiseVal = (noise.perlin3(x * scale[0], y * scale[1], z * scale[2]) + 1) / 2;

      let r: number, g: number, b: number;

      if (colorMode === 'terrain') {
        if (noiseVal < waterThreshold) {
          [r, g, b] = [0, 0, 1];
        } else {
          [r, g, b] = [0.13, 0.55, 0.13];
        }
      } else {
        if (gasType === 'ammonia') {
          if (noiseVal < 0.15) {
            [r, g, b] = [0.6, 0.4, 0.2];
          } else if (noiseVal < 0.3) {
            [r, g, b] = [0.8, 0.6, 0.3];
          } else if (noiseVal < 0.6) {
            [r, g, b] = [0.5, 0.3, 0.1];
          } else if (noiseVal < 0.85) {
            [r, g, b] = [0.9, 0.7, 0.4];
          } else {
            [r, g, b] = [1.0, 0.9, 0.6];
          }
        } else {
          if (noiseVal < 0.2) {
            [r, g, b] = [0.1, 0.2, 0.4];
          } else if (noiseVal < 0.4) {
            [r, g, b] = [0.3, 0.4, 0.8];
          } else if (noiseVal < 0.6) {
            [r, g, b] = [0.6, 0.8, 1.0];
          } else if (noiseVal < 0.8) {
            [r, g, b] = [0.85, 0.9, 1.0];
          } else {
            [r, g, b] = [1.0, 1.0, 1.0];
          }
        }
      }

      const idx = i * 4;
      buffer[idx] = Math.round(r * 255);
      buffer[idx + 1] = Math.round(g * 255);
      buffer[idx + 2] = Math.round(b * 255);
      buffer[idx + 3] = 255;
    }

    const tex = new DataTexture(buffer, dimension, dimension, RGBAFormat, UnsignedByteType);
    tex.wrapS = tex.wrapT = RepeatWrapping;
    tex.needsUpdate = true;
    setTexture(tex);
  }, [seed, colorMode, waterThreshold, gasType]);

  const ORBIT_SCALE = 5;
  const SPEED_SCALE = 0.5;

  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <hemisphereLight skyColor={0xffffff} groundColor={0x444444} intensity={0.4} />
      <directionalLight position={[5, 10, 7.5]} intensity={1} />
      <OrbitControls enablePan={false} />

      <AnimatedOrbit radius={orbitRadius * ORBIT_SCALE} speed={orbitSpeed * SPEED_SCALE}>
        <Planet
          info={planetName}
          size={planetSize}
          texture={texture}
          planetTilt={axialTilt}
          hasRings={showRings}
        />
      </AnimatedOrbit>

      <OrbitLine radius={orbitRadius * ORBIT_SCALE} />
    </Canvas>
  );
};

export default CustomPlanet;
