import * as THREE from 'three';
import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Planet from '../components/three/Planet';
import OrbitLine from '../components/three/OrbitLine';
import { DataTexture, RGBAFormat, UnsignedByteType, RepeatWrapping } from 'three';
import Noise from 'noisejs';

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const hue2rgb = (p: number, q: number, t: number): number => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * ((2 / 3) - t) * 6;
    return p;
  };

  if (s === 0) {
    // Achromatic (gray)
    return [l, l, l];
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = hue2rgb(p, q, h + 1 / 3);
  const g = hue2rgb(p, q, h);
  const b = hue2rgb(p, q, h - 1 / 3);
  return [r, g, b];
}

type AnimatedOrbitProps = { radius: number; speed: number; children: React.ReactNode };
function AnimatedOrbit({ radius, speed, children }: AnimatedOrbitProps) {
  const groupRef = useRef<THREE.Group>(null!);
  // Rotate around Y-axis every frame
  useFrame((_, delta) => {
    groupRef.current.rotation.y += delta * speed;
  });

  return (
    <group ref={groupRef}>
      {/* Offset planet from center by "radius" */}
      <group position={[radius, 0, 0] as [number, number, number]}>  
        {children}
      </group>
    </group>
  );
}

export default function CustomPlanets() {
  // --- Planet settings ---
  const [planetSize, setPlanetSize] = useState(1);
  const [orbitRadius, setOrbitRadius] = useState(5);
  const [axialTilt, setAxialTilt] = useState(23);
  const [orbitSpeed, setOrbitSpeed] = useState(0.5);
  const [waterThreshold, setWaterThreshold] = useState(0.5);
  const [showRings, setShowRings] = useState(false);
  const [mode, setMode] = useState<'terrain' | 'freaky'>('terrain');
  const [texture, setTexture] = useState<DataTexture>();

  // Re-generate texture whenever mode or water threshold changes
  useEffect(() => {
    createPlanetTexture();
  }, [mode, waterThreshold]);

  function createPlanetTexture() {
    const noise = new Noise(Math.random());
    const dimension = 128;  // smaller for faster generation
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

      // Sample noise in 3D space for smooth variation
      const noiseVal = (noise.perlin3(x * 2, y * 2, z * 2) + 1) / 2;
      let r: number, g: number, b: number;

      if (mode === 'terrain') {
        // Blue for water, green for land
        if (noiseVal < waterThreshold) {
          [r, g, b] = [0, 0, 1];
        } else {
          [r, g, b] = [0.13, 0.55, 0.13]; // forest green
        }
      } else {
        // Colorful rainbow by mapping noise to hue
        [r, g, b] = hslToRgb(noiseVal, 1, 0.5);
      }

      const idx = i * 4;
      buffer[idx]   = Math.round(r * 255);
      buffer[idx+1] = Math.round(g * 255);
      buffer[idx+2] = Math.round(b * 255);
      buffer[idx+3] = 255;
    }

    const tex = new DataTexture(buffer, dimension, dimension, RGBAFormat, UnsignedByteType);
    tex.wrapS = tex.wrapT = RepeatWrapping;
    tex.needsUpdate = true;
    setTexture(tex);
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Control panel */}
      <aside style={{ width: 260, padding: 16, color: '#eee', overflowY: 'auto' }}>
        <h2>Planet Settings</h2>

        <div>
          <label>Mode:</label><br/>
          <select value={mode} onChange={e => setMode(e.target.value as any)}>
            <option value="terrain">Terrain</option>
            <option value="freaky">Freaky</option>
          </select>
        </div>

        <div>
          <label>Size: {planetSize.toFixed(1)}</label><br/>
          <input type="range" min={0.5} max={3} step={0.1}
            value={planetSize}
            onChange={e => setPlanetSize(+e.target.value)}
          />
        </div>

        <div>
          <label>Orbit Radius: {orbitRadius}</label><br/>
          <input type="range" min={2} max={10} step={0.5}
            value={orbitRadius}
            onChange={e => setOrbitRadius(+e.target.value)}
          />
        </div>

        <div>
          <label>Axial Tilt: {axialTilt}°</label><br/>
          <input type="range" min={0} max={90} step={1}
            value={axialTilt}
            onChange={e => setAxialTilt(+e.target.value)}
          />
        </div>

        <div>
          <label>Orbit Speed: {orbitSpeed.toFixed(2)}</label><br/>
          <input type="range" min={0.1} max={2} step={0.1}
            value={orbitSpeed}
            onChange={e => setOrbitSpeed(+e.target.value)}
          />
        </div>

        {mode === 'terrain' && (
          <div>
            <label>Water Level: {waterThreshold.toFixed(2)}</label><br/>
            <input type="range" min={0} max={1} step={0.01}
              value={waterThreshold}
              onChange={e => setWaterThreshold(+e.target.value)}
            />
          </div>
        )}

        <div>
          <label>
            <input type="checkbox"
              checked={showRings}
              onChange={e => setShowRings(e.target.checked)}
            /> Show Rings
          </label>
        </div>

        <button onClick={createPlanetTexture} style={{ marginTop: 12 }}>Re-generate Texture</button>
      </aside>

      {/* 3D View */}
      <main style={{ flexGrow: 1 }}>
        <Canvas>
          <ambientLight intensity={0.5} />
          <hemisphereLight args={[0xffffff, 0x444444, 0.4]} />
          <directionalLight position={[5, 10, 7.5]} intensity={1} />

          <OrbitControls enablePan={false} />

          <AnimatedOrbit radius={orbitRadius} speed={orbitSpeed}>
            <Planet
              size={planetSize}
              texture={texture}
              planetTilt={axialTilt}
              hasRings={showRings}
              info={"place holder"}
            />
          </AnimatedOrbit>

          <OrbitLine radius={orbitRadius} />
        </Canvas>
      </main>
    </div>
  );
}
