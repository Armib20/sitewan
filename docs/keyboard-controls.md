# Keyboard Controls

The Rubik's cube supports keyboard-based manipulation using intuitive key
mappings that correspond to standard cube notation and common gaming controls.

## Control Scheme

### Face Rotation Keys

The keyboard controls follow a logical mapping based on cube faces and
directions:

#### X-Axis Rotations (Left/Right faces)

- **Q**: Rotate left face counter-clockwise
- **E**: Rotate left face clockwise
- **A**: Rotate right face counter-clockwise
- **D**: Rotate right face clockwise

#### Y-Axis Rotations (Top/Bottom faces)

- **R**: Rotate top face counter-clockwise
- **F**: Rotate top face clockwise
- **C**: Rotate bottom face counter-clockwise
- **V**: Rotate bottom face clockwise

#### Z-Axis Rotations (Front/Back faces)

- **T**: Rotate front face counter-clockwise
- **G**: Rotate front face clockwise
- **B**: Rotate back face counter-clockwise
- **N**: Rotate back face clockwise

### Special Functions

- **Space**: Reset cube to initial state

## Implementation

### Hook Structure

```typescript
// src/hooks/useKeyboardControls.ts
export const useKeyboardControls = (cubeRef: React.RefObject<RubikCubeRef>) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!cubeRef.current) return;

            const key = event.key.toLowerCase();

            switch (key) {
                case "q":
                    cubeRef.current.animateXFace(-1.1, -1);
                    break;
                case "e":
                    cubeRef.current.animateXFace(-1.1, 1);
                    break;
                    // ... other cases
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [cubeRef]);
};
```

### Integration

```typescript
// In Scene component
const cubeRef = useRef<RubikCubeRef>(null);
useKeyboardControls(cubeRef);

return <RubikCube ref={cubeRef} />;
```

## Key Mapping Logic

### Coordinate System

The cube uses a right-handed coordinate system:

- **X-axis**: Left (-) to Right (+)
- **Y-axis**: Bottom (-) to Top (+)
- **Z-axis**: Back (-) to Front (+)

### Position Values

Face positions correspond to the edges of the 3×3×3 grid:

- **-1.1**: Left/Bottom/Back edge
- **0**: Middle layer
- **1.1**: Right/Top/Front edge

### Direction Values

Rotation directions follow right-hand rule:

- **-1**: Counter-clockwise rotation
- **1**: Clockwise rotation

### Key Layout Design

The keys are arranged for ergonomic access:

```
Q W E R T     ← Top row: Left face, Top face, Front face
A S D F G     ← Home row: Left/Right faces, Front face  
  C V B N     ← Bottom row: Bottom face, Back face
```

**Mnemonic Aids:**

- **Q/E**: "Queue"/"End" for left face rotations
- **A/D**: Standard gaming "strafe left/right" for X-axis
- **R/F**: "Rise/Fall" for top face rotations
- **T/G**: "Top/Grab" for front face rotations
- **C/V/B/N**: Bottom row for bottom/back operations

## Async Animation Handling

### Promise-based Operations

```typescript
case 'q':
  await cubeRef.current.animateXFace(-1.1, -1);
  break;
```

**Benefits:**

- Operations can be chained if needed
- Natural blocking behavior prevents conflicts
- Clean error handling possibilities

### Concurrent Operation Prevention

```typescript
// In RubikCube component
const animateXFace = useCallback(async (xpos: number, direction: number) => {
    if (animationState || hoveredCubelet) return Promise.resolve();
    // ... animation logic
});
```

**Blocking Conditions:**

- Existing face rotation in progress
- Any cubelet currently hovered
- Prevents input during transitions

## Accessibility Features

### Global Event Handling

```typescript
window.addEventListener("keydown", handleKeyDown);
```

**Benefits:**

- Works regardless of focus state
- No need to click canvas first
- Consistent behavior across page

### Key Repeat Handling

```typescript
const handleKeyDown = (event: KeyboardEvent) => {
    if (event.repeat) return; // Ignore key repeat
    // ... handle key press
};
```

**Prevents:**

- Accidental multiple rotations
- Queue buildup from held keys
- Unintended rapid operations

### Case Insensitive

```typescript
const key = event.key.toLowerCase();
```

Works with both uppercase and lowercase input.

## Advanced Usage

### Custom Key Mappings

The system can be extended with additional controls:

```typescript
case 'u': // Undo last move
  cubeRef.current.undoLastMove();
  break;
  
case 's': // Scramble cube
  cubeRef.current.scramble();
  break;

case '1': // Preset position 1
  cubeRef.current.loadPosition(presets.position1);
  break;
```

### Modifier Keys

Support for complex operations:

```typescript
if (event.shiftKey) {
    // Rotate entire cube instead of single face
    cubeRef.current.rotateCube(axis, direction);
} else {
    // Normal face rotation
    cubeRef.current.animateXFace(xpos, direction);
}
```

### Sequence Recording

```typescript
const sequence: string[] = [];

const handleKeyDown = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    sequence.push(key);

    // Execute move
    performMove(key);

    // Could save for replay/undo functionality
};
```

## Error Handling

### Invalid States

```typescript
const handleKeyDown = (event: KeyboardEvent) => {
    if (!cubeRef.current) {
        console.warn("Cube not ready for input");
        return;
    }

    if (cubeRef.current.isAnimating) {
        console.log("Cube busy, ignoring input");
        return;
    }

    // ... process input
};
```

### Key Validation

```typescript
const validKeys = [
    "q",
    "e",
    "a",
    "d",
    "r",
    "f",
    "c",
    "v",
    "t",
    "g",
    "b",
    "n",
    " ",
];

if (!validKeys.includes(key)) {
    return; // Ignore invalid keys
}
```

## Performance Considerations

### Event Cleanup

```typescript
useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
        // ... handler logic
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
        window.removeEventListener("keydown", handleKeyDown);
    };
}, [cubeRef]);
```

**Important:**

- Proper cleanup prevents memory leaks
- Dependency array ensures stable reference
- Single event listener per component instance

### Efficient Key Processing

```typescript
// Use object lookup instead of long if/else chains
const keyMap = {
    "q": () => cubeRef.current?.animateXFace(-1.1, -1),
    "e": () => cubeRef.current?.animateXFace(-1.1, 1),
    // ... other mappings
};

const handler = keyMap[key];
if (handler) handler();
```

## Integration with Cube State

### Blocking During Hover

```typescript
// In RubikCube
const animateXFace = useCallback(async (xpos, direction) => {
    if (animationState || hoveredCubelet) return Promise.resolve();
    // ... perform rotation
});
```

**User Experience:**

- Keyboard input disabled during hover interactions
- Prevents conflicts between input methods
- Maintains smooth visual experience

### State Synchronization

The keyboard controls work seamlessly with:

- Face rotation animations
- Hover effect system
- Ambient rotation pausing
- Reset functionality

This creates a cohesive interaction model where all input methods respect the
same state boundaries and provide consistent behavior.
