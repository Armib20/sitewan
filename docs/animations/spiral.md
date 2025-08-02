# 🌀 Spiral Animation

A mesmerizing spiral rotation effect where cubelets move in a coordinated
helical pattern around the cube's central axis.

## Overview

The spiral animation creates a hypnotic rotating motion that follows a spiral
pattern, with each cubelet's timing based on its angular position around the
cube center. This creates a beautiful flowing motion that resembles a galaxy or
whirlpool.

## Visual Characteristics

### Motion Pattern

- **Direction**: Rotational spiral around Y-axis
- **Intensity**: 0.6 maximum (moderate effect for smooth flow)
- **Pattern**: Position-based timing using angular calculations
- **Flow**: Continuous helical motion

### Mathematical Foundation

```typescript
const distance = Math.sqrt(x * x + y * y + z * z); // Distance from center
const angle = Math.atan2(z, x); // Angular position
const spiralProgress = (progress + angle / (Math.PI * 2)) % 1; // Phase shift by angle
const intensity = Math.sin(spiralProgress * Math.PI * 2) * 0.6;
```

## Technical Implementation

### Intensity Calculation

```typescript
case 'spiral': {
  // Spiral rotation around cube
  const distance = Math.sqrt(x*x + y*y + z*z);
  const angle = Math.atan2(z, x); // Calculate angle in XZ plane
  const spiralProgress = (progress + angle / (Math.PI * 2)) % 1;
  return Math.sin(spiralProgress * Math.PI * 2) * 0.6;
}
```

### Key Components

#### Angular Phase Shift

- Each cubelet's animation is offset by its angular position
- `angle / (Math.PI * 2)` converts radians to 0-1 range
- Creates staggered timing that flows around the cube

#### Continuous Wave

- `Math.sin(spiralProgress * Math.PI * 2)` creates full sine wave
- Frequency of 2 creates smooth continuous motion
- Results in flowing spiral pattern

#### Distance Modulation

- Distance calculation available for advanced effects
- Can be used to modify intensity based on radius
- Currently uniform across all distances

## Animation Characteristics

### Timing

- **Wave Frequency**: 2 full cycles per animation
- **Phase Distribution**: 360° spread across cube
- **Smoothness**: Continuous sine wave motion
- **Direction**: Clockwise when viewed from above

### Visual Flow

- **Start**: Animation begins at angular position 0 (positive X-axis)
- **Propagation**: Flows around cube in angular order
- **Completion**: Full spiral cycle every 500ms
- **Overlap**: Multiple wave fronts visible simultaneously

## Use Cases

### Best Applications

- **Mesmerizing Effects**: Hypnotic, calming animations
- **Transition States**: Smooth state changes
- **Background Motion**: Subtle ongoing activity
- **Flow Visualization**: Showing data or energy flow

### Visual Appeal

- **Organic Motion**: Feels natural and fluid
- **Continuous Flow**: Never jarring or abrupt
- **Balanced Coverage**: All cubelets participate equally
- **Rhythmic Pattern**: Predictable yet engaging

## Customization Options

### Frequency Adjustment

```typescript
// Faster spiral (more waves)
return Math.sin(spiralProgress * Math.PI * 4) * 0.6; // 4 cycles

// Slower spiral (fewer waves)
return Math.sin(spiralProgress * Math.PI * 1) * 0.6; // 1 cycle
```

### Direction Control

```typescript
// Counter-clockwise spiral
const spiralProgress = (progress - angle / (Math.PI * 2)) % 1; // Subtract angle

// Vertical spiral (around Y-axis)
const angle = Math.atan2(x, z); // Different axis calculation
```

### Distance-Based Effects

```typescript
// Stronger effect for outer cubelets
const distanceMultiplier = Math.min(distance / 1.5, 1); // Scale by distance
return Math.sin(spiralProgress * Math.PI * 2) * 0.6 * distanceMultiplier;

// Center-focused effect
const centerFade = 1 - (distance / 2); // Fade with distance
return Math.sin(spiralProgress * Math.PI * 2) * 0.6 * centerFade;
```

### Intensity Variations

```typescript
// More dramatic spiral
return Math.sin(spiralProgress * Math.PI * 2) * 0.9; // Higher intensity

// Subtle spiral
return Math.sin(spiralProgress * Math.PI * 2) * 0.3; // Lower intensity
```

## Performance Notes

### Computational Efficiency

- **Math.sqrt()**: One calculation per cubelet per frame
- **Math.atan2()**: One calculation per cubelet per frame
- **Trigonometry**: Optimized sine wave calculations
- **Modulo Operation**: Efficient phase wrapping

### Visual Smoothness

- **High Frequency**: Creates smooth motion appearance
- **Continuous Calculation**: No discrete steps or jumps
- **Predictable Pattern**: Browser can optimize rendering

## Integration Considerations

### State Coordination

- Respects global animation blocking
- Integrates with existing animation priority system
- Maintains smooth transitions between states

### Performance Impact

- Moderate computational cost
- Suitable for continuous or repeated use
- Smooth enough for background effects

## Design Philosophy

The spiral animation embodies **flow and continuity** - creating motion that
feels organic and endless. Unlike explosive effects that have clear start and
end points, the spiral creates a sense of perpetual motion that can be both
calming and engaging.

The mathematical foundation ensures perfect symmetry and timing, while the
angular distribution creates visual interest that never becomes repetitive or
boring. This makes it ideal for situations where you want subtle, beautiful
motion without overwhelming the user.
