import React from 'react';
import { AnimationType } from './RubikCube';

interface AnimationControlsProps {
  onTriggerAnimation: (type: AnimationType) => void;
  isAnimating: boolean;
}

const animations: { type: AnimationType; name: string; emoji: string; description: string }[] = [
  { type: 'explosion', name: 'Explosion', emoji: '💥', description: 'Uniform outward explosion from center' },
  { type: 'implosion', name: 'Implosion', emoji: '🌪️', description: 'Pull inward then explosive release' },
  { type: 'spiral', name: 'Spiral', emoji: '🌀', description: 'Rotating spiral around cube axis' },
  { type: 'wave', name: 'Wave', emoji: '🌊', description: 'Sine wave traveling across cube' },
  { type: 'scatter', name: 'Scatter', emoji: '✨', description: 'Random scatter with staggered timing' },
  { type: 'orbit', name: 'Orbit', emoji: '🪐', description: 'Orbital motion around center' },
  { type: 'pulse', name: 'Pulse', emoji: '💓', description: 'Rhythmic pulsing heartbeat' },
  { type: 'twist', name: 'Twist', emoji: '🌪️', description: 'Twisting motion around center' },
];

export const AnimationControls: React.FC<AnimationControlsProps> = ({ 
  onTriggerAnimation, 
  isAnimating 
}) => {
  return (
    <div className="absolute bottom-5 left-5 z-10">
      <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 max-w-md">
        <h3 className="text-white text-lg font-bold mb-3 flex items-center gap-2">
          🎭 Cube Animations
        </h3>
        
        <div className="grid grid-cols-2 gap-2">
          {animations.map((anim) => (
            <button
              key={anim.type}
              onClick={() => onTriggerAnimation(anim.type)}
              disabled={isAnimating}
              className={`
                flex items-center gap-2 p-3 rounded-lg text-sm font-medium
                transition-all duration-200 
                ${isAnimating 
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-700 text-white hover:bg-gray-600 hover:scale-105 active:scale-95'
                }
              `}
              title={anim.description}
            >
              <span className="text-lg">{anim.emoji}</span>
              <span>{anim.name}</span>
            </button>
          ))}
        </div>
        
        {isAnimating && (
          <div className="mt-3 text-yellow-400 text-sm flex items-center gap-2">
            <div className="animate-spin w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full"></div>
            Animation in progress...
          </div>
        )}
      </div>
    </div>
  );
};