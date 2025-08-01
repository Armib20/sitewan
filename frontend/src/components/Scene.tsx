import { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { RubikCube, type RubikCubeRef } from './RubikCube';
import { useKeyboardControls } from '../hooks/useKeyboardControls';

export const Scene: React.FC = () => {
  const cubeRef = useRef<RubikCubeRef>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isReverse, setIsReverse] = useState(false);
  const [lastMove, setLastMove] = useState<string>('');

  // Initialize keyboard controls
  useKeyboardControls({
    cubeRef: cubeRef as React.RefObject<RubikCubeRef>,
    isAnimating: cubeRef.current?.isAnimating || isAnimating,
    setIsAnimating,
    isReverse,
    setIsReverse,
    onMove: setLastMove,
  });

  const handleReset = async () => {
    const isCurrentlyAnimating = cubeRef.current?.isAnimating || isAnimating;
    if (cubeRef.current && !isCurrentlyAnimating) {
      cubeRef.current.resetCube();
      // Also reset backend state
      const { RubikAPI } = await import('../services/api');
      await RubikAPI.resetCube();
      setLastMove('');
    }
  };

  const handleSolve = async () => {
    const isCurrentlyAnimating = cubeRef.current?.isAnimating || isAnimating;
    if (isCurrentlyAnimating) return;
    
    try {
      const { RubikAPI } = await import('../services/api');
      const solution = await RubikAPI.getSolution();
      
      if (solution && solution.parsedMoves.length > 0) {
        console.log('Solution:', solution.solutionString);
        console.log('Moves:', solution.parsedMoves);
        // TODO: Implement solution playback
      } else {
        console.log('Cube is already solved!');
      }
    } catch (error) {
      console.error('Error getting solution:', error);
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000000' }}>
      {/* Controls UI */}
      <div style={{ 
        position: 'absolute', 
        top: '20px', 
        left: '20px', 
        zIndex: 10,
        color: 'white',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h2>Key Bindings</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>Front: 'F' / Back: 'B'</li>
          <li>Left: 'L' / Right: 'R'</li>
          <li>Up: 'U' / Down: 'D'</li>
          <li>Middle: 'M'</li>
          <li>Forward: '1' / Reverse: '2'</li>
        </ul>
        
        <div style={{ marginTop: '20px' }}>
          <button 
            onClick={handleReset}
            disabled={cubeRef.current?.isAnimating || isAnimating}
            style={{
              marginRight: '10px',
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: (cubeRef.current?.isAnimating || isAnimating) ? 'not-allowed' : 'pointer',
              opacity: (cubeRef.current?.isAnimating || isAnimating) ? 0.6 : 1,
            }}
          >
            Reset
          </button>
          
          <button 
            onClick={handleSolve}
            disabled={cubeRef.current?.isAnimating || isAnimating}
            style={{
              padding: '8px 16px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: (cubeRef.current?.isAnimating || isAnimating) ? 'not-allowed' : 'pointer',
              opacity: (cubeRef.current?.isAnimating || isAnimating) ? 0.6 : 1,
            }}
          >
            Solve
          </button>
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <div>Direction: {isReverse ? 'Counter-clockwise' : 'Clockwise'}</div>
          {lastMove && <div>Last Move: {lastMove}</div>}
          {(cubeRef.current?.isAnimating || isAnimating) && <div>Animating...</div>}
        </div>
      </div>

      {/* Three.js Canvas */}
      <Canvas
        camera={{ 
          position: [15, 10, 10], 
          fov: 20,
          near: 0.1,
          far: 1000 
        }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.6} color={0x606060} />
        <pointLight 
          position={[0, 4, 2]} 
          intensity={1} 
          color={0xffffff} 
        />
        
        {/* Orbit Controls */}
        <OrbitControls 
          enableDamping
          dampingFactor={0.2}
          autoRotate={false}
        />
        
        {/* Rubik's Cube */}
        <RubikCube ref={cubeRef} />
        
        {/* Helper axes (for debugging - can be removed) */}
        {/* <axesHelper args={[4]} /> */}
      </Canvas>
    </div>
  );
};