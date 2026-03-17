# Our Story
A password-protected, interactive Valentine's Day scrapbook website themed after *How to Train Your Dragon*. A digital keepsake of our shared memories, presented as a cozy Viking village at sunset.

---

## Overview

The site has two pages:

1. **Landing page** (`index.html`) — A HTTYD-themed entrance scene with animated dragons, mountain silhouettes, floating embers, and a password gate.
2. **Timeline gallery** (`timeline.html`) — A horizontal-scrolling scrapbook of polaroid cards documenting our moments together, complete with washi tape, doodles, and a lightbox overlay.

---

## Theme

> *Toothless (Night Fury) × Light Fury

The landing page renders a full-viewport sunset scene:
- Deep purple-to-amber gradient sky
- Layered mountain silhouettes (far + near)
- 12 floating ember particles with staggered rise animations
- Animated SVG dragons — Toothless on the left (facing right), Light Fury on the right (facing left), wings flapping slightly out of sync
- A wooden hanging banner with a swaying animation, containing the password form

Fonts used: [Cinzel](https://fonts.google.com/specimen/Cinzel) (titles) and [IM Fell English](https://fonts.google.com/specimen/IM+Fell+English) (body).

---

## Entry Flow

```
index.html  →  password prompt  →  (correct)  →  timeline.html
                                   (wrong)     →  shake + error message
```

The password is our anniversary date in `MMDDYY` format (010826). The error messages are intentionally playful.

---

## Timeline Gallery

`timeline.html` is a self-contained file (all styles and JS inline) featuring:

- **CSS grid layout** — 8 rows × 85px, `grid-auto-flow: dense`, horizontal scroll
- **Four card size tiers**: Small (2×2), Medium-landscape (3×2), Large (3×3), XL (4×4)
- **Scrapbook aesthetics**: varied rotations (−11° to +8°), washi tape strips via CSS pseudo-elements, floating ♡ ✦ ★ doodles
- **Lightbox overlay**: clicking a card fades in a centered full-caption view; dismiss by clicking outside or pressing Escape
- **Floating petals** animation in the background (fixed, pointer-events: none)
- **Mobile override** at `< 700px` — switches to vertical scroll

---

## File Structure

```
valentines-day/
├── index.html          # Landing / password page (links style.css + script.js)
├── style.css           # All styles for the landing page
├── script.js           # Password validation + redirect logic
├── timeline.html       # Self-contained scrapbook gallery (inline styles + JS)
├── beginning.html      # (empty placeholder)
└── *.jpeg / *.JPG      # Photo assets used in polaroid cards
```

---

## Running Locally

No build step required. Open any `.html` file directly in a browser:

```bash
open index.html
# or
python3 -m http.server 8080
```

---

## Design Journey

I built this with several design iterations in mind:

- **Original wave timeline** — Started with a straight timeline line, then tried a wavy SVG path with absolutely-positioned polaroids
- **Grid gallery transition** — Replaced the SVG wave approach with a CSS grid-based masonry gallery for better card distribution and responsiveness
- **Interactive lightbox** — Added a modal overlay to showcase full photo captions when cards are clicked

Each transition kept the same HTTYD aesthetic while improving the layout and user experience.

---

## Tech Stack

- Vanilla HTML / CSS / JavaScript — no frameworks, no dependencies
- Google Fonts (Cinzel, IM Fell English)
- SVG for dragon illustrations and rope/nail decorations
- CSS custom properties for the full color palette
- CSS `clip-path` for mountain silhouettes
- CSS `@keyframes` for all animations (embers, wings, fire glow, bioluminescence, petals, banner sway)
