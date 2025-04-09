import { useRef } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { Group, Mesh, TextureLoader, MathUtils } from 'three'

interface PlanetProps {
  position: [number, number, number]
  size: number
  color: string
  planetTilt: number
  texture?: string
  hasRings?: boolean
  ringColor?: string
  ringTexture?: string
  ringInnerRadius?: number
  ringOuterRadius?: number
  ringTilt?: number
  orbitSpeed?: number
  rotationSpeed?: number
}

const Planet = ({
  position,
  size,
  color,
  planetTilt,
  texture,
  hasRings = false,
  ringColor = '#FFFFFF',
  ringTexture,
  ringInnerRadius = 1.5,
  ringOuterRadius = 2.2,
  ringTilt = 0,
  orbitSpeed = 0.002,
  rotationSpeed = 0.01,
}: PlanetProps) => {
  const planetRef = useRef<Mesh>(null)
  const ringsRef = useRef<Mesh>(null)
  const groupRef = useRef<Group>(null)
  
  const planetTexture = texture ? useLoader(TextureLoader, texture) : null
  const ringsTextureMap = ringTexture ? useLoader(TextureLoader, ringTexture) : null
  
  const tiltRadians = MathUtils.degToRad(planetTilt) // convert to radians
  
  useFrame(() => {
    if (planetRef.current) {
      planetRef.current.rotation.y += rotationSpeed
    }
    
    if (groupRef.current) {
      groupRef.current.rotation.y += orbitSpeed
    }
  })
  
  return (
    <group ref={groupRef} position={position}>
      <group rotation={[tiltRadians, 0, 0]}>
        <mesh ref={planetRef}>
          <sphereGeometry args={[size, 64, 64]} />
          <meshStandardMaterial
            color={color}
            roughness={0.7}
            metalness={0.3}
            map={planetTexture}
            envMapIntensity={0.5}
          />
        </mesh>
        
        {hasRings && (
          <mesh ref={ringsRef} rotation={[MathUtils.degToRad(ringTilt - planetTilt), 0, 0]}>
            <ringGeometry args={[size * ringInnerRadius, size * ringOuterRadius, 64]} />
            <meshStandardMaterial
              color={ringColor}
              roughness={0.9}
              metalness={0.1}
              transparent={true}
              opacity={0.8}
              map={ringsTextureMap}
              side={2}
            />
          </mesh>
        )}
      </group>
    </group>
  )
}

export default Planet
