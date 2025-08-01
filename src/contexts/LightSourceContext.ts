import React from 'react';
import type { Mesh } from 'three';

interface LightSourceContextType {
  lightSource: React.RefObject<Mesh> | null;
  setLightSource: (ref: React.RefObject<Mesh> | null) => void;
}

export const LightSourceContext = React.createContext<LightSourceContextType>({
  lightSource: null,
  setLightSource: () => {},
});
