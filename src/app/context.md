# App Directory Context

## Overview
This directory contains the main Next.js app router structure for the "whodunit" application.

## Key Files

### globals.css
- Contains global styles for the application
- **Background Implementation**: Modified to use a repeating wall texture
  - Uses `/assets/wall.png` as a repeating background image
  - The background combines the CSS custom property `var(--background)` with the wall texture
  - Pattern: linear gradient overlay combined with `/assets/wall.png`
  - Tile size enforced with `background-size: 128px 128px`
  - Dark overlay applied using `rgba(0, 0, 0, 0.5)` to dim the wall texture
  - This creates an infinite tiling wall effect across the entire page background

### layout.tsx
- Root layout component that wraps all pages
- Applies global font variables (Geist Sans and Geist Mono)
- Contains the HTML structure and body styling

### page.tsx
- Main homepage component
- Currently displays Next.js starter content
- Rendered on top of the repeating wall background

## Design Decisions
- The wall background is applied at the body level to ensure it covers the entire viewport
- Uses CSS `repeat` property to create seamless tiling
- Tiles are constrained to 128px squares for consistent wall brick sizing
- Overlay gradient provides a darker tone without altering source asset
- Maintains the existing color scheme variables for overlay compatibility
