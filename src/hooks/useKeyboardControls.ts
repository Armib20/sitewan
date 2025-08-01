import { useEffect, useCallback, useRef } from 'react';
import type { RubikCubeRef } from '../components/RubikCube';

export const Face = {
  RIGHT: 'R',
  LEFT: 'L', 
  MID: 'M',
  UP: 'U',
  DOWN: 'D',
  FRONT: 'F',
  BACK: 'B',
} as const;

export type Face = (typeof Face)[keyof typeof Face];

interface UseKeyboardControlsProps {
  cubeRef: React.RefObject<RubikCubeRef>;
  isAnimating: boolean;
  setIsAnimating: (animating: boolean) => void;
  isReverse: boolean;
  setIsReverse: (reverse: boolean) => void;
  onMove?: (move: string) => void;
}

export const useKeyboardControls = ({
  cubeRef,
  isAnimating,
  setIsAnimating,
  isReverse,
  setIsReverse,
  onMove,
}: UseKeyboardControlsProps) => {
  const lastKeyTime = useRef(0);
  const KEY_COOLDOWN = 100; // milliseconds

  const animateRotation = useCallback(async (face: Face) => {
    if (!cubeRef.current || isAnimating) return;
    
    setIsAnimating(true);
    
    try {
      const direction = isReverse ? -1 : 1;
      
      switch (face) {
        case Face.RIGHT:
          await cubeRef.current.animateXFace(1.1, direction);
          break;
        case Face.LEFT:
          await cubeRef.current.animateXFace(-1.1, -direction);
          break;
        case Face.MID:
          await cubeRef.current.animateXFace(0, direction);
          break;
        case Face.UP:
          await cubeRef.current.animateYFace(1.1, direction);
          break;
        case Face.DOWN:
          await cubeRef.current.animateYFace(-1.1, -direction);
          break;
        case Face.FRONT:
          await cubeRef.current.animateZFace(1.1, direction);
          break;
        case Face.BACK:
          await cubeRef.current.animateZFace(-1.1, -direction);
          break;
      }

      const move = face + (isReverse ? "'" : '');      
      onMove?.(move);
      
    } finally {
      setIsAnimating(false);
    }
  }, [cubeRef, isAnimating, isReverse, setIsAnimating, onMove]);

  const handleKeyDown = useCallback(async (event: KeyboardEvent) => {
    if (event.ctrlKey && event.code === 'KeyZ') {
      console.log('Undo - to be implemented');
      return;
    }

    event.preventDefault();

    const currentTime = Date.now();
    if (currentTime - lastKeyTime.current < KEY_COOLDOWN) {
      return;
    }
    lastKeyTime.current = currentTime;

    if (!cubeRef.current || isAnimating) return;

    setIsAnimating(true);

    try {
      const faces = Object.values(Face);
      const randomFace = faces[Math.floor(Math.random() * faces.length)];
      const randomIsReverse = Math.random() < 0.5;
      
      setIsReverse(randomIsReverse);

      const direction = randomIsReverse ? -1 : 1;

      switch (randomFace) {
        case Face.RIGHT:
          await cubeRef.current.animateXFace(1.1, direction);
          break;
        case Face.LEFT:
          await cubeRef.current.animateXFace(-1.1, -direction);
          break;
        case Face.MID:
          await cubeRef.current.animateXFace(0, direction);
          break;
        case Face.UP:
          await cubeRef.current.animateYFace(1.1, direction);
          break;
        case Face.DOWN:
          await cubeRef.current.animateYFace(-1.1, -direction);
          break;
        case Face.FRONT:
          await cubeRef.current.animateZFace(1.1, direction);
          break;
        case Face.BACK:
          await cubeRef.current.animateZFace(-1.1, -direction);
          break;
      }

      const move = randomFace + (randomIsReverse ? "'" : '');
      onMove?.(move);

    } finally {
      setIsAnimating(false);
    }
  }, [cubeRef, isAnimating, setIsAnimating, setIsReverse, onMove]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return {
    animateRotation,
  };
};
