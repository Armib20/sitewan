# 💥 Explosion Animation

A dramatic uniform explosion effect where all cubelets are pushed outward from
the cube's center simultaneously.

## Overview

The explosion animation creates a spectacular "cube breathing" effect that
expands all cubelets outward from the center point (0,0,0) and then smoothly
contracts them back to their original positions.

## Visual Characteristics

### Scale Effects

- **Maximum Scale**: 3x original size (2.0 wave effect + 1.0 base scale)
- **Timing**: Smooth sine wave curve (0 → 1 → 0)
- **Enhancement**: Power curve `Math.pow(intensity, 0.8)` for dramatic impact

### Position Movement

- **Direction**: Radial outward from cube center (0,0,0)
- **Distance**: 1.5 units maximum displacement
- **Calculation**: `directionFromCenter.multiplyScalar(waveEffect * 1.5)`
- **Pattern**: All cubelets move simultaneously

### Glow Effects

- **Intensity**: 1.5x multiplier for dramatic lighting
- **Color**: Bright white emissive glow
- **Timing**: Synchronized with scale animation
- **Calculation**: `Math.abs(waveEffect) * 1.5`

## Technical Implementation

### Intensity Calculation

```typescript
case 'explosion': {
  // Uniform explosion - all cubelets push outward
  const uniformIntensity = Math.sin(progress * Math.PI); // 0 → 1 → 0
  return Math.pow(uniformIntensity, 0.8); // Power curve for drama
}
```

### Position Transformation

```typescript
// Calculate direction from cube center to cubelet
const directionFromCenter = new Vector3(x, y, z).normalize();

// Apply scaled movement outward
const waveOffset = directionFromCenter.multiplyScalar(waveEffect * 1.5);

// Apply to cubelet position
const newPosition = originalPosition.add(waveOffset);
```

### Scale Animation

```typescript
// Calculate wave effect with dramatic scaling
const waveEffect = Math.sin(waveIntensity * Math.PI) * 2.0;
const finalScale = baseScale + waveEffect; // Up to 3x size
```

## Animation Timeline

| Phase           | Duration   | Effect            | Description                        |
| --------------- | ---------- | ----------------- | ---------------------------------- |
| **Expansion**   | 0-500ms    | 0 → 1.0 intensity | Cubelets scale up and move outward |
| **Peak**        | 500ms      | 1.0 intensity     | Maximum scale and displacement     |
| **Contraction** | 500-1000ms | 1.0 → 0 intensity | Return to original state           |

## Performance Characteristics

### Timing

- **Total Duration**: 1000ms (1 second)
- **Frame Rate**: 60fps via `useFrame`
- **Easing**: Sine wave with power curve enhancement

### Resource Usage

- **Calculations**: O(1) per cubelet per frame
- **Memory**: Minimal state overhead
- **Rendering**: Optimized React Spring animations

## Usage Patterns

### Triggering

- **Click**: Any cubelet click triggers explosion
- **Programmatic**: `triggerAnimation('explosion')`
- **UI Button**: Animation controls panel

### State Management

- **Blocking**: Prevents other animations during execution
- **Cleanup**: Automatic state cleanup after completion
- **Coordination**: Integrates with existing animation priority system

## Customization Options

### Intensity Modifiers

```typescript
// Increase dramatic effect
const enhancedIntensity = Math.pow(uniformIntensity, 0.6); // More dramatic

// Softer effect
const softIntensity = Math.pow(uniformIntensity, 1.2); // More gentle
```

### Movement Distance

```typescript
// Larger explosion radius
const waveOffset = directionFromCenter.multiplyScalar(waveEffect * 2.0);

// Smaller, tighter explosion
const waveOffset = directionFromCenter.multiplyScalar(waveEffect * 1.0);
```

### Scale Multipliers

```typescript
// More extreme scaling
const waveEffect = Math.sin(waveIntensity * Math.PI) * 3.0; // Up to 4x size

// Subtle scaling
const waveEffect = Math.sin(waveIntensity * Math.PI) * 1.0; // Up to 2x size
```

## Integration Notes

### React Spring Configuration

```typescript
config: { tension: 600, friction: 25 } // Optimized for explosion timing
```

### State Coordination

- Blocks face rotations during animation
- Blocks hover effects during animation
- Pauses ambient rotation during animation
- Prevents multiple simultaneous click animations

## Visual Design Philosophy

The explosion animation embodies the concept of **controlled chaos** - creating
a dramatic visual impact while maintaining perfect symmetry and timing. It
transforms the static cube into a dynamic, living entity that breathes and
pulses with energy.

The uniform nature of the explosion ensures that no single cubelet dominates the
visual hierarchy, creating a harmonious expansion that feels both natural and
spectacular.
