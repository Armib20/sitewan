import { useRef } from 'react';
import { Mesh } from 'three';
import { Edges } from '@react-three/drei';

interface CubeletProps {
  position: [number, number, number];
}

// Rubik's cube standard colors
const COLORS = {
  black: 0x000000,   // hidden faces
  blue: 0x000000,    // right face
  green: 0x000000,   // left face  
  white: 0x000000,   // top face
  yellow: 0x000000,  // bottom face
  red: 0x000000,     // front face
  orange: 0x000000,  // back face
};

const generateMaterials = (x: number, y: number, z: number) => {
  // Materials order: x+, x-, y+, y-, z+, z-
  // Corresponding to: right, left, top, bottom, front, back
  const materials = [];
  
  // Right face (x+)
  if (x === 0 || x === -1.1) {
    materials.push({ color: COLORS.black });
  } else {
    materials.push({ color: COLORS.blue });
  }
  
  // Left face (x-)
  if (x === 0 || x === 1.1) {
    materials.push({ color: COLORS.black });
  } else {
    materials.push({ color: COLORS.green });
  }
  
  // Top face (y+)
  if (y === 0 || y === -1.1) {
    materials.push({ color: COLORS.black });
  } else {
    materials.push({ color: COLORS.white });
  }
  
  // Bottom face (y-)
  if (y === 0 || y === 1.1) {
    materials.push({ color: COLORS.black });
  } else {
    materials.push({ color: COLORS.yellow });
  }
  
  // Front face (z+)
  if (z === 0 || z === -1.1) {
    materials.push({ color: COLORS.black });
  } else {
    materials.push({ color: COLORS.red });
  }
  
  // Back face (z-)
  if (z === 0 || z === 1.1) {
    materials.push({ color: COLORS.black });
  } else {
    materials.push({ color: COLORS.orange });
  }
  
  return materials;
};

export const Cubelet: React.FC<CubeletProps> = ({ position }) => {
  const meshRef = useRef<Mesh>(null);
  const [x, y, z] = position;
  
  // Skip rendering the center piece (it's hidden anyway)
  if (x === 0 && y === 0 && z === 0) {
    return null;
  }
  
  const materials = generateMaterials(x, y, z);
  
  return (
    <group position={position}>
      {/* Main cube */}
      <mesh ref={meshRef}>
        <boxGeometry args={[1, 1, 1]} />
        {materials.map((material, index) => (
          <meshBasicMaterial key={index} attach={`material-${index}`} color={material.color} />
        ))}
        <Edges>
          <lineBasicMaterial color={0xffffff} linewidth={4} />
        </Edges>
      </mesh>
    </group>
  );
};
