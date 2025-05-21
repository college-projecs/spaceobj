import { useRef, Suspense } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import Sun from './Sun'
import Planet from './Planet'
import OrbitLine from './OrbitLine'
import planetData from './solarSystemData.json'

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
          
          {planetData.map((planet) => {
            const infoString = planet.info
              ? Object.entries(planet.info)
                  .map(([key, value]) => `${key}: ${value}`)
                  .join('\n')
              : "";
            return (
              <Planet
                key={planet.name}
                position={planet.position as [number, number, number]}
                size={planet.size}
                color={planet.color}
                planetTilt={planet.planetTilt}
                hasRings={planet.hasRings}
                orbitSpeed={planet.orbitSpeed}
                texture={planet.texture}
                info={infoString}
                ringColor={planet.ringColor}
                ringInnerRadius={planet.ringInnerRadius}
                ringOuterRadius={planet.ringOuterRadius}
                ringTilt={planet.ringTilt}
                ringTexture={planet.ringTexture}
              />
            );
          })}

          <OrbitLine radius={3.9} color="#888888" />
          <OrbitLine radius={7.2} color="#888888" />
          <OrbitLine radius={10} color="#888888" />
          <OrbitLine radius={15.2} color="#888888" />
          <OrbitLine radius={25.5} color="#888888" />
          <OrbitLine radius={45.5} color="#888888" />
          <OrbitLine radius={75.5} color="#888888" />
          <OrbitLine radius={110} color="#888888" />
          
        </group>
      </Suspense>
    </>
  )
}

export default SolarSystem
