import { useState, useEffect } from "react";
import solarSystemData from "../components/three/solarSystemData.json";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Planet from "../components/three/Planet";
import { Suspense } from "react";
import { Header } from "./Homepage";
import { Hero } from "./Homepage";
import { Footer } from "./Homepage";
import {
  DataTexture,
  RGBAFormat,
  UnsignedByteType,
  RepeatWrapping,
} from "three";
import { Noise } from "noisejs";

const AU_IN_KM = 149_597_870.7;
function auToKm(au: number): string {
  return (au * AU_IN_KM).toExponential(2);   // e.g. “1.50e+08”
}

type CustomPlanetData = {
  name: string;
  seed: number;
  planet_size: number;
  orbit_radius: number;
  axial_tilt: number;
  orbit_speed: number;
  water_threshold: number;
  show_rings: boolean;
  color_mode: "terrain" | "gaseous";
  gas_type: "methane" | "ammonia";
};

type PlanetOption = {
  type: "basic" | "custom";
  name: string;
  data: any;
};

function createPlanetTexture(data: CustomPlanetData) {
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
    const scale = data.color_mode === "gaseous" ? [2, 10, 2] : [2, 2, 2];
    const noiseVal =
      (noise.perlin3(x * scale[0], y * scale[1], z * scale[2]) + 1) / 2;

    let r: number, g: number, b: number;
    if (data.color_mode === "terrain") {
      if (noiseVal < data.water_threshold) [r, g, b] = [0, 0, 1];
      else [r, g, b] = [0.13, 0.55, 0.13];
    } else {
      if (data.gas_type === "ammonia") {
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
  return tex;
}

export default function ComparePage() {
  const [customPlanets, setCustomPlanets] = useState<CustomPlanetData[]>([]);
  const [customTextures, setCustomTextures] = useState<Record<string, DataTexture>>({});

  useEffect(() => {
    fetch("http://127.0.0.1:8000/Create_planet/")
      .then((res) => res.json())
      .then((data) => {
        setCustomPlanets(data);
        const textures: Record<string, DataTexture> = {};
        data.forEach((planet: CustomPlanetData) => {
          textures[planet.name] = createPlanetTexture(planet);
        });
        setCustomTextures(textures);
      })
      .catch(console.error);
  }, []);

  const planetOptions: PlanetOption[] = [
    ...solarSystemData.map((p) => ({
      type: "basic" as const,
      name: p.name,
      data: p,
    })),
    ...customPlanets.map((p) => ({
      type: "custom" as const,
      name: p.name,
      data: p,
    })),
  ];

  const [firstPlanetName, setFirstPlanetName] = useState<string>(planetOptions[0]?.name || "");
  const [secondPlanetName, setSecondPlanetName] = useState<string>(planetOptions[1]?.name || planetOptions[0]?.name || "");

  const firstPlanetOption = planetOptions.find((p) => p.name === firstPlanetName);
  const secondPlanetOption = planetOptions.find((p) => p.name === secondPlanetName);

  if (!firstPlanetOption || !secondPlanetOption) throw new Error("Planet not found");

  function renderInfoTable(planet: PlanetOption) {
    if (planet.type === "basic") {
      return (
        <table style={{ color: "white", fontSize: "1em", borderSpacing: 4 }}>
          <tbody>
            {Object.entries(planet.data.info).map(([key, value]) => (
              <tr key={key}>
                <td style={{ fontWeight: "bold", paddingRight: 8 }}>
                  {key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}:
                </td>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    } else {

      const d = planet.data as CustomPlanetData;
      return (
        <table style={{ color: "white", fontSize: "1em", borderSpacing: 4 }}>
          <tbody>
            <tr>
              <td style={{ fontWeight: "bold", paddingRight: 8 }}>Name:</td>
              <td>{d.name}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: "bold", paddingRight: 8 }}>Diameter:</td>
              <td>{(d.planet_size * 7926.2).toFixed(1)} mi</td>
            </tr>
            <tr>
              <td style={{ fontWeight: "bold", paddingRight: 8 }}>Orbit Speed:</td>
              <td>{d.orbit_speed} AU/day</td>
            </tr>
            <tr>
              <td style={{ fontWeight: "bold", paddingRight: 8 }}>Axial Tilt:</td>
              <td>{d.axial_tilt}º</td>
            </tr>
            <tr>
              <td style={{ fontWeight: "bold", paddingRight: 8 }}>Type:</td>
              <td>{d.color_mode === "terrain" ? "Terrestrial" : "Gaseous"}</td>
            </tr>
            {d.color_mode === "gaseous" && (
              <tr>
                <td style={{ fontWeight: "bold", paddingRight: 8 }}>Gas Type:</td>
                <td>{d.gas_type}</td>
              </tr>
            )}
            {d.color_mode === "terrain" && (
              <tr>
                <td style={{ fontWeight: "bold", paddingRight: 8 }}>Water Threshold:</td>
                <td>{d.water_threshold}</td>
              </tr>
            )}
            <tr>
              <td style={{ fontWeight: "bold", paddingRight: 8 }}>Rings:</td>
              <td>{d.show_rings ? "Yes" : "No"}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: "bold", paddingRight: 8 }}>Distance&nbsp;from&nbsp;Sun:</td>
              <td>{auToKm(d.orbit_radius)}&nbsp;km</td>
            </tr>
            {planet.data.orbitRadius && (
              <tr>
                <td style={{ fontWeight: "bold", paddingRight: 8 }}>Distance&nbsp;from&nbsp;Sun:</td>
                <td>{auToKm(planet.data.orbitRadius)}&nbsp;km</td>
              </tr>
            )}
          </tbody>
        </table>
      );
    }
  }
  function renderPlanet(planet: PlanetOption) {
    if (planet.type === "basic") {
      const p = planet.data;
      return (
        <Planet
          position={[0, 0, 0]}
          size={p.size}
          color={p.color}
          planetTilt={p.planetTilt}
          texture={p.texture}
          hasRings={p.hasRings}
          ringColor={p.ringColor}
          ringInnerRadius={p.ringInnerRadius}
          ringOuterRadius={p.ringOuterRadius}
          ringTilt={p.ringTilt}
          orbitSpeed={0}
          info={
            Object.entries(p.info)
              .map(([key, value]) => `${key}: ${value}`)
              .join('\n')
          }
        />
      );
    } else {
      const p = planet.data as CustomPlanetData;
      return (
        <Planet
          position={[0, 0, 0]}
          size={p.planet_size}
          texture={customTextures[p.name]}
          planetTilt={p.axial_tilt}
          hasRings={p.show_rings}
          orbitSpeed={0}
          info={
            p.name + "\n" +
            "Diameter: " + (p.planet_size * 7926.2).toFixed(1) + " mi\n" +
            "Distance_from_sun: " + p.orbit_radius + " AU\n" +
            "OrbitSpeed: " + p.orbit_speed + " AU/day\n" +
            "AxialTilt: " + p.axial_tilt + "º"
          }
        />
      );
    }
  }

  return (
    <div>
      <Header />
      <Hero />

      <section className="intro compare-section">
        <div className="intro-container">
          <h2>compare planets</h2>
          <div className="compare-controls">
            <label htmlFor="first-planet">
              <span>first planet</span>
              <select
                id="first-planet"
                value={firstPlanetName}
                onChange={(e) => setFirstPlanetName(e.target.value)}
              >
                {planetOptions.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name} {p.type === "custom" ? "(custom)" : ""}
                  </option>
                ))}
              </select>
            </label>
            <label htmlFor="second-planet">
              <span>second planet</span>
              <select
                id="second-planet"
                value={secondPlanetName}
                onChange={(e) => setSecondPlanetName(e.target.value)}
              >
                {planetOptions.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name} {p.type === "custom" ? "(custom)" : ""}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </section>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          marginTop: "20px",
          height: "auto",
          minHeight: "400px",
          gap: "20px",
        }}
      >
        <div
          style={{
            position: "relative",
            flex: "1 1 400px",
            minWidth: "320px",
            maxWidth: "100%",
            height: "60vh",
            minHeight: "320px",
          }}
        >
          <Canvas style={{ background: "#000", width: "100%", height: "100%" }}>
            <Suspense fallback={null}>
              <ambientLight intensity={0.3} />
              <directionalLight position={[5, 5, 5]} intensity={1} />
              <pointLight position={[-5, -5, 5]} intensity={0.5} />
              <OrbitControls />
              {renderPlanet(firstPlanetOption)}
            </Suspense>
          </Canvas>
          <div
            style={{
              position: "absolute",
              bottom: "10px",
              left: "10px",
              background: "rgba(0,0,0,0.5)",
              padding: "10px",
              borderRadius: "8px",
              whiteSpace: "pre-wrap",
              fontFamily: "monospace",
              maxWidth: "90%",
              overflowX: "auto",
            }}
          >
            {renderInfoTable(firstPlanetOption)}
          </div>
        </div>

        <div
          style={{
            position: "relative",
            flex: "1 1 400px",
            minWidth: "320px",
            maxWidth: "100%",
            height: "60vh",
            minHeight: "320px",
          }}
        >
          <Canvas style={{ background: "#000", width: "100%", height: "100%" }}>
            <Suspense fallback={null}>
              <ambientLight intensity={0.3} />
              <directionalLight position={[5, 5, 5]} intensity={1} />
              <pointLight position={[-5, -5, 5]} intensity={0.5} />
              <OrbitControls />
              {renderPlanet(secondPlanetOption)}
            </Suspense>
          </Canvas>
          <div
            style={{
              position: "absolute",
              bottom: "10px",
              right: "10px",
              background: "rgba(0,0,0,0.5)",
              padding: "10px",
              borderRadius: "8px",
              whiteSpace: "pre-wrap",
              fontFamily: "monospace",
              maxWidth: "90%",
              overflowX: "auto",
              textAlign: "right",
            }}
          >
            {renderInfoTable(secondPlanetOption)}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
