# 🌿 Garden Planner

A visual drag-and-drop garden layout tool built as a single-page web application. Design your backyard by placing beds, trees, flowers, produce, furniture, hardscape, and more on a scaled grid canvas.

![Garden Planner](https://img.shields.io/badge/version-1.0-green) ![License](https://img.shields.io/badge/license-MIT-blue)

## Features

- **Scaled Grid Canvas** — Enter your yard dimensions in feet and plan on an accurate grid with 5ft major gridlines and ruler labels
- **250+ Catalog Items** — 100 flowers, 100 produce (vegetables, fruits, herbs), and 50+ prefab objects across 10 categories: beds, trees, furniture, hardscape, structures, cooking & entertaining, water features, and decor
- **Freeform Drawing** — Paint custom shapes cell-by-cell with configurable brush sizes for beds, paths, patios, ponds, lawns, and more
- **Fence & Gate System** — Perimeter fences in multiple sizes rendered as border-only outlines with corner posts, plus dashed-line gate openings
- **Multi-Tab Plans** — Work on multiple garden layouts simultaneously with independent state per tab
- **Undo/Redo** — 80-level undo history with Ctrl+Z / Ctrl+Shift+Z
- **Object Grouping** — Group related items (Ctrl+G) to move and manage them together
- **Layer Ordering** — Automatic z-index by category with manual layer controls ([ ] keys)
- **Floating Selection Toolbar** — Quick access to rename, delete, duplicate, rotate, lock, group, color, dimensions, and layer controls
- **Object Manager Panel** — Searchable, filterable list of all placed objects organized by category
- **Snap-to-Object Alignment** — Visual alignment guides appear when dragging near other objects
- **Zoom & Pan** — Scroll to zoom, Space+drag to pan, auto-fit on load
- **Measurement Tool** — Click two points to measure distance in feet
- **Sticky Notes** — Place text annotations anywhere on the canvas
- **PNG Export** — High-resolution export with grid, labels, and compass
- **URL Sharing** — Gzip-compressed plan data encoded in shareable URLs
- **Save/Load System** — localStorage iterations plus JSON file import/export with drag-and-drop
- **Compass Rose** — Configurable north direction with rotating compass indicator
- **Half-Foot Snapping** — 0.5ft grid snap for precise placement
- **v2 Compact Format** — Optimized JSON serialization with ~80% file size reduction (v1 backward compatible)

## Getting Started

### Option 1: Open Directly
Just open `index.html` in any modern browser. No build step, no server required.

### Option 2: Serve Locally
```bash
# Python
python -m http.server 8000

# Node
npx serve .
```

### Option 3: Deploy to Render
This app is a static site — deploy by pointing Render to this repo with publish directory set to `/`.

## Usage

1. **Setup** — Enter your yard width and depth in feet, choose which compass direction the top of your yard faces, then click "Start Planning"
2. **Place Mode** — Browse categories in the sidebar, click an item to place it centered in the viewport. Drag to reposition, use handles to resize/rotate
3. **Draw Mode** — Select a brush type, click and drag to paint custom freeform shapes
4. **Erase Mode** — Remove individual cells from freeform shapes
5. **Measure Mode** — Click two points to see the distance between them
6. **Note Mode** — Click to place sticky note annotations

### Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl+Z` | Undo |
| `Ctrl+Shift+Z` / `Ctrl+Y` | Redo |
| `Ctrl+D` | Duplicate selected |
| `Ctrl+G` | Group selected |
| `Ctrl+Shift+G` | Ungroup |
| `Delete` / `Backspace` | Delete selected |
| `[` / `]` | Layer back / forward |
| `Arrow Keys` | Nudge selected (1ft) |
| `Shift+Arrow` | Nudge selected (5ft) |
| `Space+Drag` | Pan canvas |
| `Scroll` | Zoom in/out |
| `Escape` | Exit current mode |
| `Right-click` | Exit current mode |

## Project Structure

```
garden-plan/
├── index.html          # Entry point & HTML structure
├── css/
│   └── style.css       # All styles
├── js/
│   ├── data.js         # Catalog arrays, constants, lookup tables
│   ├── state.js        # App state, tab system, undo/redo
│   ├── render.js       # DOM rendering, grid, PNG export
│   ├── ui.js           # Event handlers, toolbar, sidebar, zoom/pan
│   └── serialize.js    # Save/load, import/export, URL sharing
└── README.md
```

## Save Format

Plans are saved as JSON with two format versions:

- **v1** (legacy) — Verbose keys, full property names
- **v2** (current) — Short keys, default-value omission, pipe-delimited freeform cell sets (~80% smaller)

The app reads both formats and always exports v2. Pretty-printed for readability.

## Browser Support

Tested on Chrome, Firefox, Safari, and Edge. Requires ES6+ support (no IE11).

## License

MIT
