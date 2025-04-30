import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import SolarSystem from '../components/three/SolarSystem'

export default function SolarSystemPage() {
    console.log('SolarSystemPage')
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Canvas camera={{ position: [0, 50, 150], fov: 45 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[0, 0, 0]} intensity={1.5} />
        <OrbitControls enablePan={false} enableZoom={true} />
        <SolarSystem />
      </Canvas>
    </div>
  )
}
