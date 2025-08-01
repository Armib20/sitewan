# Scene Component

The `Scene` component is the top-level container for the entire 3D experience.
It sets up the React Three Fiber `Canvas`, orchestrates state management, and
integrates all major components, including the `RubikCube`, UI overlays, and
post-processing effects.

## Responsibilities

- **Scene Setup**: Initializes the `Canvas`, camera, and lighting to create the
  3D environment.
- **State Management**: Manages global states like `isAnimating`, `activePage`,
  and `selectedPage`.
- **Component Integration**: Renders the `RubikCube`, `PagePreview`, and UI
  elements.
- **Keyboard Controls**: Integrates `useKeyboardControls` to handle user input
  for cube rotations.
- **Post-Processing**: Applies a `Bloom` effect for a stylized, glowing
  aesthetic.

## Props

The `Scene` component does not accept any props.

## State Management

- **`cubeRef`**: A `useRef` hook to hold a reference to the `RubikCube`
  component instance, allowing the parent to call its methods.
- **`isAnimating`**: A boolean state that tracks whether a cube face rotation is
  in progress.
- **`isReverse`**: A boolean state that determines the direction of the cube
  rotation.
- **`activePage`**: A state that holds the data for the page currently being
  hovered over.
- **`selectedPage`**: A state that holds the data for the page that has been
  selected (clicked).

## UI and Effects

- **Header**: Displays a static title "Ali Rizwan".
- **Page Info**: An animated panel that shows the title and description of the
  `activePage`. It uses `useSpring` for a smooth fade-in/slide-in effect.
- **Page Preview**: When a `selectedPage` exists, it renders the `PagePreview`
  component, which overlays the screen.
- **Canvas Visibility**: The main canvas is hidden when a `PagePreview` is
  active to ensure the preview is the sole focus.

## Child Components

- **`RubikCube`**: The interactive 3D cube. The `Scene` passes down
  `setActivePage` and `setSelectedPage` callbacks to it.
- **`PagePreview`**: The component to display detailed page content.
- **`OrbitControls`**: Enables camera manipulation via mouse controls.
- **`EffectComposer`**: Manages post-processing effects, with `Bloom` applied.

## Hooks

- **`useKeyboardControls`**: A custom hook that listens for keyboard events to
  trigger cube rotations. It receives the `cubeRef`, `isAnimating` state, and
  setters to coordinate rotations.
