# PagePreview Component

The `PagePreview` component is a simple UI overlay that displays the full
content of a selected page. It is rendered on top of the main scene when a user
clicks on a cubelet associated with a page.

## Responsibilities

- **Display Content**: Shows the title and a detailed description of the
  selected page.
- **Provide Navigation**: Includes a "Back to Cube" button that allows the user
  to close the preview and return to the interactive `RubikCube`.

## Props

- **`page`**: `PageData`
  - An object containing the data for the page to be displayed. It must include
    `title` and `description` properties.
- **`onBack`**: `() => void`
  - A callback function that is invoked when the "Back to Cube" button is
    clicked. This function is responsible for hiding the preview and showing the
    main scene again.

## Structure

The component consists of a full-screen semi-transparent overlay with centered
content. Key elements include:

- A container `div` with a dark, blurred background effect.
- An `h1` element for the page title.
- A `p` element for the page description.
- A `button` that triggers the `onBack` callback.

## Styling

- The component uses Tailwind CSS for styling.
- It is designed to be a modal overlay, positioned absolutely to cover the
  entire screen (`inset-0`).
- The content is centered both horizontally and vertically using flexbox.
- Text is styled to be easily readable against the dark background.
- A hover effect on the "Back to Cube" button provides visual feedback.
