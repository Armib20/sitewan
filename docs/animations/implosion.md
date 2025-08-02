# 🌪️ Implosion Animation

A two-phase animation that first pulls cubelets inward toward the center, then
releases them in a dramatic outward explosion.

## Overview

The implosion animation creates anticipation through compression before
delivering a powerful release. This creates a "charging up" effect that builds
tension before the dramatic payoff.

## Visual Characteristics

### Phase 1: Compression (0-30% of animation)

- **Direction**: Inward toward cube center
- **Intensity**: -0.5 (negative for inward movement)
- **Duration**: 300ms
- **Effect**: Cubelets pulled toward center, slight scale reduction

### Phase 2: Explosion (30-100% of animation)

- **Direction**: Outward from cube center
- **Intensity**: Up to 1.2 (stronger than standard explosion)
- **Duration**: 700ms
- **Effect**: Powerful outward expansion with enhanced scaling

## Technical Implementation

### Intensity Calculation

```typescript
case 'implosion': {
  // Two-phase animation: pull in then push out
  const phase1 = progress < 0.3 ? progress / 0.3 : 0; // Pull in phase (0-30%)
  const phase2 = progress > 0.3 ? (progress - 0.3) / 0.7 : 0; // Push out phase (30-100%)
  
  // Phase 1: Negative intensity for inward pull
  if (phase1 > 0) {
    return -phase1 * 0.5; // Pull inward
  }
  
  // Phase 2: Enhanced outward explosion
  return Math.sin(phase2 * Math.PI) * 1.2; // Stronger than normal explosion
}
```

### Position Transformation

```typescript
// Same directional calculation as explosion
const directionFromCenter = new Vector3(x, y, z).normalize();

// But intensity can be negative (inward) or positive (outward)
const waveOffset = directionFromCenter.multiplyScalar(waveEffect * 1.5);

// Negative waveEffect pulls cubelets toward center
// Positive waveEffect pushes cubelets outward
```

## Animation Timeline

| Phase           | Time       | Intensity   | Effect        | Description                     |
| --------------- | ---------- | ----------- | ------------- | ------------------------------- |
| **Compression** | 0-300ms    | 0 → -0.5    | Inward pull   | Cubelets compress toward center |
| **Transition**  | 300ms      | 0           | Brief pause   | Moment of maximum compression   |
| **Explosion**   | 300-1000ms | 0 → 1.2 → 0 | Outward blast | Enhanced explosion effect       |

## Psychological Impact

### Anticipation Building

- The initial compression creates visual tension
- Users intuitively expect a "release" after compression
- The pause at maximum compression heightens anticipation

### Enhanced Payoff

- The explosion phase is 20% stronger than standard explosion
- The contrast with compression makes expansion feel more dramatic
- Creates a satisfying "spring-loaded" effect

## Performance Characteristics

### Computational Efficiency

- **Dual Phase Logic**: Simple conditional branching
- **Shared Calculations**: Reuses explosion math for phase 2
- **Optimized Timing**: Single progress calculation drives both phases

### Visual Smoothness

- **Continuous Motion**: No jarring transitions between phases
- **Sine Wave Curves**: Natural acceleration/deceleration
- **Power Scaling**: Enhanced dramatic effect

## Usage Scenarios

### Best For

- **Dramatic Reveals**: Building anticipation before showing content
- **User Feedback**: Confirming important actions
- **Attention Grabbing**: Most visually striking animation
- **Energy Building**: Creating excitement and engagement

### Avoid When

- **Frequent Use**: Can become overwhelming if overused
- **Subtle Interactions**: Too dramatic for minor actions
- **Performance Critical**: Slightly more expensive than simpler animations

## Customization Parameters

### Phase Timing

```typescript
// Longer compression phase for more anticipation
const phase1 = progress < 0.4 ? progress / 0.4 : 0; // 40% compression
const phase2 = progress > 0.4 ? (progress - 0.4) / 0.6 : 0; // 60% explosion

// Shorter compression for quicker payoff
const phase1 = progress < 0.2 ? progress / 0.2 : 0; // 20% compression
const phase2 = progress > 0.2 ? (progress - 0.2) / 0.8 : 0; // 80% explosion
```

### Intensity Modulation

```typescript
// Stronger compression
return -phase1 * 0.8; // Pull in further

// More explosive release
return Math.sin(phase2 * Math.PI) * 1.5; // Even more dramatic
```

### Visual Variations

```typescript
// Scale compression during phase 1
const compressionScale = 1 - (phase1 * 0.2); // Slightly smaller during compression

// Enhanced glow during explosion phase
const explosionGlow = phase2 > 0 ? phase2 * 2.0 : 0; // Only glow during explosion
```

## Integration Notes

### State Management

- Uses same animation state structure as other types
- Requires no special cleanup or coordination
- Blocks other animations during both phases

### UI Feedback

- Button should remain disabled for full duration
- Loading indicators should span both phases
- Visual feedback should reflect the two-phase nature

## Design Philosophy

The implosion animation embodies the principle of **tension and release** - a
fundamental concept in both physics and psychology. By creating artificial
constraint (compression) before freedom (explosion), it amplifies the emotional
impact of the visual effect.

This animation type is particularly effective for actions that feel "charged" or
"powerful" - situations where the user has initiated something significant that
deserves a dramatic response.
