import { useRef, useCallback, forwardRef, useImperativeHandle, useState } from 'react';
import { Group, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { Cubelet } from './Cubelet';
import type { PageData } from '@/data/pageData';
import { pages } from '@/data/pageData';

interface RubikCubeProps {
  setActivePage: (page: PageData | null) => void;
  setSelectedPage: (page: PageData | null) => void;
}

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

export const RubikCube = forwardRef<RubikCubeRef, RubikCubeProps>(({ setActivePage, setSelectedPage }, ref) => {
  const ambientGroupRef = useRef<Group>(null); // For ambient rotation only
  const cubeGroupRef = useRef<Group>(null);
  const rotationGroupRef = useRef<Group>(null);
  const [animationState, setAnimationState] = useState<AnimationState | null>(null);
  const [hoveredCubelet, setHoveredCubelet] = useState<string | null>(null);
  const [rotatingCubelets, setRotatingCubelets] = useState<string[]>([]);
  const [rotationColor, setRotationColor] = useState('#FFFFFF');
  const [colorIndex, setColorIndex] = useState(0);
  const [hoveredPageIndex, setHoveredPageIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState<PageData | null>(null);

  // Ambient rotation and hover state
  const [ambientRotationSpeed] = useState(0.002);
  const [animationDuration] = useState(350);

  const neonPalette = [
    '#FFFFFF', // White
    '#FF0000', // Red
    '#0000FF', // Blue
    '#FFA500', // Orange
    '#00FF00', // Green
    '#FFD600'  // Yellow
  ];

  const getNextColor = () => {
    const color = neonPalette[colorIndex];
    setColorIndex((prevIndex) => (prevIndex + 1) % neonPalette.length);
    return color;
  };

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
    // Only do ambient rotation when NOT animating face moves
        if (ambientGroupRef.current && !animationState && !hoveredCubelet) {
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
        if (animationState || hoveredCubelet) return Promise.resolve();
    
    setRotationColor(getNextColor());
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
  }, [animationState, hoveredCubelet, attachToRotationGroup, animationDuration]);

  // Animate Y face rotation
  const animateYFace = useCallback((ypos: number, direction: number): Promise<void> => {
        if (animationState || hoveredCubelet) return Promise.resolve();
    
    setRotationColor(getNextColor());
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
  }, [animationState, hoveredCubelet, attachToRotationGroup, animationDuration]);

  // Animate Z face rotation
  const animateZFace = useCallback((zpos: number, direction: number): Promise<void> => {
        if (animationState || hoveredCubelet) return Promise.resolve();
    
    setRotationColor(getNextColor());
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
  }, [animationState, hoveredCubelet, attachToRotationGroup, animationDuration]);

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

  const handleHover = useCallback((id: string | null) => {
    setHoveredCubelet(id);
    if (id) {
      const page = pages[hoveredPageIndex];
      setActivePage(page);
      setCurrentPage(page);
      setHoveredPageIndex((prevIndex) => (prevIndex + 1) % pages.length);
    } else {
      setActivePage(null);
      setCurrentPage(null);
    }
  }, [setActivePage, hoveredPageIndex]);

  const handleClick = () => {
    if (currentPage) {
      setSelectedPage(currentPage);
    }
  };

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
              isBlocked={!!animationState}
              onClick={handleClick}
            />
          );
        })}
      </group>
      <group ref={rotationGroupRef} />
    </group>
  );
});
