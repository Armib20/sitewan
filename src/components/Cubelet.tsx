import { useMemo, useRef, useContext, useEffect } from 'react';
import { useSpring, a } from '@react-spring/three';
import { Edges } from '@react-three/drei';
import { Group, Vector3, Mesh } from 'three';
import { type ThreeEvent } from '@react-three/fiber';
import { LightSourceContext } from '../contexts/LightSourceContext';

interface CubeletProps {
  id: string;
  name: string;
  position: [number, number, number];
  onHover: (id: string | null) => void;
  isHovered: boolean;
  isRotating: boolean;
  rotationColor: string;
  isBlocked: boolean;
  onClick: () => void;
}

export const Cubelet: React.FC<CubeletProps> = ({ id, name, position, onHover, isHovered, isRotating, rotationColor, isBlocked, onClick }) => {
  const groupRef = useRef<Group>(null!);
  const lightEmitterRef = useRef<Mesh>(null!);
  const { setLightSource } = useContext(LightSourceContext);
  const [x, y, z] = position;

  const { scale, animPosition, edgeWidth, edgeColor, faceColor, emissiveIntensity } = useSpring({
    scale: isHovered ? 1.15 : 1,
    animPosition: isHovered ? 0.25 : 0,
    edgeWidth: isHovered ? 8 : 2,
    edgeColor: isHovered ? '#FFFFFF' : '#888888',
    faceColor: isHovered ? '#FFFFFF' : isRotating ? rotationColor : '#000000',
    emissiveIntensity: isHovered ? 2.0 : isRotating ? 0.8 : 0,
    config: { 
      tension: 800, 
      friction: 30,
      clamp: true, // Prevents overshooting for snappier animation
      precision: 0.01 // Higher precision for faster completion
    },
  });

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (isBlocked || isHovered) return;
    onHover(id);
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onHover(null);
  };

  const handleClick = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (isBlocked) return;
    onClick();
  };

  // Optimized: Only update light source when actually needed, with reduced frequency
  useEffect(() => {
    if (isHovered && setLightSource) {
      // Use requestAnimationFrame for better performance
      const updateLightSource = () => setLightSource(lightEmitterRef);
      requestAnimationFrame(updateLightSource);
    } else if (setLightSource) {
      setLightSource(null);
    }
  }, [isHovered, setLightSource]);

  if (x === 0 && y === 0 && z === 0) {
    return null;
  }

  const direction = useMemo(() => new Vector3(x, y, z).normalize(), [x, y, z]);

  return (
    <group 
      ref={groupRef}
      name={name}
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
          {/* Optimized: Single material with animated emissive for better performance */}
          <a.meshStandardMaterial
            color={faceColor}
            emissive={faceColor}
            emissiveIntensity={emissiveIntensity}
            toneMapped={false}
            transparent={false}
            // Performance optimization: disable features we don't need
            fog={false}
            dithering={false}
          />
          {(!isRotating || isHovered) && (
            <Edges>
              <a.lineBasicMaterial 
                color={edgeColor} 
                linewidth={edgeWidth} 
                toneMapped={false} 
              />
            </Edges>
          )}
        </mesh>
        
        {isHovered && (
          <mesh ref={lightEmitterRef}>
            {/* Optimized: Lower poly sphere for better performance */}
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshBasicMaterial 
              color={0xffffff}
              transparent={false}
              fog={false}
              // Performance optimization: instant brightness without heavy calculations
              toneMapped={false}
            />
          </mesh>
        )}
      </a.group>
    </group>
  );
};
