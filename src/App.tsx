import { useState, useRef } from 'react';
import type { Mesh } from 'three';
import { Scene } from './components/Scene';
import { LightSourceContext } from './contexts/LightSourceContext';
import type { RubikCubeRef } from './components/RubikCube';

function App() {
  const [lightSource, setLightSource] = useState<React.RefObject<Mesh> | null>(null);
  const [isExploded, setIsExploded] = useState(false);
  const cubeRef = useRef<RubikCubeRef | null>(null);

  const handleExplode = () => {
    setIsExploded(true);
  };
  
  return (
    <LightSourceContext.Provider value={{ lightSource, setLightSource }}>
      <Scene isExploded={isExploded} onExplode={handleExplode} cubeRef={cubeRef} />
    </LightSourceContext.Provider>
  );
}

export default App;
