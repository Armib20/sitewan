import { useRef, useState, useContext } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { RubikCube, type RubikCubeRef } from './RubikCube';
import { useKeyboardControls } from '../hooks/useKeyboardControls';
import { EffectComposer, Bloom, GodRays } from '@react-three/postprocessing';
import type { PageData } from '../data/pageData';
import { a, useSpring } from '@react-spring/web';
import { PagePreview } from './PagePreview';
import { LightSourceContext } from '../contexts/LightSourceContext';

interface SceneProps {
  isExploded: boolean;
  onExplode: () => void;
  cubeRef: React.RefObject<RubikCubeRef | null>;
}

export const Scene: React.FC<SceneProps> = ({ isExploded, onExplode, cubeRef }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isReverse, setIsReverse] = useState(false);
  const [activePage, setActivePage] = useState<PageData | null>(null);
  const [selectedPage, setSelectedPage] = useState<PageData | null>(null);
  const { lightSource } = useContext(LightSourceContext);
  const centralSunRef = useRef<any>(null!);

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
        <h1 style={{ color: 'white', fontSize: '5rem', fontWeight: 'bold', fontFamily: "'Cormorant Garamond', serif", padding: "1rem", margin: "0.5rem" }}>Ali Rizwan</h1>
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
          // Performance optimizations for smoother animations
          frameloop="always"
          dpr={[1, 2]} // Limit device pixel ratio for performance
          performance={{ min: 0.8 }} // Maintain 80% performance minimum
          gl={{
            antialias: false, // Disable for better performance - post-processing handles this
            alpha: false,
            powerPreference: "high-performance"
          }}
        >
          {/* Optimized Lighting */}
          <pointLight position={[0, 4, 2]} intensity={0.3} color={0xffffff} />
          {/* Additional ambient for better base visibility - performance friendly */}
          <ambientLight intensity={0.15} color={0x404040} />
          
          {/* Central sun - always present for proper ref */}
          <mesh ref={centralSunRef} position={[0, 0, 0]} visible={isExploded}>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshBasicMaterial 
              color={0xffffff} 
              toneMapped={false}
              transparent={false}
            />
          </mesh>
          
          {isExploded && (
            <pointLight position={[0, 0, 0]} intensity={2.5} color={0xffffff} />
          )}

          {/* Orbit Controls */}
          <OrbitControls enableDamping dampingFactor={0.2} autoRotate={false} />

          {/* Rubik's Cube */}
          <RubikCube 
            ref={cubeRef} 
            setActivePage={setActivePage} 
            setSelectedPage={setSelectedPage}
            onExplode={onExplode} 
            isExploded={isExploded}
          />

          {/* Optimized Effects - Lighter processing for better performance */}
          {(lightSource && lightSource.current) || isExploded ? (
            <EffectComposer
              stencilBuffer={false}
              depthBuffer={true}
              multisampling={0}
            >
              <GodRays 
                sun={isExploded ? centralSunRef.current : lightSource!.current} 
                blur={true}
                samples={isExploded ? 60 : 30}
                density={0.95}
                decay={0.95}
                weight={isExploded ? 0.6 : 0.3}
                exposure={isExploded ? 0.35 : 0.2}
              />
              <Bloom
                luminanceThreshold={0.98}
                luminanceSmoothing={0.05}
                height={150}
                intensity={1.5}
                kernelSize={1}
                levels={5}
              />
            </EffectComposer>
          ) : (
            <EffectComposer
              stencilBuffer={false}
              depthBuffer={true}
              multisampling={0}
            >
              <Bloom
                luminanceThreshold={0.98}
                luminanceSmoothing={0.05}
                height={150}
                intensity={0.8}
                kernelSize={1}
                levels={5}
              />
            </EffectComposer>
          )}
        </Canvas>
      </div>
    </div>
  );
};
