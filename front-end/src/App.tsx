import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import SolarSystem from './components/three/SolarSystem'
import { Suspense } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import ComparePage from './pages/ComparePage'

function App() {
  return (
    <BrowserRouter>
      <nav style={{ position: 'absolute', top: 10, left: 10, zIndex: 1 }}>
        <Link to="/" style={{ marginRight: '10px', color: 'white' }}>Home</Link>
        <Link to="/compare" style={{ color: 'white' }}>Compare</Link>
      </nav>
      <Routes>
        <Route path="/" element={
          <Canvas style={{ width: '100vw', height: '100vh' }}>
            <color attach="background" args={['#000']} />
            <ambientLight intensity={0.1} />
            <OrbitControls />
            <Stars radius={200} depth={50} count={5000} factor={4} />
            <Suspense fallback={null}>
              <SolarSystem />
            </Suspense>
          </Canvas>
        } />
        <Route path="/compare" element={<ComparePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
