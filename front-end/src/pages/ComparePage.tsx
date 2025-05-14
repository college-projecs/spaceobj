import { useState } from "react";
import solarSystemData from "../components/three/solarSystemData.json";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Planet from "../components/three/Planet";
import { Suspense } from "react";
import { Header } from "./Homepage";
import { Hero } from "./Homepage";
import { Footer } from "./Homepage";

export default function ComparePage() {
  const [firstPlanetName, setFirstPlanetName] = useState(
    solarSystemData[0].name
  );
  const [secondPlanetName, setSecondPlanetName] = useState(
    solarSystemData[1]?.name || solarSystemData[0].name
  );
  const firstPlanet = solarSystemData.find((p) => p.name === firstPlanetName);
  const secondPlanet = solarSystemData.find((p) => p.name === secondPlanetName);

  if (!firstPlanet || !secondPlanet) throw new Error("Planet not found");

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
                {solarSystemData.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name}
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
                {solarSystemData.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name}
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
              <Planet
                position={[0, 0, 0]}
                size={firstPlanet.size}
                color={firstPlanet.color}
                planetTilt={firstPlanet.planetTilt}
                texture={firstPlanet.texture}
                hasRings={firstPlanet.hasRings}
                ringColor={firstPlanet.ringColor}
                ringInnerRadius={firstPlanet.ringInnerRadius}
                ringOuterRadius={firstPlanet.ringOuterRadius}
                ringTilt={firstPlanet.ringTilt}
                orbitSpeed={0}
                info={
                  Object.entries(firstPlanet.info)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join('\n')
                }
              />
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
            {
              <table
                style={{ color: "white", fontSize: "1em", borderSpacing: 4 }}
              >
                <tbody>
                  {Object.entries(firstPlanet.info).map(([key, value]) => (
                    <tr key={key}>
                      <td style={{ fontWeight: "bold", paddingRight: 8 }}>
                        {key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (s) => s.toUpperCase())}
                        :
                      </td>
                      <td>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            }
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
            { "could prob make this dryer, its just repeating code" }
              <Planet
                position={[0, 0, 0]}
                size={secondPlanet.size}
                color={secondPlanet.color}
                planetTilt={secondPlanet.planetTilt}
                texture={secondPlanet.texture}
                hasRings={secondPlanet.hasRings}
                ringColor={secondPlanet.ringColor}
                ringInnerRadius={secondPlanet.ringInnerRadius}
                ringOuterRadius={secondPlanet.ringOuterRadius}
                ringTilt={secondPlanet.ringTilt}
                orbitSpeed={0}
                info={
                  Object.entries(secondPlanet.info)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join('\n')
                }
              />
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
            <table
              style={{ color: "white", fontSize: "1em", borderSpacing: 4 }}
            >
              <tbody>
                {Object.entries(secondPlanet.info).map(([key, value]) => (
                  <tr key={key}>
                    <td style={{ fontWeight: "bold", paddingRight: 8 }}>
                      {key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (s) => s.toUpperCase())}
                      :
                    </td>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
