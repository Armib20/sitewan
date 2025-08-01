# RubikCube Component

The `RubikCube` component is the main orchestrator of the entire cube system. It
manages 26 individual cubelets and coordinates their animations.

## Key Features

### Position Generation

```typescript
const positions: Array<[number, number, number]> = [];
for (let x = -1.1; x <= 1.1; x += 1.1) {
    for (let y = -1.1; y <= 1.1; y += 1.1) {
        for (let z = -1.1; z <= 1.1; z += 1.1) {
            positions.push([roundedX, roundedY, roundedZ]);
        }
    }
}
```

Generates a 3×3×3 grid of positions with 1.1 unit spacing. The center piece
(0,0,0) is excluded during rendering.

### Group Structure

```typescript
<group ref={ambientGroupRef}>
    // Handles ambient rotation
    <group ref={cubeGroupRef}>
        // Contains all cubelets
        {/* Individual cubelets */}
    </group>
    <group ref={rotationGroupRef} /> // Temporary rotation group
</group>;
```

## State Management

### Animation State

```typescript
interface AnimationState {
    isAnimating: boolean;
    startTime: number;
    duration: number;
    axis: "x" | "y" | "z";
    position: number;
    targetRotation: number;
    resolve?: () => void;
}
```

Tracks the current face rotation animation with timing and axis information.

### Hover State

```typescript
const [hoveredCubelet, setHoveredCubelet] = useState<string | null>(null);
```

Tracks which cubelet is currently being hovered, using the cubelet's unique ID.

## Animation System

### Face Rotations

Face rotations work by temporarily moving cubelets to a rotation group:

1. **Attach Phase**: Cubelets matching the rotation criteria are moved to
   `rotationGroupRef`
2. **Animate Phase**: The rotation group is rotated using `useFrame`
3. **Detach Phase**: Cubelets are moved back to the main group with their new
   orientations

```typescript
const attachToRotationGroup = useCallback(
    (axis: "x" | "y" | "z", position: number) => {
        const cubesToMove = cubeGroupRef.current.children.filter((child) => {
            child.getWorldPosition(cubePos);
            cubeGroupRef.current!.worldToLocal(cubePos);
            return round(cubePos[axis]) === position;
        });

        cubesToMove.forEach((cube) => {
            rotationGroupRef.current!.attach(cube);
        });
    },
);
```

### Ambient Rotation

When idle, the cube slowly rotates for visual appeal:

```typescript
useFrame(() => {
    if (ambientGroupRef.current && !animationState && !hoveredCubelet) {
        ambientGroupRef.current.rotation.y += ambientRotationSpeed;
        ambientGroupRef.current.rotation.x += ambientRotationSpeed * 0.3;
    }
});
```

## API Methods

The component exposes methods through a React ref:

```typescript
export interface RubikCubeRef {
    animateXFace: (xpos: number, direction: number) => Promise<void>;
    animateYFace: (ypos: number, direction: number) => Promise<void>;
    animateZFace: (zpos: number, direction: number) => Promise<void>;
    resetCube: () => void;
    isAnimating: boolean;
}
```

### Usage Example

```typescript
const cubeRef = useRef<RubikCubeRef>(null);

// Rotate the right face clockwise
await cubeRef.current?.animateXFace(1.1, 1);

// Rotate the top face counter-clockwise
await cubeRef.current?.animateYFace(1.1, -1);
```

## Interaction Blocking

Certain interactions are blocked during animations or hover states:

- **Face rotations** are disabled when a cubelet is hovered or during existing
  animations
- **Ambient rotation** pauses when cubelets are hovered or during face rotations
- **Hover interactions** are disabled during face rotations (but not during
  other hover states)

## Performance Considerations

- Uses `useCallback` for stable function references
- Implements position rounding to handle floating-point precision
- Minimizes re-renders through careful state management
- Efficient cubelet filtering using Three.js world position calculations
