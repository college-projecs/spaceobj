// src/pages/CustomPlanets.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Planet from '../components/three/Planet';
import OrbitLine from '../components/three/OrbitLine';
import {
  DataTexture,
  RGBAFormat,
  UnsignedByteType,
  RepeatWrapping,
} from 'three';
import { Noise } from 'noisejs';
import { Header } from './Homepage';
import { Hero } from './Homepage';
import { Footer } from './Homepage';

type AnimatedOrbitProps = {
  radius: number;
  speed: number;
  children: React.ReactNode;
};
function AnimatedOrbit({
  radius,
  speed,
  children,
}: AnimatedOrbitProps) {
  const groupRef = useRef<THREE.Group>(null!);
  useFrame((_, delta) => {
    groupRef.current.rotation.y += delta * speed;
  });
  return (
    <group ref={groupRef}>
      <group position={[radius, 0, 0] as [number, number, number]}>
        {children}
      </group>
    </group>
  );
}

export default function CustomPlanets() {
  // realistic ranges
  const realisticValues = {
    orbitRadius: { min: 0.1, max: 5, scale: 5 },
    orbitSpeed: { min: 0.01, max: 5, scale: 0.5 },
    planetSize: { min: 0.1, max: 5, scale: 1 },
  };

  const [planetSize, setPlanetSize] = useState(1);
  const [orbitRadius, setOrbitRadius] = useState(0.01);
  const [axialTilt, setAxialTilt] = useState(23);
  const [orbitSpeed, setOrbitSpeed] = useState(0.5);
  const [waterThreshold, setWaterThreshold] = useState(0.5);
  const [showRings, setShowRings] = useState(false);
  const [colorMode, setColorMode] = useState<'terrain' | 'gaseous'>(
    'terrain'
  );
  const [gasType, setGasType] = useState<'ammonia' | 'methane'>(
    'methane'
  );
  const [texture, setTexture] = useState<DataTexture>();
  const [seed, setSeed] = useState(Math.random());
  const [planetName, setPlanetName] = useState('');

  useEffect(() => {
    createPlanetTexture();
  }, [colorMode, waterThreshold, gasType]);

  function createPlanetTexture() {
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
      const scale =
        colorMode === 'gaseous'
          ? [2, 10, 2]
          : [2, 2, 2];
      const noiseVal =
        (noise.perlin3(
          x * scale[0],
          y * scale[1],
          z * scale[2]
        ) +
          1) /
        2;
      let r: number, g: number, b: number;
      if (colorMode === 'terrain') {
        if (noiseVal < waterThreshold) {
          [r, g, b] = [0, 0, 1];
        } else {
          [r, g, b] = [0.13, 0.55, 0.13];
        }
      } else {
        if (gasType === 'ammonia') {
          if (noiseVal < 0.15) [r, g, b] = [0.6, 0.4, 0.2];
          else if (noiseVal < 0.3) [r, g, b] = [0.8, 0.6, 0.3];
          else if (noiseVal < 0.6) [r, g, b] = [0.5, 0.3, 0.1];
          else if (noiseVal < 0.85) [r, g, b] = [0.9, 0.7, 0.4];
          else [r, g, b] = [1.0, 0.9, 0.6];
        } else {
          if (noiseVal < 0.2) [r, g, b] = [0.1, 0.2, 0.4];
          else if (noiseVal < 0.4) [r, g, b] = [0.3, 0.4, 0.8];
          else if (noiseVal < 0.6) [r, g, b] = [0.6, 0.8, 1.0];
          else if (noiseVal < 0.8) [r, g, b] = [0.85, 0.9, 1.0];
          else [r, g, b] = [1.0, 1.0, 1.0];
        }
      }
      const addr = i * 4;
      buffer[addr] = Math.round(r * 255);
      buffer[addr + 1] = Math.round(g * 255);
      buffer[addr + 2] = Math.round(b * 255);
      buffer[addr + 3] = 255;
    }
    const tex = new DataTexture(
      buffer,
      dimension,
      dimension,
      RGBAFormat,
      UnsignedByteType
    );
    tex.wrapS = tex.wrapT = RepeatWrapping;
    tex.needsUpdate = true;
    setTexture(tex);
  }

  function savePlanet() {
    fetch('http://127.0.0.1:8000/Create_planet/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: planetName,
        seed,
        planet_size: planetSize,
        orbit_radius: orbitRadius,
        axial_tilt: axialTilt,
        orbit_speed: orbitSpeed,
        water_threshold: waterThreshold,
        show_rings: showRings,
        color_mode: colorMode,
        gas_type: gasType,
      }),
    }).then(() => alert('planet saved!'));
  }

  return (
    <div>
      <Header />
      <Hero />

      <section className="intro custom-section">
        <div className="intro-container">
          <div className="custom-content">
            <aside className="custom-controls">
              <label>
                <span>Name</span>
                <input
                  type="text"
                  className="custom-input"
                  value={planetName}
                  onChange={(e) =>
                    setPlanetName(e.target.value)
                  }
                />
              </label>

              <label>
                <span>Mode</span>
                <select
                  className="custom-select"
                  value={colorMode}
                  onChange={(e) =>
                    setColorMode(
                      e.target.value as any
                    )
                  }
                >
                  <option value="terrain">
                    Earth Type
                  </option>
                  <option value="gaseous">
                    Gaseous
                  </option>
                </select>
              </label>

              {colorMode === 'gaseous' && (
                <label>
                  <span>
                    Gas Composition:
                    {gasType === 'methane'
                      ? ' Methane (Blue-White)'
                      : ' Ammonia (Orange-Brown)'}
                  </span>
                  <input
                    type="range"
                    className="custom-range"
                    min={0}
                    max={1}
                    step={1}
                    value={
                      gasType === 'methane' ? 0 : 1
                    }
                    onChange={(e) =>
                      setGasType(
                        e.target.value === '0'
                          ? 'methane'
                          : 'ammonia'
                      )
                    }
                  />
                </label>
              )}

              <label>
                <span>
                  Size: {planetSize.toFixed(1)}×
                </span>
                <input
                  type="range"
                  className="custom-range"
                  min={realisticValues.planetSize.min}
                  max={realisticValues.planetSize.max}
                  step={0.1}
                  value={planetSize}
                  onChange={(e) =>
                    setPlanetSize(+e.target.value)
                  }
                />
              </label>

              <label>
                <span>
                  Orbit Radius:{' '}
                  {orbitRadius.toFixed(1)} AU
                </span>
                <input
                  type="range"
                  className="custom-range"
                  min={
                    realisticValues.orbitRadius.min
                  }
                  max={
                    realisticValues.orbitRadius.max
                  }
                  step={0.1}
                  value={orbitRadius}
                  onChange={(e) =>
                    setOrbitRadius(+e.target.value)
                  }
                />
              </label>

              <label>
                <span>Axial Tilt: {axialTilt}°</span>
                <input
                  type="range"
                  className="custom-range"
                  min={0}
                  max={90}
                  step={1}
                  value={axialTilt}
                  onChange={(e) =>
                    setAxialTilt(+e.target.value)
                  }
                />
              </label>

              <label>
                <span>
                  Orbit Speed:{' '}
                  {orbitSpeed.toFixed(2)} AU/day
                </span>
                <input
                  type="range"
                  className="custom-range"
                  min={
                    realisticValues.orbitSpeed.min
                  }
                  max={
                    realisticValues.orbitSpeed.max
                  }
                  step={0.01}
                  value={orbitSpeed}
                  onChange={(e) =>
                    setOrbitSpeed(+e.target.value)
                  }
                />
              </label>

              {colorMode === 'terrain' && (
                <label>
                  <span>
                    Water Level:{' '}
                    {waterThreshold.toFixed(2)}
                  </span>
                  <input
                    type="range"
                    className="custom-range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={waterThreshold}
                    onChange={(e) =>
                      setWaterThreshold(
                        +e.target.value
                      )
                    }
                  />
                </label>
              )}

              <label>
                <input
                  type="checkbox"
                  className="custom-checkbox"
                  checked={showRings}
                  onChange={(e) =>
                    setShowRings(e.target.checked)
                  }
                />{' '}
                Show Rings
              </label>

              <div className="seed-display">
                <strong>Seed:</strong>{' '}
                {seed.toFixed(6)}
              </div>

              <button
                className="btn regenerate-btn"
                onClick={() => {
                  setSeed(Math.random());
                  createPlanetTexture();
                }}
              >
                Re-generate Texture
              </button>

              <button
                className="btn save-btn"
                onClick={savePlanet}
              >
                Save Planet
              </button>
            </aside>

            <div className="canvas-container">
              <Canvas>
                <ambientLight intensity={0.5} />
                <hemisphereLight
                  skyColor={0xffffff}
                  groundColor={0x444444}
                  intensity={0.4}
                />
                <directionalLight
                  position={[5, 10, 7.5]}
                  intensity={1}
                />
                <OrbitControls enablePan={false} />
                <AnimatedOrbit
                  radius={
                    orbitRadius *
                    realisticValues.orbitRadius.scale
                  }
                  speed={
                    orbitSpeed *
                    realisticValues.orbitSpeed.scale
                  }
                >
                  <Planet
                    size={planetSize}
                    texture={texture}
                    planetTilt={axialTilt}
                    hasRings={showRings}
                    info={planetName + "\n"+
                      "Diameter: "+(planetSize*7926.2).toString() + " mi\n"+
                      "OrbitSize: "+orbitRadius.toString()+" AU" + "\n"+
                      "OrbitSpeed: "+orbitSpeed.toString()+ "AU/day"+"\n"+
                      "AxialTilt: "+axialTilt.toString() + "º"}
                  />
                </AnimatedOrbit>
                <OrbitLine
                  radius={
                    orbitRadius *
                    realisticValues.orbitRadius.scale
                  }
                />
              </Canvas>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
);
}