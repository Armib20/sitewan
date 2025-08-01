# Cubelet Component

The `Cubelet` component represents an individual cube piece in the Rubik's cube.
Each cubelet has colored faces, responds to hover interactions, and can animate
smoothly.

## Props Interface

```typescript
interface CubeletProps {
    id: string; // Unique identifier
    position: [number, number, number]; // 3D position in cube space
    onHover: (id: string | null) => void; // Hover callback
    isHovered: boolean; // Whether this cubelet is hovered
    isBlocked: boolean; // Whether interactions are blocked
}
```

## Face Coloring System

### Color Mapping

```typescript
const COLORS = {
    black: 0x000000, // Hidden/internal faces
    blue: 0x000000, // Right face (x+)
    green: 0x000000, // Left face (x-)
    white: 0x000000, // Top face (y+)
    yellow: 0x000000, // Bottom face (y-)
    red: 0x000000, // Front face (z+)
    orange: 0x000000, // Back face (z-)
};
```

### Face Assignment Logic

Each cubelet determines its face colors based on its position:

```typescript
const generateMaterials = (x: number, y: number, z: number) => {
    const materials = [];

    // Right face (x+): Blue if on right edge, black if internal
    if (x === 0 || x === -1.1) materials.push({ color: COLORS.black });
    else materials.push({ color: COLORS.blue });

    // Similar logic for other 5 faces...
};
```

**Face Visibility Rules:**

- Edge pieces: 2 colored faces, 4 black faces
- Corner pieces: 3 colored faces, 3 black faces
- Internal faces: Always black (hidden)

## Animation System

### Spring Configuration

```typescript
const { scale, animPosition } = useSpring({
    scale: isHovered ? 1.2 : 1,
    animPosition: isHovered ? 0.3 : 0,
    config: { tension: 400, friction: 15 },
});
```

**Animation Properties:**

- **Scale**: 1.0 (normal) → 1.2 (expanded) when hovered
- **Position**: Moves along cubelet's normal direction
- **Timing**: Fast tension (400) with moderate friction (15) for snappy feel

### Direction Calculation

```typescript
const direction = useMemo(() => new Vector3(x, y, z).normalize(), [x, y, z]);
```

The pop-out direction is calculated by normalizing the cubelet's position
vector, ensuring it moves away from the cube's center.

### Animation Implementation

```typescript
<a.group
    scale={scale as any}
    position={animPosition.to((val) =>
        direction.clone().multiplyScalar(val).toArray()
    )}
>
    <mesh>
        {/* Cubelet geometry and materials */}
    </mesh>
</a.group>;
```

The animation is applied to an inner group, keeping the main group's position
stable for proper rotation calculations.

## Event Handling

### Hover Detection

```typescript
const handlePointerOver = (e: React.PointerEvent<THREE.Object3D>) => {
    e.stopPropagation();
    if (isBlocked) return;
    onHover(id);
};

const handlePointerOut = (e: React.PointerEvent<THREE.Object3D>) => {
    e.stopPropagation();
    onHover(null);
};
```

**Event Flow:**

1. `onPointerOver`: Notifies parent with cubelet ID
2. `onPointerOut`: Notifies parent with null (no hover)
3. `stopPropagation`: Prevents event bubbling to other cubelets

## Geometry and Materials

### Box Geometry

```typescript
<boxGeometry args={[1, 1, 1]} />;
```

Each cubelet is a 1×1×1 unit cube.

### Material Assignment

```typescript
{
    materials.map((material, index) => (
        <meshBasicMaterial
            key={index}
            attach={`material-${index}`}
            color={material.color}
        />
    ));
}
```

Materials are applied in Three.js face order:

- Index 0: Right face (x+)
- Index 1: Left face (x-)
- Index 2: Top face (y+)
- Index 3: Bottom face (y-)
- Index 4: Front face (z+)
- Index 5: Back face (z-)

### Edge Rendering

```typescript
<Edges>
    <lineBasicMaterial color={0xffffff} linewidth={4} />
</Edges>;
```

White edges provide visual definition between faces.

## Performance Optimizations

- **Memoized materials**: `useMemo(() => generateMaterials(x, y, z), [x, y, z])`
- **Memoized direction**:
  `useMemo(() => new Vector3(x, y, z).normalize(), [x, y, z])`
- **Stable event handlers**: Functions are defined once per component instance
- **Center piece exclusion**: `if (x === 0 && y === 0 && z === 0) return null;`

## Integration with Parent

The cubelet works closely with its parent `RubikCube`:

1. **Receives hover state** as a prop rather than managing it internally
2. **Reports hover events** via callback to parent
3. **Respects blocking state** during cube rotations
4. **Maintains position stability** during face rotations through proper group
   structure
