# Gallery Redesign: Polaroid Grid
**Date:** 2026-02-23
**Status:** Approved

## Problem

The current `timeline.html` uses a wavy SVG path with absolutely-positioned polaroids scattered along it. The SVG line is being removed and replaced with a packed gallery layout where polaroid cards of varying sizes fill the entire horizontal scroll space.

## Goal

A horizontal-scrolling CSS grid gallery of polaroid cards at different sizes. Cards retain all scrapbook personality (rotations, washi tape, doodles). Clicking a card opens a centered lightbox overlay to read the caption.

## Approach: CSS Grid with Span-Based Varying Sizes

### 1. Grid structure

- `.timeline-track` becomes a CSS grid container
- `grid-template-rows: repeat(8, 85px)` → 8 rows × 85px = 680px total height
- `grid-auto-columns: 85px` → column unit is 85px wide
- `grid-auto-flow: dense` → gaps filled automatically by smaller cards
- Track width stays `2800px` (enough for 9 events + breathing room)

### 2. Card size tiers

| Tier | Grid span | Pixel size | Assigned events |
|---|---|---|---|
| Small | 2 cols × 2 rows | 170 × 170px | cookies ×2, I Heart Boba |
| Medium-landscape | 3 cols × 2 rows | 255 × 170px | first date, mood coffee, first photos |
| Large | 3 cols × 3 rows | 255 × 255px | became official, first kiss |
| XL | 4 cols × 4 rows | 340 × 340px | chosen valentine's |

Each card gets an explicit `grid-row: X / span Y` so cards start at different row bands (top, middle, bottom), creating visual rhythm rather than all aligning to the same baseline.

### 3. Polaroid image area

- Remove `aspect-ratio: 1/1` from `.polaroid-img`
- Switch `.polaroid` to `display: flex; flex-direction: column`
- `.polaroid-img` gets `flex: 1` so it fills remaining height after the body text area
- Body text area (date + title) stays fixed at ~50px

### 4. Click-to-expand: lightbox overlay

- New `<div class="gallery-overlay">` added to the DOM (hidden by default)
- On card click: overlay fades in, the polaroid content is shown centered on screen at ~340px wide
- Lightbox polaroid keeps rotation (gentle ±3°), washi tape, and shadow
- Original card in the grid dims to 0.4 opacity while lightbox is open
- Click outside overlay or press Escape to dismiss
- Remove the previous `togglePolaroid` scale-in-place logic

### 5. What stays

- All card content (dates, titles, captions, badges) unchanged
- Rotations: -11° to +8° per card (same classes: `rot-n3` through `rot-p3`)
- Washi tape strips on select cards
- Floating petals animation
- Page header ("our story ♡") and subtitle
- Doodle elements (✦ ♡ ★) scattered in grid gaps
- Scroll hint arrow

### 6. What is removed

- The wavy SVG `<path>` and all SVG markup
- The curved arrow connector between the two cookie cards
- The stacked/arrow treatment for mini events (m1, m2 become regular small cards)
- `togglePolaroid` scale-in-place JS logic
- `.open`, `.open-large`, `.open-medium` CSS classes and related styles

## Files to modify

- `timeline.html` — all styles, markup, and JS are inline; this is the only file

## Verification

1. Open `timeline.html` — page loads, petals animate, header visible
2. Scroll horizontally — gallery of cards fills the full height with no large empty patches
3. Cards appear at varying sizes (small/medium/large/XL visible)
4. Cards are rotated and have washi tape decorations
5. No wavy SVG line present
6. Click a card — overlay fades in, lightbox polaroid centered on screen
7. Full caption text visible in lightbox
8. Click outside lightbox / press Escape — overlay dismisses, card returns to normal opacity
9. Resize to < 700px — mobile overrides still apply
