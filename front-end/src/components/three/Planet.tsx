import { useRef, useState } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import {
  Group,
  Mesh,
  TextureLoader,
  DataTexture,
  DoubleSide,
} from 'three'
import { MathUtils } from 'three'
import { Html } from '@react-three/drei'
import { useSpring, a } from '@react-spring/three'

export interface PlanetProps {
  position?: [number, number, number]
  size: number
  color?: string
  texture?: string | DataTexture
  planetTilt?: number
  hasRings?: boolean
  ringColor?: string
  ringTexture?: string
  ringInnerRadius?: number
  ringOuterRadius?: number
  info: string,
  ringTilt?: number
  orbitSpeed?: number
}

export default function Planet({
  position = [0, 0, 0],
  size,
  color = '#ffffff',
  texture,
  planetTilt = 0,
  hasRings = false,
  ringColor = '#FFFFFF',
  info,
  ringTexture,
  ringInnerRadius = 1.5,
  ringOuterRadius = 2.2,
  ringTilt = 0,
  orbitSpeed = 0.01,
}: PlanetProps) {
  const groupRef = useRef<Group>(null!)
  const meshRef = useRef<Mesh>(null!)
  const ringsRef = useRef<Mesh>(null!)

  // always call the hook with a valid URL (fallback to earth texture)
  const defaultURL = typeof texture === 'string' ? texture : '/three/images/earthmap1k.jpg'
  const loadedTexture = useLoader(TextureLoader, defaultURL)
  const finalMap = texture instanceof DataTexture ? texture : loadedTexture

  // Load ring texture if provided
  const ringsTextureMap = ringTexture
    ? useLoader(TextureLoader, ringTexture)
    : undefined

  // Animation state for zoom and info
  const [isZoom, setIsZoom] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const { scale } = useSpring({
    scale: isZoom ? 3 : 1,
  })

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
    <group ref={groupRef} position={position}>
      <group rotation={[0, (planetTilt * Math.PI) / 180, 0]}>
        <a.mesh
          ref={meshRef}
          scale={scale}
          onClick={() => {
            setIsZoom((prev) => !prev)
            setShowInfo((prev) => !prev)
          }}
        >
          <sphereGeometry args={[size, 32, 32]} />
          <meshStandardMaterial map={finalMap} color={color} />
        </a.mesh>

        {hasRings && (
          <mesh ref={ringsRef} rotation={[MathUtils.degToRad((ringTilt ?? 0) - (planetTilt ?? 0)), 0, 0]}>
            <ringGeometry args={[size * (ringInnerRadius ?? 1.5), size * (ringOuterRadius ?? 2.2), 64]} />
            <meshStandardMaterial
              color={ringColor}
              roughness={0.9}
              metalness={0.1}
              transparent={true}
              opacity={0.8}
              map={ringsTextureMap}
              side={DoubleSide}
            />
          </mesh>
        )}
      </group>
      {showInfo && (
        <Html position={[position[0] + 3, position[1] + 5, position[2]]} center>
          <div style={{
            color: 'white',
            background: 'rgba(94, 118, 97, 0.5)',
            padding: '15px 15px',
            borderRadius: '12px',
            fontSize: '0.5rem',
            lineHeight: '1.5',
            fontFamily: 'monospace',
            whiteSpace: 'pre',
          }}>
            {info}
          </div>
        </Html>
      )}
    </group>
  )
}
