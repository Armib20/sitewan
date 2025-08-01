# Rubik's Cube Documentation

This documentation explains the architecture and implementation of the
interactive 3D Rubik's cube built with React Three Fiber.

## Quick Navigation

### 🏗️ Architecture & Components

- [RubikCube Component](./components/rubik-cube.md) - Main orchestrator
- [Cubelet Component](./components/cubelet.md) - Individual pieces

### ⚡ Animation & Interaction

- [Animation System](./animation-system.md) - Face rotations & timing
- [Hover Effects](./hover-effects.md) - Interactive feedback
- [State Management](./state-management.md) - Data flow & coordination

### 🎮 Controls

- [Keyboard Controls](./keyboard-controls.md) - Input handling

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Components](#components)
- [Animation System](#animation-system)
- [State Management](#state-management)
- [Hover Effects](#hover-effects)
- [Keyboard Controls](#keyboard-controls)

## Overview

The Rubik's cube is implemented as a 3D interactive web application using:

- **React Three Fiber** for 3D rendering
- **@react-spring/three** for smooth animations
- **Three.js** for 3D mathematics and transformations
- **TypeScript** for type safety

## Architecture

The cube consists of 26 individual cubelets (3×3×3 minus the hidden center
piece) that can be rotated in layers along the X, Y, and Z axes. Each cubelet
maintains its own position and can respond to hover interactions with smooth
pop-out animations.

## Components

### RubikCube (`src/components/RubikCube.tsx`)

- **Main container** for the entire cube system
- **Manages global state** including animations and hover states
- **Controls ambient rotation** when the cube is idle
- **Handles face rotations** along X, Y, and Z axes
- **Provides imperative API** through React refs

### Cubelet (`src/components/Cubelet.tsx`)

- **Individual cube piece** with proper face coloring
- **Handles hover interactions** with spring-based animations
- **Manages pop-out effects** when hovered
- **Renders edges** for visual definition

### Scene (`src/components/Scene.tsx`)

- **3D scene setup** with lighting and camera
- **Integrates keyboard controls**
- **Wraps the RubikCube component**

For detailed information about each component, see:

- [RubikCube Component](./components/rubik-cube.md)
- [Cubelet Component](./components/cubelet.md)
- [Animation System](./animation-system.md)
- [State Management](./state-management.md)
