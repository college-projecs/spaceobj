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

type PlanetData = {
  name: string;
  seed: number;
  planet_size: number;
  orbit_radius: number;
  axial_tilt: number;
  orbit_speed: number;
  water_threshold: number;
  show_rings: boolean;
  color_mode: 'terrain' | 'gaseous';
  gas_type: 'methane' | 'ammonia';
};

type AnimatedOrbitProps = {
  radius: number;
  speed: number;
  children: React.ReactNode;
};

function AnimatedOrbit({ radius, speed, children }: AnimatedOrbitProps) {
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
  const realisticValues = {
    orbitRadius: { scale: 5 },
    orbitSpeed: { scale: 0.5 },
  };

  const [planets, setPlanets] = useState<PlanetData[]>([]);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [texture, setTexture] = useState<DataTexture>();

  useEffect(() => {
    fetch('http://127.0.0.1:8000/Create_planet/')
      .then((res) => res.json())
      .then((data) => setPlanets(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedPlanet) createPlanetTexture(selectedPlanet);
  }, [selectedPlanet]);

  function createPlanetTexture(data: PlanetData) {
    const noise = new Noise(data.seed);
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
      const scale = data.color_mode === 'gaseous' ? [2, 10, 2] : [2, 2, 2];
      const noiseVal = (noise.perlin3(x * scale[0], y * scale[1], z * scale[2]) + 1) / 2;

      let r: number, g: number, b: number;
      if (data.color_mode === 'terrain') {
        if (noiseVal < data.water_threshold) [r, g, b] = [0, 0, 1];
        else [r, g, b] = [0.13, 0.55, 0.13];
      } else {
        if (data.gas_type === 'ammonia') {
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

    const tex = new DataTexture(buffer, dimension, dimension, RGBAFormat, UnsignedByteType);
    tex.wrapS = tex.wrapT = RepeatWrapping;
    tex.needsUpdate = true;
    setTexture(tex);
  }

  return (
    <div>
      <Header />
      <Hero />
      <section className="intro custom-section">
        <div className="intro-container">
          <div className="custom-content">
            <aside className="custom-controls">
              <h2>Saved Planets</h2>
              {planets.length === 0 ? (
                <p>Loading planets...</p>
              ) : (
                planets.map((planet) => (
                  <button
                    key={planet.name}
                    className="btn select-btn"
                    onClick={() => setSelectedPlanet(planet)}
                  >
                    {planet.name}
                  </button>
                ))
              )}
            </aside>
            <div className="canvas-container">
              <Canvas>
                <ambientLight intensity={0.5} />
                <hemisphereLight skyColor={0xffffff} groundColor={0x444444} intensity={0.4} />
                <directionalLight position={[5, 10, 7.5]} intensity={1} />
                <OrbitControls enablePan={false} />
                {selectedPlanet && texture && (
                  <>
                    <AnimatedOrbit
                      radius={selectedPlanet.orbit_radius * realisticValues.orbitRadius.scale}
                      speed={selectedPlanet.orbit_speed * realisticValues.orbitSpeed.scale}
                    >
                      <Planet
                        size={selectedPlanet.planet_size}
                        texture={texture}
                        planetTilt={selectedPlanet.axial_tilt}
                        hasRings={selectedPlanet.show_rings}
                        info={selectedPlanet.name + "\n"+
                            "Diameter: "+(selectedPlanet.planet_size*7926.2).toString() + " mi\n"+
                            "OrbitSize: "+selectedPlanet.orbit_radius.toString()+" AU" + "\n"+
                            "OrbitSpeed: "+selectedPlanet.orbit_speed.toString()+ "AU/day"+"\n"+
                            "AxialTilt: "+selectedPlanet.axial_tilt.toString() + "º"}
                      />
                    </AnimatedOrbit>
                    <OrbitLine
                      radius={selectedPlanet.orbit_radius * realisticValues.orbitRadius.scale}
                    />
                  </>
                )}
              </Canvas>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
