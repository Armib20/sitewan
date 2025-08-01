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

interface KeyAction {
  action: () => Promise<void>;
  face?: Face;
}

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
      
      // Start the animation based on face
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

      // Send move to backend after animation completes
      const move = face + (isReverse ? "'" : '');      
      onMove?.(move);
      
    } finally {
      setIsAnimating(false);
    }
  }, [cubeRef, isAnimating, isReverse, setIsAnimating, onMove]);

  const keyActions: Record<string, KeyAction> = {
    'KeyR': {
      action: () => animateRotation(Face.RIGHT),
      face: Face.RIGHT,
    },
    'KeyL': {
      action: () => animateRotation(Face.LEFT),
      face: Face.LEFT,
    },
    'KeyM': {
      action: () => animateRotation(Face.MID),
      face: Face.MID,
    },
    'KeyU': {
      action: () => animateRotation(Face.UP),
      face: Face.UP,
    },
    'KeyD': {
      action: () => animateRotation(Face.DOWN),
      face: Face.DOWN,
    },
    'KeyF': {
      action: () => animateRotation(Face.FRONT),
      face: Face.FRONT,
    },
    'KeyB': {
      action: () => animateRotation(Face.BACK),
      face: Face.BACK,
    },
    'Digit1': {
      action: async () => setIsReverse(false),
    },
    'Digit2': {
      action: async () => setIsReverse(true),
    },
  };

  const handleKeyDown = useCallback(async (event: KeyboardEvent) => {
    const keyAction = keyActions[event.code];
    if (!keyAction) return;

    // Prevent browser defaults for relevant keys
    event.preventDefault();

    // Enforce cooldown for face rotations
    const currentTime = Date.now();
    const isFaceRotation = keyAction.face != null;
    const isDirectionChange = event.code === 'Digit1' || event.code === 'Digit2';
    
    if (!event.ctrlKey && !isDirectionChange && isFaceRotation && 
        (currentTime - lastKeyTime.current < KEY_COOLDOWN)) {
      console.log('Too quick! In cooldown.');
      return;
    }
    
    if (isFaceRotation) {
      lastKeyTime.current = currentTime;
    }

    // Handle undo with Ctrl+Z
    if (event.ctrlKey && event.code === 'KeyZ') {
      // TODO: Implement undo functionality
      console.log('Undo - to be implemented');
      return;
    }

    await keyAction.action();
  }, [keyActions, isAnimating]);

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