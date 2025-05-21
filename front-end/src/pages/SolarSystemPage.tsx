import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import SolarSystem from "../components/three/SolarSystem";
import { Header } from "./Homepage";
import { Hero } from "./Homepage";
import { Footer } from "./Homepage";

export default function SolarSystemPage() {
  console.log("SolarSystemPage");
  return (
    <div>
      <Header />
      <Hero />

      <section className="intro solar-section">
        <div className="intro-container">
          <div className="solar-container">
            <Canvas
              camera={{ position: [0, 50, 150], fov: 45 }}
            >
              <ambientLight intensity={0.4} />
              <pointLight position={[0, 0, 0]} intensity={1.5} />
              <OrbitControls
                enablePan={false}
                enableZoom={true}
                dampingFactor={0.05}
                zoomSpeed={0.2}
              />
              <SolarSystem />
            </Canvas>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}