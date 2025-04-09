
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import SolarSystem from './components/three/SolarSystem'
import { Suspense } from 'react'

function App() {
  return (
    <>
      <Canvas style={{ width: '100vw', height: '100vh' }}>
        <color attach="background" args={['#000']} /> // blak background
        <ambientLight intensity={0.1} />
        <OrbitControls />
        <Stars radius={200} depth={50} count={5000} factor={4} />
        <Suspense fallback={null}>
          // suspense because async texture loading
          <SolarSystem />
        </Suspense>
      </Canvas>
    </>
  )
}

export default App
