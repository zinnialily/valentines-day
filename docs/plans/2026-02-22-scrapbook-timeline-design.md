# Scrapbook Timeline Redesign
**Date:** 2026-02-22
**Status:** Approved

## Problem

The current `timeline.html` looks too clean and clinical. The horizontal line is perfectly straight, polaroids alternate rigidly above/below with uniform spacing, and there's too much empty white space between events. The vibe is "PowerPoint" not "scrapbook."

## Goal

Make the timeline feel like someone's actual scrapbook — messy, dense, full of personality. Photos at different heights, tilts, and sizes. A line that wiggles. No dead air.

## Chosen Approach: Wavy SVG Path + Absolute-Positioned Polaroids

### 1. Replace the straight line with an SVG wave

- Remove `<div class="timeline-line">` (the current `<hr>`-style element)
- Add an inline `<svg>` spanning the full scroll width (~2800px) inside `.timeline-track`
- Draw the timeline as a `<path>` with cubic bezier curves — an organic sine-like wave that rises and falls across the scroll area
- Keep the same pink color (`#e8a8c8`) and a 2–3px stroke

### 2. Switch polaroid positioning from flexbox to absolute

- Remove the current flexbox `display: inline-flex` alternating above/below system
- Set `.timeline-track` to `position: relative` with a fixed height (~650px) and explicit width (~2800px)
- Give each polaroid `.event` `position: absolute` with hand-tuned `left` (horizontal) and `top` (vertical) coordinates
- Coordinates are chosen so polaroids cluster near the wave but at varying heights — some above the wave crest, some below the trough, some right on it

### 3. Increase polaroid size and chaos

- Width: 160px → 220px
- Rotations: ±3° → ranging from -12° to +8° (different per polaroid)
- Some adjacent polaroids intentionally overlap via z-index
- The "stem" lines that connect polaroids to the timeline line are removed (positions relative to the wave are self-evident)

### 4. Washi tape decorations

- Add CSS `::before` or `::after` pseudo-elements on select polaroids
- Tape strips: semi-transparent colored rectangles (~60px wide, ~18px tall), rotated at ±30–45°, placed at the top edge of the polaroid
- Colors: muted dusty pink, sage green, cream — staying in the existing palette

### 5. Floating doodle elements

- Add ~8–10 small decorative elements scattered in the negative space between polaroids:
  - Tiny stars (`✦`, `★`) as `<span>` elements with absolute positions
  - Small hearts (`♡`)
  - A few squiggle lines drawn with short SVG paths or CSS borders
- These fill dead space and reinforce the scrapbook aesthetic

### 6. Track dimensions

| Property | Before | After |
|---|---|---|
| Track height | ~350px | ~650px |
| Track width | auto (flex) | ~2800px fixed |
| Polaroid width | 160px | 200–240px (varies) |
| Max rotation | ±3° | up to ±12° |

### 7. Connection dots

- Keep the pink dots at polaroid-to-wave connection points
- Position them at the wave curve coordinate nearest to each polaroid (manually tuned to look right)
- Remove the vertical "stem" lines — dots alone are sufficient

## Color palette (unchanged)

- Line: `#e8a8c8` (dusty rose)
- Background: `#f9f7f4` (warm cream)
- Polaroid bg: white + subtle shadow
- Text: `#8b7355` (warm brown)
- Accent: `#c9a89a` (muted terracotta)

## Files to Modify

- `timeline.html` — all styles and structure are inline; this is the only file to change

## Verification

1. Open `timeline.html` in a browser
2. Scroll horizontally — confirm the wave line undulates and polaroids are at varying heights
3. Confirm no large empty patches of white space
4. Confirm polaroids are bigger and tilted at more aggressive angles
5. Confirm some polaroids overlap
6. Confirm tape strip decorations appear on select polaroids
7. Click to expand a polaroid — confirm it still works correctly
8. Check on mobile (resize window to < 700px) — confirm the mobile override still triggers
