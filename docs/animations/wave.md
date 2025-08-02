# 🌊 Wave Animation

A smooth sine wave that travels across the cube surface, creating a flowing
water-like effect that propagates from one side to the other.

## Overview

The wave animation simulates a wave of energy traveling across the cube's
X-axis, affecting cubelets based on their distance from the current wave
position. This creates a fluid, ocean-like motion that's both visually appealing
and technically elegant.

## Visual Characteristics

### Wave Properties

- **Direction**: Travels along X-axis (left to right)
- **Wave Width**: 1 unit (affects nearby cubelets)
- **Intensity**: 0.8 maximum (strong but controlled)
- **Speed**: Crosses entire cube in 1 second

### Motion Pattern

```typescript
const wavePosition = progress * 4 - 2; // Wave travels from X=-2 to X=2
const distanceFromWave = Math.abs(x - wavePosition);
const intensity = distanceFromWave < 1
    ? Math.sin((1 - distanceFromWave) * Math.PI) * 0.8
    : 0;
```

## Technical Implementation

### Core Algorithm

```typescript
case 'wave': {
  // Sine wave across the cube
  const wavePosition = progress * 4 - 2; // Wave travels across cube
  const distanceFromWave = Math.abs(x - wavePosition);
  return distanceFromWave < 1 ? Math.sin((1 - distanceFromWave) * Math.PI) * 0.8 : 0;
}
```

### Key Components

#### Wave Position Calculation

- `progress * 4 - 2` maps 0-1 progress to -2 to +2 position range
- Covers entire cube width plus margins for smooth entry/exit
- Linear progression ensures constant wave speed

#### Distance-Based Intensity

- `Math.abs(x - wavePosition)` calculates distance to wave front
- Only cubelets within 1 unit distance are affected
- Creates localized wave effect

#### Sine Wave Profile

- `Math.sin((1 - distanceFromWave) * Math.PI)` creates smooth wave shape
- Peak intensity when `distanceFromWave = 0` (at wave center)
- Smooth falloff to zero at edges

## Animation Timeline

| Time   | Wave Position | Affected Cubelets | Description                 |
| ------ | ------------- | ----------------- | --------------------------- |
| 0ms    | X = -2        | None              | Wave starts off-screen left |
| 250ms  | X = -1        | Left edge         | Wave enters cube            |
| 500ms  | X = 0         | Center            | Wave at cube center         |
| 750ms  | X = 1         | Right edge        | Wave crossing right side    |
| 1000ms | X = 2         | None              | Wave exits off-screen right |

## Visual Effects

### Wave Shape Profile

```
Intensity
    ^
0.8 |    ∩
    |   / \
0.4 |  /   \
    | /     \
  0 |/_______\
    -1   0   1  Distance from wave center
```

### Motion Characteristics

- **Smooth Entry**: Wave gradually affects cubelets as it approaches
- **Peak Effect**: Maximum intensity when wave center aligns with cubelet
- **Smooth Exit**: Wave effect fades as wave passes
- **No Residual**: No lingering effects after wave passes

## Use Cases

### Ideal Applications

- **Data Visualization**: Showing information flow or processing
- **Attention Direction**: Guiding user focus across interface
- **Transition Effects**: Smooth state changes
- **Demonstration**: Teaching wave physics or propagation

### Visual Contexts

- **Loading States**: Progress indication
- **Success Feedback**: Completion confirmation
- **Information Flow**: Data processing visualization
- **Organic Motion**: Natural, fluid movement

## Customization Options

### Wave Direction

```typescript
// Reverse direction (right to left)
const wavePosition = 2 - progress * 4; // Wave travels from X=2 to X=-2

// Vertical wave (along Y-axis)
const wavePosition = progress * 4 - 2;
const distanceFromWave = Math.abs(y - wavePosition); // Use Y instead of X

// Diagonal wave
const wavePosition = progress * 4 - 2;
const distanceFromWave = Math.abs((x + z) - wavePosition); // Diagonal direction
```

### Wave Width

```typescript
// Wider wave (affects more cubelets)
return distanceFromWave < 1.5
    ? Math.sin((1.5 - distanceFromWave) / 1.5 * Math.PI) * 0.8
    : 0;

// Narrower wave (more focused)
return distanceFromWave < 0.5
    ? Math.sin((0.5 - distanceFromWave) / 0.5 * Math.PI) * 0.8
    : 0;
```

### Wave Speed

```typescript
// Faster wave
const wavePosition = progress * 6 - 3; // Travels faster across cube

// Slower wave
const wavePosition = progress * 3 - 1.5; // Travels slower across cube
```

### Wave Shape

```typescript
// Square wave (sharp edges)
return distanceFromWave < 1 ? 0.8 : 0;

// Triangular wave (linear falloff)
return distanceFromWave < 1 ? (1 - distanceFromWave) * 0.8 : 0;

// Gaussian wave (bell curve)
return distanceFromWave < 1
    ? Math.exp(-Math.pow(distanceFromWave, 2)) * 0.8
    : 0;
```

## Performance Characteristics

### Computational Cost

- **O(1) per cubelet**: Constant time calculation
- **Simple math**: Addition, subtraction, and sine function
- **No complex loops**: Straightforward linear calculations

### Memory Usage

- **Minimal state**: Only needs progress value
- **No caching**: Calculations done on-demand
- **Stateless**: Each frame calculated independently

## Physics Inspiration

### Wave Mechanics

The animation models real wave propagation:

- **Amplitude**: Maximum displacement (0.8 intensity)
- **Wavelength**: Width of wave effect (2 units)
- **Frequency**: Rate of oscillation (sine function)
- **Propagation**: Linear travel across medium

### Real-World Analogies

- **Water waves**: Ocean waves traveling across surface
- **Sound waves**: Audio propagation through medium
- **Light waves**: Electromagnetic wave travel
- **Seismic waves**: Earthquake energy propagation

## Design Philosophy

The wave animation represents **directed flow and progression** - showing
movement with purpose and direction. Unlike radial effects that expand outward,
the wave shows clear start and end points, making it perfect for indicating
progress, direction, or sequential processing.

The smooth sine wave profile ensures the effect feels natural and organic, while
the linear progression provides clear visual communication of movement and
timing.
