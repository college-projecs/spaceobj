import React, { useRef } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import {
  Group,
  Mesh,
  TextureLoader,
  DataTexture,
  DoubleSide,
} from 'three'

export interface PlanetProps {
  position?: [number, number, number]
  size: number
  color?: string
  texture?: string | DataTexture
  planetTilt?: number
  hasRings?: boolean
  orbitSpeed?: number
}

export default function Planet({
  position = [0, 0, 0],
  size,
  color = '#ffffff',
  texture,
  planetTilt = 0,
  hasRings = false,
  orbitSpeed = 0.01,
}: PlanetProps) {
  const groupRef = useRef<Group>(null!)
  const meshRef = useRef<Mesh>(null!)

  // always call the hook with a valid URL (fallback to earth texture)
  const defaultURL = typeof texture === 'string' ? texture : '/three/images/earthmap1k.jpg'
  const loadedTexture = useLoader(TextureLoader, defaultURL)
  const finalMap = texture instanceof DataTexture ? texture : loadedTexture

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    // revolve the planet around the origin
    if (groupRef.current) {
      groupRef.current.rotation.y = t * orbitSpeed
    }
    // spin on its own axis
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005
    }
  })

  return (
    <group ref={groupRef}>
      {/* Planet sphere */}
      <mesh
        ref={meshRef}
        position={position}
        rotation={[0, (planetTilt * Math.PI) / 180, 0]}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial map={finalMap} color={color} />
      </mesh>

      {/* Optional rings, attached to planet group */}
      {hasRings && (
        <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[size * 1.2, size * 1.5, 64]} />
          <meshStandardMaterial side={DoubleSide} color="#cccccc" />
        </mesh>
      )}
    </group>
  )
}
