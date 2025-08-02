# Cube Animation System

The Rubik's cube features a comprehensive animation system with multiple
interaction types and visual effects.

## Core Animation Types

### 1. Face Rotation Animations

**Purpose**: Cube manipulation and solving

- Attach/animate/detach pattern for clean transformations
- 90-degree rotations on X, Y, Z axes
- Easing functions for smooth motion
- Promise-based for async/await support

### 2. Hover Effects

**Purpose**: Interactive feedback

- Scale and position animations using React Spring
- Direction-based movement from cube center
- Emissive glow effects for visual feedback
- Smooth transitions between hover states

### 3. Click Animations

**Purpose**: Dramatic visual responses

- 8 different animation types available
- Uniform timing and intensity calculations
- Configurable effects and parameters
- UI controls for easy triggering

## Click Animation Types

### 💥 Explosion

Uniform outward push from cube center

- All cubelets move simultaneously
- Sine wave timing for smooth expansion/contraction
- Up to 3x scale increase
- 1.5 units outward movement

### 🌪️ Implosion

Pull inward then explosive release

- Two-phase animation (compress → explode)
- Initial inward pull (-0.5 intensity)
- Followed by dramatic outward expansion (1.2x intensity)
- Creates anticipation effect

### 🌀 Spiral

Rotating spiral around cube axis

- Position-based rotation calculations
- Spiral propagation using angle calculations
- Smooth circular motion patterns
- Distance-modulated intensity

### 🌊 Wave

Sine wave traveling across cube

- Linear wave propagation across X-axis
- Position-based intensity calculation
- Smooth wave front with 1-unit width
- Creates flowing motion effect

### ✨ Scatter

Random scatter with staggered timing

- Deterministic "random" delays per cubelet
- 0-0.5 second staggered start times
- Individual sine wave curves
- Creates organic, natural motion

### 🪐 Orbit

Orbital motion around center

- Circular orbital paths
- Distance-based intensity scaling
- Continuous rotational motion
- 2π rotation per animation cycle

### 💓 Pulse

Rhythmic pulsing heartbeat

- Multiple pulse cycles per animation
- Sine wave frequency modulation
- Rhythmic scaling effects
- Creates living, breathing effect

### 🌪️ Twist

Twisting motion around center

- Rotation around vertical axis
- Distance-based twist amount
- Continuous spiral motion
- Creates vortex-like effect

## Animation State Management

### State Hierarchy

1. **Face Rotations** (Highest Priority)
2. **Click Animations** (High Priority)
3. **Hover Effects** (Medium Priority)
4. **Ambient Rotation** (Lowest Priority)

### Blocking Logic

```typescript
const canRotate = !animationState && !hoveredCubelet && !clickAnimationState;
const canAnimate = !animationState && !clickAnimationState;
const canHover = !animationState && !clickAnimationState;
const canAmbient = !animationState && !hoveredCubelet && !clickAnimationState;
```

## Implementation Architecture

### Animation State Interface

```typescript
interface AnimationState {
    isAnimating: boolean;
    startTime: number;
    duration: number; // 1000ms default
    type: AnimationType;
    sourcePosition: [number, number, number];
    maxDistance: number;
}
```

### Intensity Calculation

```typescript
const calculateAnimationIntensity = (position, animState) => {
    const progress = (Date.now() - animState.startTime) / animState.duration;

    switch (animState.type) {
        case "explosion":
            return Math.pow(Math.sin(progress * Math.PI), 0.8);
            // ... other animation types
    }
};
```

### Visual Effects Application

```typescript
// Scale animation (up to 3x size)
const waveEffect = Math.sin(waveIntensity * Math.PI) * 2.0;
const finalScale = baseScale + waveEffect;

// Position animation (1.5 units outward)
const directionFromCenter = new Vector3(x, y, z).normalize();
const waveOffset = directionFromCenter.multiplyScalar(waveEffect * 1.5);

// Emissive glow (1.5x intensity)
const targetEmissive = Math.abs(waveEffect) * 1.5;
```

## Performance Optimizations

### React Spring Configuration

- **tension: 600** - Responsive but stable
- **friction: 25** - Smooth damping
- **No clamp** - Allows free animation updates

### Efficient State Updates

- Single animation state per cubelet
- Calculated intensities cached per frame
- Minimal re-renders during animations
- useFrame for 60fps updates

### Memory Management

- Clean animation state cleanup
- Stable function references with useCallback
- Memoized expensive calculations
- Proper dependency arrays

## UI Controls

### Animation Controls Component

- Grid layout with 8 animation buttons
- Visual feedback with emojis and descriptions
- Disabled state during active animations
- Hover effects and scaling transitions

### Button States

- **Normal**: Interactive with hover effects
- **Disabled**: Grayed out during animations
- **Active**: Visual feedback during execution
- **Loading**: Spinner indicator when busy

## Technical Notes

### Critical Fixes Applied

1. **React Spring clamp removal** - Enabled proper value updates
2. **Reset conflict resolution** - Prevented interference with animations
3. **State coordination** - Proper blocking between animation types
4. **Performance optimization** - Reduced calculation overhead

### Future Enhancements

- Custom animation parameters
- Animation chaining and sequences
- Easing function customization
- Performance profiling tools
