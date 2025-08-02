import { useRef, useContext, useEffect, useState } from 'react';
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
  onClick: (id: string, position: [number, number, number]) => void;
  isHovered: boolean;
  isRotating: boolean;
  rotationColor: string;
  isBlocked: boolean;
  isExploded: boolean;
  waveIntensity: number;
}

export const Cubelet: React.FC<CubeletProps> = ({ id, name, position, onHover, onClick, isHovered, isRotating, rotationColor, isBlocked, isExploded, waveIntensity }) => {
  const groupRef = useRef<Group>(null!);
  const lightEmitterRef = useRef<Mesh>(null!);
  const { setLightSource } = useContext(LightSourceContext);
  const [x, y, z] = position;

  const [explosionDirection] = useState(() => {
    // Pre-calculate explosion direction for consistent animation
    const direction = new Vector3(
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 2
    ).normalize();
    
    const distance = Math.random() * 2 + 2; // Random distance between 2-4 units (much closer)
    const targetPos = new Vector3(...position).add(direction.multiplyScalar(distance));
    
    return {
      position: targetPos,
      rotation: [
        Math.random() * Math.PI * 4,
        Math.random() * Math.PI * 4,
        Math.random() * Math.PI * 4
      ] as [number, number, number],
    };
  });
  
  const [springs, api] = useSpring(() => ({
    scale: 1,
    animPosition: position,
    rotation: [0, 0, 0] as [number, number, number],
    edgeWidth: 2,
    edgeColor: '#888888',
    faceColor: '#000000',
    emissiveIntensity: 0,
    waveScale: 1,
    wavePosition: [0, 0, 0] as [number, number, number],
    config: { tension: 800, friction: 30 },
  }));

  useEffect(() => {
    if (isExploded) {
      api.start({
        to: {
          animPosition: explosionDirection.position.toArray(),
          rotation: explosionDirection.rotation,
          scale: 0.4,
          waveScale: 1,
          wavePosition: [0, 0, 0],
        },
        config: { tension: 80, friction: 50 },
      });
    } else {
      // Calculate dramatic wave effect with optimized scaling
      const waveEffect = Math.sin(waveIntensity * Math.PI) * 2.0; // Strong but controlled effect
      const baseScale = isHovered ? 1.15 : 1;
      const finalScale = baseScale + waveEffect;
      

      
      // Wave position offset - uniform explosion outward from cube center (0,0,0)
      const directionFromCenter = new Vector3(x, y, z).normalize();
      const waveOffset = directionFromCenter.multiplyScalar(waveEffect * 0.8); // Increased for more dramatic effect
      
      const targetScale = finalScale;
      const targetEmissive = isHovered ? 2.0 : isRotating ? 0.8 : Math.abs(waveEffect) * 1.5; // Dramatic wave glow
      


      api.start({
        scale: targetScale,
        animPosition: isHovered 
          ? new Vector3(...position).add(new Vector3(x,y,z).normalize().multiplyScalar(0.25)).add(waveOffset).toArray() 
          : new Vector3(...position).add(waveOffset).toArray(),
        edgeWidth: isHovered ? 8 : 2,
        edgeColor: isHovered ? '#FFFFFF' : '#888888',
        faceColor: isHovered ? '#FFFFFF' : isRotating ? rotationColor : '#000000',
        emissiveIntensity: targetEmissive,
        waveScale: finalScale,
        wavePosition: waveOffset.toArray(),
        config: { tension: 600, friction: 25 }, // Optimized for wave responsiveness
      });
    }
  }, [isExploded, explosionDirection, isHovered, isRotating, rotationColor, waveIntensity, api, position, x, y, z]);

  // Reset position when not exploded (slower reset) - but don't interfere with wave animations
  useEffect(() => {
    if (!isExploded && groupRef.current && waveIntensity === 0) {
      api.start({
        animPosition: position,
        rotation: [0, 0, 0],
        scale: 1,
        config: { tension: 80, friction: 50 },
      });
    }
  }, [isExploded, position, api, waveIntensity, id]);

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (isBlocked || isHovered || isExploded) return;
    onHover(id);
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (isExploded) return;
    onHover(null);
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (isBlocked || isExploded) return;
    onClick(id, position);
  };



  useEffect(() => {
    if (isHovered && setLightSource) {
      const updateLightSource = () => setLightSource(lightEmitterRef);
      requestAnimationFrame(updateLightSource);
    } else if (setLightSource) {
      setLightSource(null);
    }
  }, [isHovered, setLightSource]);

  if (x === 0 && y === 0 && z === 0) {
    return null;
  }
  
  return (
    <group 
      ref={groupRef}
      name={name}
      position={isExploded ? undefined : position}
      onPointerOver={isExploded ? undefined : handlePointerOver}
      onPointerOut={isExploded ? undefined : handlePointerOut}
      onClick={isExploded ? undefined : handleClick}
    >
      <a.group
        position={isExploded ? springs.animPosition as any : springs.animPosition.to((...p: [number, number, number]) => new Vector3(...p).sub(new Vector3(...position)).toArray())}
        rotation={springs.rotation as any}
        scale={springs.scale}
      >
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <a.meshStandardMaterial
            color={springs.faceColor}
            emissive={springs.faceColor}
            emissiveIntensity={springs.emissiveIntensity}
            toneMapped={false}
            transparent={false}
            fog={false}
            dithering={false}
          />
          {(!isRotating || isHovered) && !isExploded && (
            <Edges>
              <a.lineBasicMaterial 
                color={springs.edgeColor} 
                linewidth={springs.edgeWidth} 
                toneMapped={false} 
              />
            </Edges>
          )}
        </mesh>
        
        {isHovered && !isExploded && (
          <mesh ref={lightEmitterRef}>
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshBasicMaterial 
              color={0xffffff}
              transparent={false}
              fog={false}
              toneMapped={false}
            />
          </mesh>
        )}
      </a.group>
    </group>
  );
};
