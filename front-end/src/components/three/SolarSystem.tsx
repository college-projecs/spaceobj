import { useRef, Suspense } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import Sun from './Sun'
import Planet from './Planet'
import OrbitLine from './OrbitLine'

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
            position={[3.9, 0, 0]} 
            size={0.38} 
            color="#A9A9A9" 
            planetTilt={180} 
            hasRings={false}
            orbitSpeed={0.0042}
            texture="/three/images/mercurymap.jpg"
            info={
              "Merucry\n"+
              "Diameter: 3,021.9 mi \n" +
              "Mass: 0.33 10^24 kg \n"+
              "Gravity: 3.7 g\n"+
              "Orbital period: 88 days\n"+ 
              "Average Temperature: 167 ºC\n"+ 
              "Distance from the Sun: 57.9 10^6 km\n"
            }
          />

          <Planet 
            position={[7.2, 0, 0]} 
            size={0.95} 
            color="#A9A9A9" 
            planetTilt={177} 
            hasRings={false}
            orbitSpeed={0.0016}
            texture="/three/images/venusmap.jpg"
            info={
              "Venus\n"+
              "Diameter: 7,520.8 mi \n" +
              "Mass: 4.87 10^24 kg \n"+
              "Gravity: 8.9 g\n"+
              "Orbital period: 224.7 days\n"+ 
              "Average Temperature: 464 ºC\n"+ 
              "Distance from the Sun: 108.2 10^6 km\n"
            }
          />

          <Planet 
            position={[10.0, 0, 0]} 
            size={1} 
            color="#A9A9A9" 
            planetTilt={156} 
            hasRings={false}
            orbitSpeed={0.0010}
            texture="/three/images/earthmap1k.jpg"
            info={
              "Earth\n"+
              "Diameter: 7,926.2 mi \n" +
              "Mass: 5.97 10^24 kg \n"+
              "Gravity: 9.8 g\n"+
              "Orbital period: 365.2 days\n"+ 
              "Average Temperature: 15 ºC\n"+ 
              "Distance from the Sun: 149.6 10^6 km\n"
            }
          />

          <Planet 
            position={[15.2, 0, 0]} 
            size={0.53} 
            color="#A9A9A9" 
            planetTilt={154} 
            hasRings={false}
            orbitSpeed={0.0005}
            texture="/three/images/mars_1k_color.jpg"
            info={
              "Mars\n"+
              "Diameter: 4,212.3 mi \n" +
              "Mass: 0.642 10^24 kg \n"+
              "Gravity: 3.7 g\n"+
              "Orbital period: 687.0 days\n"+ 
              "Average Temperature: -65 ºC\n"+ 
              "Distance from the Sun: 228.0 10^6 km\n"
            }
          />
        
          <Planet 
            position={[25.0, 0, 0]} 
            size={6} 
            color="#B0E0E6" 
            planetTilt={176} 
            hasRings={true} 
            ringColor="#87CEEB" 
            ringInnerRadius={1.3} 
            ringOuterRadius={1.5} 
            ringTilt={97.8}
            texture="/three/images/jupitermap.jpg"
            orbitSpeed={0.00008}
            info={
              "Jupiter\n"+
              "Diameter: 86,881 mi \n" +
              "Mass: 1898 10^24 kg \n"+
              "Gravity: 23.1 g\n"+
              "Orbital period: 4331 days\n"+ 
              "Average Temperature: -110 ºC\n"+ 
              "Distance from the Sun: 778.5 10^6 km\n"
            }
          />

          <Planet 
            position={[45.5, 0, 0]} 
            size={4.5} 
            color="#DAA520" 
            planetTilt={153} 
            hasRings={true} 
            ringColor="#C2B280" 
            ringInnerRadius={1.2} 
            ringOuterRadius={2.2} 
            ringTilt={26.7}
            orbitSpeed={0.00003}
            ringTexture="/three/images/saturnringcolor.jpg"
            texture="/three/images/saturnmap.jpg"
            info={
              "Saturn\n"+
              "Diameter: 74,898 mi \n" +
              "Mass: 568 10^24 kg \n"+
              "Gravity: 9.0 g\n"+
              "Orbital period: 10747 days\n"+ 
              "Average Temperature: -140 ºC\n"+ 
              "Distance from the Sun: 1432.0 10^6 km\n"
            }
          />
          <Planet 
            position={[75.5, 0, 0]} 
            size={2.4} 
            color="#DAA520" 
            planetTilt={82} 
            hasRings={true} 
            ringColor="#C2B280" 
            ringInnerRadius={2.0} 
            ringOuterRadius={2.2} 
            ringTilt={26.7}
            orbitSpeed={0.00001}
            texture="/three/images/neptunemap.jpg"
            info={
              "Neptune\n"+
              "Diameter: 31,518 mi \n" +
              "Mass: 86.8 10^24 kg \n"+
              "Gravity: 8.7 g\n"+
              "Orbital period: 30,589 days\n"+ 
              "Average Temperature: -195 ºC\n"+ 
              "Distance from the Sun: 2867.0 10^6 km\n"
            }
          />
          <Planet 
            position={[110, 0, 0]} 
            size={2} 
            color="#DAA520" 
            planetTilt={151} 
            hasRings={true} 
            ringColor="#C2B280" 
            ringInnerRadius={2.0} 
            ringOuterRadius={2.3} 
            ringTilt={26.7}
            orbitSpeed={0.000006}
            ringTexture="/three/images/uranusringcolour.jpg"
            texture="/three/images/uranusmap.jpg"
            info={
              "Uranus\n"+
              "Diameter: 30,599 mi \n" +
              "Mass: 102 10^24 kg \n"+
              "Gravity: 11.0 g\n"+
              "Orbital period: 59,800 days\n"+ 
              "Average Temperature: -200 ºC\n"+ 
              "Distance from the Sun: 4515.0 10^6 km\n"
            }
          />
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
