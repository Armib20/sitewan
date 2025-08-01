# 3D Rubik's Cube

Interactive 3D Rubik's cube built with React Three Fiber, featuring smooth
animations and hover effects.

## Quick Start

```bash
npm install
npm run dev
```

## Features

- 🎮 **Keyboard Controls** - Rotate faces with intuitive key mappings
- 🖱️ **Hover Effects** - Interactive cubelets with smooth pop-out animations
- ⚡ **Smooth Animations** - Spring-based physics for natural motion
- 🔄 **Face Rotations** - Full 3x3x3 cube manipulation
- 🎯 **State Management** - Coordinated animations without conflicts

## Controls

- **Q/E**: Left face rotation
- **A/D**: Right face rotation
- **R/F**: Top face rotation
- **C/V**: Bottom face rotation
- **T/G**: Front face rotation
- **B/N**: Back face rotation
- **Space**: Reset cube

## Architecture

Built with a hierarchical component system:

- `RubikCube` - Main orchestrator managing 26 cubelets
- `Cubelet` - Individual pieces with hover animations
- `Scene` - 3D environment setup with controls

## Documentation

Complete technical documentation available in `/docs/`:

- [Architecture Overview](./docs/README.md)
- [Components](./docs/components/)
- [Animation System](./docs/animation-system.md)
- [State Management](./docs/state-management.md)

## Tech Stack

- React + TypeScript
- React Three Fiber (3D rendering)
- @react-spring/three (animations)
- Three.js (3D math)
