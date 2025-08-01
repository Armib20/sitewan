import { useMemo, useRef, useContext, useEffect, useState } from 'react';
import { useSpring, a, config } from '@react-spring/three';
import { Edges } from '@react-three/drei';
import { Group, Vector3, Mesh, Euler } from 'three';
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
  isExploded: boolean;
}

export const Cubelet: React.FC<CubeletProps> = ({ id, name, position, onHover, isHovered, isRotating, rotationColor, isBlocked, onClick, isExploded }) => {
  const groupRef = useRef<Group>(null!);
  const lightEmitterRef = useRef<Mesh>(null!);
  const { setLightSource } = useContext(LightSourceContext);
  const [x, y, z] = position;

  const [explosionProps, setExplosionProps] = useState<{ position: Vector3; rotation: Euler } | null>(null);

  useEffect(() => {
    if (isExploded && groupRef.current) {
      const worldPosition = new Vector3();
      groupRef.current.getWorldPosition(worldPosition);
      
      const randomDirection = new Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ).normalize();
      
      setExplosionProps({
        position: worldPosition.clone().add(randomDirection.multiplyScalar(Math.random() * 5 + 3)),
        rotation: new Euler(
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2
        ),
      });
    }
  }, [isExploded]);
  
  const [springs, api] = useSpring(() => ({
    scale: 1,
    animPosition: position,
    rotation: [0, 0, 0] as [number, number, number],
    edgeWidth: 2,
    edgeColor: '#888888',
    faceColor: '#000000',
    emissiveIntensity: 0,
    config: { tension: 800, friction: 30, clamp: true },
  }));

  useEffect(() => {
    if (isExploded && explosionProps) {
      api.start({
        to: { 
          animPosition: explosionProps.position.toArray(),
          rotation: [explosionProps.rotation.x, explosionProps.rotation.y, explosionProps.rotation.z] 
        },
        config: { tension: 120, friction: 50, clamp: false },
      });
    } else {
      api.start({
        scale: isHovered ? 1.15 : 1,
        animPosition: isHovered ? new Vector3(...position).add(new Vector3(x,y,z).normalize().multiplyScalar(0.25)).toArray() : position,
        edgeWidth: isHovered ? 8 : 2,
        edgeColor: isHovered ? '#FFFFFF' : '#888888',
        faceColor: isHovered ? '#FFFFFF' : isRotating ? rotationColor : '#000000',
        emissiveIntensity: isHovered ? 2.0 : isRotating ? 0.8 : 0,
        config: { tension: 800, friction: 30, clamp: true },
      });
    }
  }, [isExploded, explosionProps, isHovered, isRotating, rotationColor, api, position, x, y, z]);

  useEffect(() => {
    if (!isExploded) {
      groupRef.current?.position.set(...position);
      groupRef.current?.rotation.set(0, 0, 0);
    }
  }, [isExploded, position]);

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

  const handleClick = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (isBlocked) return;
    onClick();
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
  
  const animatedGroup = (
    <a.group
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
        {(!isRotating || isHovered) && (
          <Edges>
            <a.lineBasicMaterial 
              color={springs.edgeColor} 
              linewidth={springs.edgeWidth} 
              toneMapped={false} 
            />
          </Edges>
        )}
      </mesh>
      
      {isHovered && (
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
  );

  return (
    isExploded ? (
      <a.group ref={groupRef} name={name} position={springs.animPosition as any} rotation={springs.rotation as any}>
        {animatedGroup}
      </a.group>
    ) : (
      <group 
        ref={groupRef}
        name={name}
        position={position}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <a.group
          position={springs.animPosition.to((...p: [number, number, number]) => new Vector3(...p).sub(new Vector3(...position)).toArray())}
          scale={springs.scale}
        >
          {animatedGroup}
        </a.group>
      </group>
    )
  );
};
