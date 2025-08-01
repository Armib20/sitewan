import { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { RubikCube, type RubikCubeRef } from './RubikCube';
import { useKeyboardControls } from '../hooks/useKeyboardControls';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import type { PageData } from '../data/pageData';
import { a, useSpring } from '@react-spring/web';
import { PagePreview } from './PagePreview';

export const Scene: React.FC = () => {
  const cubeRef = useRef<RubikCubeRef>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isReverse, setIsReverse] = useState(false);
  const [activePage, setActivePage] = useState<PageData | null>(null);
  const [selectedPage, setSelectedPage] = useState<PageData | null>(null);

  const styles = useSpring({
    opacity: activePage ? 1 : 0,
    transform: activePage ? 'translateY(0)' : 'translateY(-20px)',
  });

  useKeyboardControls({
    cubeRef: cubeRef as React.RefObject<RubikCubeRef>,
    isAnimating: cubeRef.current?.isAnimating || isAnimating,
    setIsAnimating,
    isReverse,
    setIsReverse,
  });

  return (
    <div className="w-screen h-screen bg-black">
      {/* Name */}
      <div className="absolute top-5 left-5 z-10 font-sans">
        <h1 style={{ color: 'white', fontSize: '2.25rem', fontWeight: 'bold', fontFamily: "'Cormorant Garamond', serif", padding: "1rem", margin: "0.5rem" }}>Ali Rizwan</h1>
      </div>

      {/* Page Info */}
      <a.div
        style={{
          ...styles,
          position: 'absolute',
          top: '1.25rem',
          right: '1.25rem',
          zIndex: 10,
          color: 'white',
          fontFamily: 'sans-serif',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          width: '16rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        {activePage && (
          <>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{activePage.title}</h2>
            <p style={{ fontSize: '1rem' }}>{activePage.description}</p>
          </>
        )}
      </a.div>


      {/* Page Content */}
      {selectedPage && (
        <PagePreview page={selectedPage} onBack={() => setSelectedPage(null)} />
      )}

      {/* Three.js Canvas */}
      <div className={`w-full h-full ${selectedPage ? 'hidden' : 'block'}`}>
        <Canvas
          camera={{
            position: [15, 10, 10],
            fov: 20,
            near: 0.1,
            far: 1000,
          }}
        >
          {/* Lighting */}
          <ambientLight intensity={0.6} color={0x606060} />
          <pointLight position={[0, 4, 2]} intensity={1} color={0xffffff} />

          {/* Orbit Controls */}
          <OrbitControls enableDamping dampingFactor={0.2} autoRotate={false} />

          {/* Rubik's Cube */}
          <RubikCube ref={cubeRef} setActivePage={setActivePage} setSelectedPage={setSelectedPage} />

          {/* Effects */}
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
    </div>
  );
};
