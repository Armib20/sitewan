import { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { RubikCube, type RubikCubeRef } from './RubikCube';
import { useKeyboardControls } from '../hooks/useKeyboardControls';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

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
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.3}
            luminanceSmoothing={0.9}
            height={300}
            intensity={1.5}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
};
