import { useRef } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { Mesh, TextureLoader } from 'three'

interface SunProps {
  position: [number, number, number]
  size: number
  texture?: string
}

const Sun = ({ position, size, texture }: SunProps) => {
  const meshRef = useRef<Mesh>(null)
  const sunTexture = texture ? useLoader(TextureLoader, texture) : null

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 64, 64]} />
      <meshStandardMaterial
        color="#FDB813"
        emissive="#FD7813"
        emissiveIntensity={2}
        roughness={0.7}
        metalness={0.3}
        map={sunTexture}
      />
      <pointLight
        intensity={200}
        distance={100}
        decay={2}
        color="#FFF9E5"
      />
    </mesh>
  )
}

export default Sun
