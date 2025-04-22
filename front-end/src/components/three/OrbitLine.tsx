import * as THREE from 'three'

const OrbitLine = ({radius = 3, color = 'white'}) => {
  return (
    <mesh rotation={[-Math.PI/2, 0, 0]}>
      <torusGeometry args={[radius, 0.01, 5, 50]}/>
      <meshStandardMaterial
        color ={color}
        emissive={color}
        emissiveIntensity={0.5}
        side = {THREE.DoubleSide}
        />
    </mesh>
  )
}


export default OrbitLine