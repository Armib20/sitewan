import { useState } from 'react';
import type { Mesh } from 'three';
import { Scene } from './components/Scene';
import { LightSourceContext } from './contexts/LightSourceContext';

function App() {
  const [lightSource, setLightSource] = useState<React.RefObject<Mesh> | null>(null);
  
  return (
    <LightSourceContext.Provider value={{ lightSource, setLightSource }}>
      <Scene />
    </LightSourceContext.Provider>
  );
}

export default App;
