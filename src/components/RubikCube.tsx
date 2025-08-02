import { useRef, useCallback, forwardRef, useImperativeHandle, useState } from 'react';
import { Group, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { Cubelet } from './Cubelet';
import type { PageData } from '@/data/pageData';
import { pages } from '@/data/pageData';

interface RubikCubeProps {
  setActivePage: (page: PageData | null) => void;
  setSelectedPage: (page: PageData | null) => void;
  onExplode: () => void;
  isExploded: boolean;
}

export interface RubikCubeRef {
  animateXFace: (xpos: number, direction: number) => Promise<void>;
  animateYFace: (ypos: number, direction: number) => Promise<void>;
  animateZFace: (zpos: number, direction:number) => Promise<void>;
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

interface WaveAnimationState {
  isAnimating: boolean;
  startTime: number;
  duration: number;
  sourcePosition: [number, number, number];
  maxDistance: number;
}

export const RubikCube = forwardRef<RubikCubeRef, RubikCubeProps>(({ setActivePage, setSelectedPage, onExplode, isExploded }, ref) => {
  const ambientGroupRef = useRef<Group>(null); // For ambient rotation only
  const cubeGroupRef = useRef<Group>(null);
  const rotationGroupRef = useRef<Group>(null);
  const [animationState, setAnimationState] = useState<AnimationState | null>(null);
  const [waveAnimationState, setWaveAnimationState] = useState<WaveAnimationState | null>(null);


  const [hoveredCubelet, setHoveredCubelet] = useState<string | null>(null);
  const [rotatingCubelets, setRotatingCubelets] = useState<string[]>([]);
  const [rotationColor, setRotationColor] = useState('#FFFFFF');
  const [colorIndex, setColorIndex] = useState(0);
  const [hoveredPageIndex, setHoveredPageIndex] = useState(0);

  // Ambient rotation and hover state
  const [ambientRotationSpeed] = useState(0.002);
  const [animationDuration] = useState(350);
  const [waveAnimationDuration] = useState(1000); // Optimized duration for performance

  // 6-move rotation system with corresponding colors
  const rotationMoves = [
    { move: 'R', color: '#FF0000', axis: 'x', position: 1.1, direction: 1 },   // Right face clockwise (Red)
    { move: 'U', color: '#FFFFFF', axis: 'y', position: 1.1, direction: 1 },   // Up face clockwise (White)
    { move: 'F', color: '#00FF00', axis: 'z', position: 1.1, direction: 1 },   // Front face clockwise (Green)
    { move: "R'", color: '#FFA500', axis: 'x', position: 1.1, direction: -1 }, // Right face counter-clockwise (Orange)
    { move: "U'", color: '#FFD600', axis: 'y', position: 1.1, direction: -1 }, // Up face counter-clockwise (Yellow)
    { move: "F'", color: '#0000FF', axis: 'z', position: 1.1, direction: -1 }, // Front face counter-clockwise (Blue)
  ];

  const getNextMove = useCallback(() => {
    const moveData = rotationMoves[colorIndex];
    setColorIndex((prevIndex) => (prevIndex + 1) % rotationMoves.length);
    return moveData;
  }, [colorIndex, rotationMoves]);

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

  // Calculate distance between two positions
  const calculateDistance = useCallback((pos1: [number, number, number], pos2: [number, number, number]) => {
    const dx = pos1[0] - pos2[0];
    const dy = pos1[1] - pos2[1];
    const dz = pos1[2] - pos2[2];
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }, []);

  // Calculate wave intensity - uniform explosion from center
  const calculateWaveIntensity = useCallback((position: [number, number, number], waveState: WaveAnimationState | null): number => {
    if (!waveState) return 0;
    
    const elapsed = Date.now() - waveState.startTime;
    const progress = Math.min(elapsed / waveState.duration, 1);
    
    if (progress >= 1) return 0;
    
    // Create uniform explosion effect - all cubelets respond simultaneously from center
    // Use sine wave for smooth animation that peaks in the middle and fades out
    const uniformIntensity = Math.sin(progress * Math.PI); // 0 -> 1 -> 0 over duration
    
    // Apply power curve for more dramatic effect
    const enhancedIntensity = Math.pow(uniformIntensity, 0.8);
    
    return enhancedIntensity;
  }, []);

  // Move cubelets to rotation group for animation
  const attachToRotationGroup = useCallback((axis: 'x' | 'y' | 'z', position: number) => {
    if (!cubeGroupRef.current || !rotationGroupRef.current) return;
    
    const cubePos = new Vector3();
    const cubesToMove = cubeGroupRef.current.children.filter((child) => {
      child.getWorldPosition(cubePos);
      cubeGroupRef.current!.worldToLocal(cubePos);
      return round(cubePos[axis]) === position;
    });

    setRotatingCubelets(cubesToMove.map(c => c.name));

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
    
    // Reset rotation group and clear rotating cubelets
    rotationGroupRef.current.rotation.set(0, 0, 0);
    setRotatingCubelets([]);
  }, []);

  // Animation loop and ambient rotation
  useFrame(() => {
    // Only do ambient rotation when NOT animating face moves or exploded
    if (ambientGroupRef.current && !animationState && !hoveredCubelet && !waveAnimationState && !isExploded) {
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

    // Handle wave animation cleanup
    if (waveAnimationState) {
      const elapsed = Date.now() - waveAnimationState.startTime;
      const progress = Math.min(elapsed / waveAnimationState.duration, 1);
      
      if (progress >= 1) {
        setWaveAnimationState(null);
      }
    }
  });

  // Animate X face rotation
  const animateXFace = useCallback((xpos: number, direction: number): Promise<void> => {
    if (animationState || hoveredCubelet || waveAnimationState || isExploded) return Promise.resolve();
    
    const moveData = getNextMove();
    setRotationColor(moveData.color);
    return new Promise((resolve) => {
      attachToRotationGroup('x', xpos);
      setAnimationState({
        isAnimating: true,
        startTime: Date.now(),
        duration: animationDuration,
        axis: 'x',
        position: xpos,
        targetRotation: (Math.PI / 2) * direction,
        resolve,
      });
    });
  }, [animationState, hoveredCubelet, waveAnimationState, isExploded, attachToRotationGroup, animationDuration, getNextMove]);

  // Animate Y face rotation
  const animateYFace = useCallback((ypos: number, direction: number): Promise<void> => {
    if (animationState || hoveredCubelet || waveAnimationState || isExploded) return Promise.resolve();
    
    const moveData = getNextMove();
    setRotationColor(moveData.color);
    return new Promise((resolve) => {
      attachToRotationGroup('y', ypos);
      setAnimationState({
        isAnimating: true,
        startTime: Date.now(),
        duration: animationDuration,
        axis: 'y',
        position: ypos,
        targetRotation: (Math.PI / 2) * direction,
        resolve,
      });
    });
  }, [animationState, hoveredCubelet, waveAnimationState, isExploded, attachToRotationGroup, animationDuration, getNextMove]);

  // Animate Z face rotation
  const animateZFace = useCallback((zpos: number, direction: number): Promise<void> => {
    if (animationState || hoveredCubelet || waveAnimationState || isExploded) return Promise.resolve();
    
    const moveData = getNextMove();
    setRotationColor(moveData.color);
    return new Promise((resolve) => {
      attachToRotationGroup('z', zpos);
      setAnimationState({
        isAnimating: true,
        startTime: Date.now(),
        duration: animationDuration,
        axis: 'z',
        position: zpos,
        targetRotation: (Math.PI / 2) * direction,
        resolve,
      });
    });
  }, [animationState, hoveredCubelet, waveAnimationState, isExploded, attachToRotationGroup, animationDuration, getNextMove]);

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
    isAnimating: !!animationState || !!waveAnimationState,
  }), [animateXFace, animateYFace, animateZFace, resetCube, animationState, waveAnimationState]);

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

  const handleHover = useCallback((id: string | null) => {
    if (isExploded || waveAnimationState) return;
    setHoveredCubelet(id);
    if (id) {
      const page = pages[hoveredPageIndex];
      setActivePage(page);
      setHoveredPageIndex((prevIndex) => (prevIndex + 1) % pages.length);
    } else {
      setActivePage(null);
    }
  }, [setActivePage, hoveredPageIndex, isExploded, waveAnimationState]);

  const handleClick = useCallback((_id: string, _clickPosition: [number, number, number]) => {
    if (animationState || waveAnimationState || isExploded) return;
    
    // Create uniform explosion from cube center - position doesn't matter
    setWaveAnimationState({
      isAnimating: true,
      startTime: Date.now(),
      duration: waveAnimationDuration,
      sourcePosition: [0, 0, 0], // Always from center
      maxDistance: 1, // Not used in uniform explosion
    });
  }, [animationState, waveAnimationState, isExploded, waveAnimationDuration]);



  return (
    <group ref={ambientGroupRef}>
      <group ref={cubeGroupRef}>
        {positions.map((position) => {
          const id = `${position[0]}-${position[1]}-${position[2]}`;
          return (
            <Cubelet
              key={id}
              name={id}
              id={id}
              position={position}
              onHover={handleHover}
              isHovered={hoveredCubelet === id}
              isRotating={rotatingCubelets.includes(id)}
              rotationColor={rotationColor}
              isBlocked={!!animationState || !!waveAnimationState || isExploded}
              isExploded={isExploded}
              onClick={handleClick}
              waveIntensity={calculateWaveIntensity(position, waveAnimationState)}
            />
          );
        })}
      </group>
      <group ref={rotationGroupRef} />
    </group>
  );
});
