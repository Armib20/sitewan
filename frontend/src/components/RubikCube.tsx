import React, { useRef, useCallback, forwardRef, useImperativeHandle, useState } from 'react';
import { Group, Matrix4, Vector3, Euler, Raycaster, Vector2 } from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { Cubelet } from './Cubelet';

export interface RubikCubeRef {
  animateXFace: (xpos: number, direction: number) => Promise<void>;
  animateYFace: (ypos: number, direction: number) => Promise<void>;
  animateZFace: (zpos: number, direction: number) => Promise<void>;
  resetCube: () => void;
  isAnimating: boolean;
}

interface AnimationState {
  isAnimating: boolean;
  startTime: number;
  duration: number;
  axis: 'x' | 'y' | 'z';
  position: number;
  targetRotation: number;
  resolve?: () => void;
}

export const RubikCube = forwardRef<RubikCubeRef>((_, ref) => {
  const ambientGroupRef = useRef<Group>(null); // For ambient rotation only
  const cubeGroupRef = useRef<Group>(null);
  const rotationGroupRef = useRef<Group>(null);
  const [animationState, setAnimationState] = useState<AnimationState | null>(null);
  
  // Ambient rotation and hover state
  const [ambientRotationSpeed] = useState(0.002);
  const [hoveredCubelet, setHoveredCubelet] = useState<string | null>(null);
  const [originalPositions] = useState(new Map());
  const { camera, gl } = useThree();
  const raycaster = useRef(new Raycaster());
  const mouse = useRef(new Vector2());
  
  // Helper function to round position values to -1.1, 0, or 1.1
  const round = useCallback((v: number) => {
    const distToZero = Math.abs(v);
    const distToPos = Math.abs(1.1 - v);
    const distToNeg = Math.abs(-1.1 - v);
    
    if (distToZero < distToNeg && distToZero < distToPos) {
      return 0;
    }
    if (distToNeg < distToZero && distToNeg < distToPos) {
      return -1.1;
    }
    return 1.1; // closer to 1.1 case
  }, []);

  // Easing function for smooth animations
  const easeInOutCubic = useCallback((t: number) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }, []);

  // Move cubelets to rotation group for animation
  const attachToRotationGroup = useCallback((axis: 'x' | 'y' | 'z', position: number) => {
    if (!cubeGroupRef.current || !rotationGroupRef.current) return;
    
    const cubePos = new Vector3();
    const cubesToMove = cubeGroupRef.current.children.filter((child) => {
      // Get position relative to cubeGroup, not world position
      child.getWorldPosition(cubePos);
      // Transform to cube group's local space
      cubeGroupRef.current!.worldToLocal(cubePos);
      return round(cubePos[axis]) === position;
    });

    cubesToMove.forEach((cube) => {
      rotationGroupRef.current!.attach(cube);
    });
  }, [round]);

  // Move cubelets back to main group after animation
  const detachFromRotationGroup = useCallback(() => {
    if (!cubeGroupRef.current || !rotationGroupRef.current) return;
    
    const cubesToMove = [...rotationGroupRef.current.children];
    cubesToMove.forEach((cube) => {
      cubeGroupRef.current!.attach(cube);
    });
    
    // Reset rotation group
    rotationGroupRef.current.rotation.set(0, 0, 0);
  }, []);

  // Animation loop and ambient rotation
  useFrame(() => {
    // Only do ambient rotation when NOT animating face moves
    if (ambientGroupRef.current && !animationState) {
      ambientGroupRef.current.rotation.y += ambientRotationSpeed;
      ambientGroupRef.current.rotation.x += ambientRotationSpeed * 0.3;
    }

    // Handle face rotation animation
    if (animationState && rotationGroupRef.current) {
      const elapsed = Date.now() - animationState.startTime;
      const progress = Math.min(elapsed / animationState.duration, 1);
      const easedProgress = easeInOutCubic(progress);
      
      // Apply rotation
      const currentRotation = easedProgress * animationState.targetRotation;
      
      if (animationState.axis === 'x') {
        rotationGroupRef.current.rotation.x = currentRotation;
      } else if (animationState.axis === 'y') {
        rotationGroupRef.current.rotation.y = currentRotation;
      } else if (animationState.axis === 'z') {
        rotationGroupRef.current.rotation.z = currentRotation;
      }

      // Animation complete
      if (progress >= 1) {
        detachFromRotationGroup();
        setAnimationState(null);
        animationState.resolve?.();
      }
    }
  });

  // Animate X face rotation
  const animateXFace = useCallback((xpos: number, direction: number): Promise<void> => {
    if (animationState) return Promise.resolve();
    
    return new Promise((resolve) => {
      attachToRotationGroup('x', xpos);
      setAnimationState({
        isAnimating: true,
        startTime: Date.now(),
        duration: 300, // 300ms animation
        axis: 'x',
        position: xpos,
        targetRotation: (Math.PI / 2) * direction,
        resolve,
      });
    });
  }, [animationState, attachToRotationGroup]);

  // Animate Y face rotation
  const animateYFace = useCallback((ypos: number, direction: number): Promise<void> => {
    if (animationState) return Promise.resolve();
    
    return new Promise((resolve) => {
      attachToRotationGroup('y', ypos);
      setAnimationState({
        isAnimating: true,
        startTime: Date.now(),
        duration: 300,
        axis: 'y',
        position: ypos,
        targetRotation: (Math.PI / 2) * direction,
        resolve,
      });
    });
  }, [animationState, attachToRotationGroup]);

  // Animate Z face rotation
  const animateZFace = useCallback((zpos: number, direction: number): Promise<void> => {
    if (animationState) return Promise.resolve();
    
    return new Promise((resolve) => {
      attachToRotationGroup('z', zpos);
      setAnimationState({
        isAnimating: true,
        startTime: Date.now(),
        duration: 300,
        axis: 'z',
        position: zpos,
        targetRotation: (Math.PI / 2) * direction,
        resolve,
      });
    });
  }, [animationState, attachToRotationGroup]);

  const resetCube = useCallback(() => {
    if (animationState) return; // Don't reset during animation
    
    // Reset all transformations
    if (cubeGroupRef.current) {
      cubeGroupRef.current.children.forEach((child) => {
        child.matrixAutoUpdate = true;
        child.matrix.identity();
        child.rotation.set(0, 0, 0);
        child.updateMatrix();
      });
    }
    
    // Also ensure rotation group is clean
    detachFromRotationGroup();
  }, [animationState, detachFromRotationGroup]);

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    animateXFace,
    animateYFace,
    animateZFace,
    resetCube,
    isAnimating: !!animationState,
  }), [animateXFace, animateYFace, animateZFace, resetCube, animationState]);

  // Generate all cubelet positions for a 3x3x3 cube
  const positions: Array<[number, number, number]> = [];
  for (let x = -1.1; x <= 1.1; x += 1.1) {
    for (let y = -1.1; y <= 1.1; y += 1.1) {
      for (let z = -1.1; z <= 1.1; z += 1.1) {
        // Round to handle floating point precision
        const roundedX = Math.round(x * 10) / 10;
        const roundedY = Math.round(y * 10) / 10;
        const roundedZ = Math.round(z * 10) / 10;
        positions.push([roundedX, roundedY, roundedZ]);
      }
    }
  }

  // Handle mouse move for hover effects
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!cubeGroupRef.current || !ambientGroupRef.current) return;
    
    // Convert mouse position to normalized device coordinates
    mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Update raycaster
    raycaster.current.setFromCamera(mouse.current, camera);
    
    // Find intersections with the ambient group (which contains everything)
    const intersects = raycaster.current.intersectObjects(ambientGroupRef.current.children, true);
    
    if (intersects.length > 0) {
      const intersected = intersects[0].object;
      const cubeId = `${intersected.position.x}-${intersected.position.y}-${intersected.position.z}`;
      
      if (hoveredCubelet !== cubeId) {
        // Reset previous hover
        resetHoverEffect();
        
        // Apply new hover effect
        setHoveredCubelet(cubeId);
        applyHoverEffect(intersected, intersects[0].face);
      }
    } else {
      // No intersection, reset hover
      resetHoverEffect();
    }
  }, [camera, hoveredCubelet]);

  // Apply hover effect
  const applyHoverEffect = useCallback((cubelet: any, face: any) => {
    if (!originalPositions.has(cubelet.uuid)) {
      originalPositions.set(cubelet.uuid, cubelet.position.clone());
    }
    
    // Determine pop direction based on face normal
    const normal = face.normal.clone().transformDirection(cubelet.matrixWorld);
    const popDistance = 0.15;
    
    // Animate to popped position
    const targetPosition = cubelet.position.clone().add(normal.multiplyScalar(popDistance));
    cubelet.position.lerp(targetPosition, 0.15);
  }, [originalPositions]);

  // Reset hover effect
  const resetHoverEffect = useCallback(() => {
    if (hoveredCubelet && cubeGroupRef.current) {
      originalPositions.forEach((originalPos: Vector3, uuid: string) => {
        const cubelet = cubeGroupRef.current!.children.find((child: any) => child.uuid === uuid);
        if (cubelet) {
          cubelet.position.lerp(originalPos, 0.15);
          setTimeout(() => originalPositions.delete(uuid), 300);
        }
      });
      setHoveredCubelet(null);
    }
  }, [hoveredCubelet, originalPositions]);

  // Add mouse event listener
  React.useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [gl.domElement, handleMouseMove]);

  return (
    <group ref={ambientGroupRef}>
      <group ref={cubeGroupRef}>
        {positions.map((position, index) => (
          <Cubelet 
            key={`${position[0]}-${position[1]}-${position[2]}`} 
            position={position} 
          />
        ))}
      </group>
      <group ref={rotationGroupRef} />
    </group>
  );
});