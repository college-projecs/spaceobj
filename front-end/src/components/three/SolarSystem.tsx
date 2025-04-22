import { useRef, Suspense } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import Sun from './Sun'
import Planet from './Planet'

const SolarSystem = () => {
  const groupRef = useRef<Group>(null)

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001
    }
  })

  return (
    <>
      <EffectComposer>
        <Bloom 
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          height={300}
          intensity={.5}
        />
      </EffectComposer>
      
      <Suspense fallback={null}>
        <group ref={groupRef}>
          <Sun 
            position={[0, 0, 0]} 
            size={2.5} 
          />
          
          <Planet 
            position={[5, 0, 0]} 
            size={0.4} 
            color="#A9A9A9" 
            planetTilt={0.034} 
            hasRings={false}
          />
          
          <Planet 
            position={[10, 0, 0]} 
            size={1.2} 
            color="#DAA520" 
            planetTilt={26.7} 
            hasRings={true} 
            ringColor="#C2B280" 
            ringInnerRadius={1.5} 
            ringOuterRadius={2.5} 
            ringTilt={26.7}
          />
        
          <Planet 
            position={[15, 0, 0]} 
            size={1.0} 
            color="#B0E0E6" 
            planetTilt={0} 
            hasRings={true} 
            ringColor="#87CEEB" 
            ringInnerRadius={1.4} 
            ringOuterRadius={2.0} 
            ringTilt={97.8}
            texture="/three/jupiter.jpg"
          />
          
        </group>
      </Suspense>
    </>
  )
}

export default SolarSystem
