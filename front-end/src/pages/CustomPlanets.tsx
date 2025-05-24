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

/* AnimatedOrbitProps and AnimatedOrbit are tools from the planets component
that keep updating the visuals and allow for the radius and speed to update 
as the sliders change them around. We had to change rotation to y axis here
since x axis rotation in planets is parallel with the x axis and that means
they are indistinguishable from regular rotation.
*/
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
/* CustomPlanets is the main visual element of this page (we could have made
this a component in hindsight). 

First, we define the ranges of the sliders (realisticValues)
that work well with the display page on the site

Next, we define the parameters that define a custom planet as a list of constants.
The useStates define some default value that is uploaded when you first open the page.
We generate a new seed parameter using Math.random().

The createPlanetTexture function is what allows us to procedurally generate the planet
textual. It takes in whether the planet is a gas or earth-type and also takes in
the waterThreshold for earth-type planets. 

  First a Uint8Array array stores a large set of values corresponding to each pixel
  on the texture (hence, it is sized dimensionxdimension).

  Next we iterate through this array in a for loop that uses mod(dimension) to
  define rows and coluumns in the 1D array. 
  
    Each pixel is given assigned a value in cartesian coordinates using its position in spherical coordinates. 
    
      Spherical coordinates use theta to determine horizontal rotation and phi to define vertical
      rotation, and, with some Calc III, can be used to convert that into an x,y,z value. If we
      want to make streaks for a gaseous planet the y values are multiplied by 10
      which is similar to a horizontal dilation that stretches patches of color. 
    
    Every single coordinate is given some value through the Noise() random number generator. 
    A switch is used to differentiate between earth-type and gas-type color logic: assigns a
    color to the Uint8Array pixel in that position. The colors were hard coded for the different
    atmosphere types, and green and blue for land and water. For some reason the buffer array,
    which stores all the (R,G,B values) inside the for loop, could not be used to wrap our texture.

    Finally this U8intArray is wrapped around the planet object and its visuals are updated.


*/
export default function CustomPlanets() {
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

  /*
  savePlanet is a post function that allows for the parameters of a custom planet to be 
  sent to the backend through a JSON, similar to the example we worked in class (save message
  was added too).
  */ 
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

  /*
  This is the live component of the website that displays all of the components.
  */ 
  return (
    <div>
      <Header />
      <Hero />

      <section className="intro custom-section">
        <div className="intro-container">
          <div className="custom-content">
            {/*/ custom-controls holds the sidebar with all the sliders*/}
            <aside className="custom-controls">
              <label>
                <span>Name</span> // Updating the name of the planet.
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
                {/* 
                Switching between earth-style and gaseous planets. 
                I was familiar with sliders at the time 
                but this could have been a dropdown as well.
                */}
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
                {/* 
                Setting the size of the planet 
                The custom-range class is used throughout the numerical
                parmaeters to display the realistic values of the planet 
                parameters in astronomical units without
                actually changing the visual size.
                */}
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
                {/* 
                Setting the orbit size of the planet
                */}
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
                {/* 
                Setting the axial tilt of the planet, which
                is more apparent when rings are turned on.
                */}
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
                {/* 
                Setting the orbital speed of the planet.
                */}
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
                {/* 
                If the user chooses terrain (earth-style graphics),
                then they can set the water threshold which controls
                the createPlanetTexture output.
                */}
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
                {/* 
                The user can choose to have rings on their planet.
                */}
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
                {/* 
                Displays the seed. This was useful for testing
                during save function since it gave a unique
                corresponding value between our front-end and 
                postgreSQL database
                */}
              <div className="seed-display">
                <strong>Seed:</strong>{' '}
                {seed.toFixed(6)}
              </div>
                {/* 
                Resets the seed and reruns the texture generation.
                */}
              <button
                className="btn regenerate-btn"
                onClick={() => {
                  setSeed(Math.random());
                  createPlanetTexture();
                }}
              >
                Re-generate Texture
              </button>
                {/* 
                Runs the POST function for the backend.
                */}
              <button
                className="btn save-btn"
                onClick={savePlanet}
              >
                Save Planet
              </button>
            </aside>
                {/* 
                This configures the black background arround the planet
                in the canvas container, along with the shading, orbit and radius.

                The radius and speed defined by the user are scaled down
                by the display values so they aren't too big.
                */}
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