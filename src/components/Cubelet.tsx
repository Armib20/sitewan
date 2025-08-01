import { useMemo, useRef } from 'react';
import { useSpring, a } from '@react-spring/three';
import { Edges } from '@react-three/drei';
import { Group, Vector3, type Object3D } from 'three';


interface CubeletProps {
  id: string;
  position: [number, number, number];
  onHover: (id: string | null) => void;
  isHovered: boolean;
  isBlocked: boolean;
  onClick: () => void;
}

const COLORS = {
  black: 0x000000,
  blue: 0x000000,
  green: 0x000000,
  white: 0x000000,
  yellow: 0x000000,
  red: 0x000000,
  orange: 0x000000,
};

const generateMaterials = (x: number, y: number, z: number) => {
  const materials = [];
  
  if (x === 0 || x === -1.1) materials.push({ color: COLORS.black });
  else materials.push({ color: COLORS.blue });
  
  if (x === 0 || x === 1.1) materials.push({ color: COLORS.black });
  else materials.push({ color: COLORS.green });
  
  if (y === 0 || y === -1.1) materials.push({ color: COLORS.black });
  else materials.push({ color: COLORS.white });
  
  if (y === 0 || y === 1.1) materials.push({ color: COLORS.black });
  else materials.push({ color: COLORS.yellow });
  
  if (z === 0 || z === -1.1) materials.push({ color: COLORS.black });
  else materials.push({ color: COLORS.red });
  
  if (z === 0 || z === 1.1) materials.push({ color: COLORS.black });
  else materials.push({ color: COLORS.orange });
  
  return materials;
};

export const Cubelet: React.FC<CubeletProps> = ({ id, position, onHover, isHovered, isBlocked, onClick }) => {
  const groupRef = useRef<Group>(null!);
  const [x, y, z] = position;

  const { scale, animPosition } = useSpring({
    scale: isHovered ? 1.2 : 1,
    animPosition: isHovered ? 0.3 : 0,
    config: { tension: 400, friction: 15 },
  });

  const materials = useMemo(() => generateMaterials(x, y, z), [x, y, z]);

  const handlePointerOver = (e: React.PointerEvent<Object3D>) => {
    e.stopPropagation();
    if (isBlocked || isHovered) return;
    onHover(id);
  };

  const handlePointerOut = (e: React.PointerEvent<Object3D>) => {
    e.stopPropagation();
    onHover(null);
  };

  const handleClick = (e: React.PointerEvent<Object3D>) => {
    e.stopPropagation();
    if (isBlocked) return;
    onClick();
  };

  if (x === 0 && y === 0 && z === 0) {
    return null;
  }

  const direction = useMemo(() => new Vector3(x, y, z).normalize(), [x, y, z]);

  return (
    <group 
      ref={groupRef}
      position={position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      <a.group
        scale={scale as any}
        position={animPosition.to((val) => direction.clone().multiplyScalar(val).toArray())}
      >
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          {materials.map((material, index) => (
            <meshBasicMaterial key={index} attach={`material-${index}`} color={material.color} />
          ))}
          <Edges>
            <lineBasicMaterial color={0xffffff} linewidth={8} />
          </Edges>
        </mesh>
        
      </a.group>
    </group>
  );
};
