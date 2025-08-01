import { useEffect, useCallback, useState } from 'react';
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

type QueuedMove = {
  face: Face;
  isReverse: boolean;
};

export const useKeyboardControls = ({
  cubeRef,
  isAnimating,
  setIsAnimating,
  isReverse,
  onMove,
}: UseKeyboardControlsProps) => {
  const [moveQueue, setMoveQueue] = useState<QueuedMove[]>([]);

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

    const faces = Object.values(Face);
    const randomFace = faces[Math.floor(Math.random() * faces.length)];
    const randomIsReverse = Math.random() < 0.5;
    
    setMoveQueue((prev) => [...prev, { face: randomFace, isReverse: randomIsReverse }]);
  }, []);

  useEffect(() => {
    const processQueue = async () => {
      if (isAnimating || moveQueue.length === 0) return;

      const nextMove = moveQueue[0];
      setMoveQueue((prev) => prev.slice(1));

      setIsAnimating(true);

      try {
        if (cubeRef.current) {
          const direction = nextMove.isReverse ? -1 : 1;
          const face = nextMove.face;

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
          const move = face + (nextMove.isReverse ? "'" : "");
          onMove?.(move);
        }
      } finally {
        setIsAnimating(false);
      }
    };
    processQueue();
  }, [moveQueue, isAnimating, cubeRef, setIsAnimating, onMove]);

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
