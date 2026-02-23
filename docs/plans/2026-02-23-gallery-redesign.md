# Gallery Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the SVG-path timeline in `timeline.html` with a CSS grid gallery of polaroid cards at varying sizes, with a lightbox overlay for viewing captions.

**Architecture:** Convert `.timeline-track` to a 4-row CSS grid (4 × 170px = 680px). Each polaroid card spans explicit column/row counts to create size variation. Clicking a card opens a centered lightbox overlay (clones the card, always shows the caption). Rotations and washi tape are preserved on top of grid layout.

**Tech Stack:** Vanilla HTML/CSS/JS, all inline in `timeline.html`. No build step. No dependencies.

---

### Task 1: Remove SVG markup and spacer elements

**Files:**
- Modify: `timeline.html`

**Step 1: Delete the SVG block**

Find and delete the entire `<svg aria-hidden="true" ...>` element (~lines 383–431). This includes the `<defs>` with `#rough` filter and `#arr` marker, the main `<path>`, and the curved arrow `<path>`.

**Step 2: Delete spacer divs**

Find and delete every `<div class="spacer"></div>` and `<div class="spacer-lg"></div>` in the timeline-track.

**Step 3: Verify**

Open `timeline.html` in a browser. The page should load without errors. The wavy pink line should be gone. Polaroids will be jumbled/overlapping — that's expected; the grid comes in Task 2.

**Step 4: Commit**
```bash
git add timeline.html
git commit -m "remove SVG timeline path and spacer elements"
```

---

### Task 2: Convert .timeline-track to a CSS grid

**Files:**
- Modify: `timeline.html` (the `<style>` block, `.timeline-track` rule)

**Step 1: Replace .timeline-track CSS**

Find the current rule:
```css
.timeline-track {
  position: relative;
  width: 2800px;
  height: 680px;
}
```

Replace with:
```css
.timeline-track {
  display: grid;
  grid-template-rows: repeat(4, 170px);
  grid-auto-columns: 85px;
  grid-auto-flow: dense;
  height: 680px;
  width: max-content;
  min-width: 100vw;
  align-items: stretch;
}
```

**Step 2: Remove .spacer and .spacer-lg CSS rules**

Find and delete:
```css
.spacer, .spacer-lg { display: none; }
```

**Step 3: Verify**

The track should now be a grid container. Cards will still be broken — grid items need `grid-column`/`grid-row` spans (Task 3).

**Step 4: Commit**
```bash
git add timeline.html
git commit -m "convert timeline-track to CSS grid"
```

---

### Task 3: Make .event-wrapper a grid item; assign spans per card

**Files:**
- Modify: `timeline.html` (HTML markup for each event-wrapper)

**Step 1: Update .event-wrapper and .mini-event CSS**

Find:
```css
.event-wrapper {
  position: absolute;
  z-index: 2;
}

/* ── Mini event — absolute positioned ─────────── */
.mini-event {
  position: absolute;
  z-index: 2;
}
```

Replace both with a single rule:
```css
.event-wrapper,
.mini-event {
  z-index: 2;
}
```

**Step 2: Update each event-wrapper's inline style**

Remove the old `left: Xpx; top: Ypx;` from every wrapper. Add `grid-column` and `grid-row` spans. Use this table:

| Element | Old style | New style |
|---|---|---|
| e1 (first date) | `left:20px; top:70px;` | `grid-column: span 3; grid-row: 1 / span 1;` |
| e2 (official) | `left:310px; top:370px;` | `grid-column: span 3; grid-row: 2 / span 2;` |
| e3 (mood coffee) | `left:590px; top:75px;` | `grid-column: span 3; grid-row: 4 / span 1;` |
| e4 (boba) | `left:845px; top:290px;` | `grid-column: span 2; grid-row: 1 / span 1;` |
| m1 (cookies Feb 2) | `left:988px; top:58px;` | `grid-column: span 2; grid-row: 3 / span 1;` |
| m2 (cookies Feb 6) | `left:988px; top:388px;` | `grid-column: span 2; grid-row: 4 / span 1;` |
| e5 (first kiss) | `left:1370px; top:68px;` | `grid-column: span 3; grid-row: 1 / span 2;` |
| e6 (first photos) | `left:1700px; top:240px;` | `grid-column: span 3; grid-row: 3 / span 1;` |
| e7 (valentine's) | `left:2100px; top:240px;` | `grid-column: span 4; grid-row: 2 / span 2;` |

Also remove the `above`/`below` classes from the wrapper divs (they'll have no effect, but clean them out).

**Step 3: Update polaroid widths to match grid spans**

Each polaroid's `width` is now determined by its grid span × 85px. Update the inline `style="width:..."` on polaroid divs that have one:
- e2 (`width:240px`) → remove inline width (grid gives it `3 × 85 = 255px`)
- e5 (has inline `transform:rotate(-11deg)`) → keep just the transform, remove width if any
- e7 (`width:255px`) → remove inline width (grid gives it `4 × 85 = 340px`)

For the mini cards m1/m2 (`width:130px`) — remove inline width (grid gives them `2 × 85 = 170px`).

**Step 4: Verify**

Cards should now be arranged in a packed grid, 4 rows tall, filling the screen width. There will be some rough visual gaps — those get polished with doodles in Task 9. Verify each card is visible and positioned roughly in the correct left-to-right chronological order.

**Step 5: Commit**
```bash
git add timeline.html
git commit -m "assign grid spans to all event wrappers"
```

---

### Task 4: Fix .polaroid to fill its grid cell

**Files:**
- Modify: `timeline.html` (the `<style>` block)

**Step 1: Update .event-wrapper to fill its grid cell**

The event-wrapper is the grid item. Make it pass its full size down to the polaroid. Add to the `.event-wrapper, .mini-event` rule:
```css
.event-wrapper,
.mini-event {
  z-index: 2;
  display: flex;
  align-items: flex-start; /* card doesn't stretch to full cell height */
}
```

**Step 2: Update .polaroid to be flex-column**

Find the `.polaroid` rule. Add:
```css
.polaroid {
  /* existing properties ... */
  display: flex;
  flex-direction: column;
  width: 100%; /* fill the event-wrapper width */
}
```

Make sure `width: 210px` (the current explicit width) is **removed** — the grid cell controls width now.

**Step 3: Fix .polaroid-img to fill remaining height**

Find `.polaroid-img`. Replace `aspect-ratio: 1 / 1;` with `flex: 1; min-height: 60px;`:
```css
.polaroid-img {
  width: 100%;
  flex: 1;
  min-height: 60px;
  background: #f0ebe3;
  /* keep all other existing properties */
}
```

**Step 4: Verify**

Each card's image area should now fill the available height inside the grid cell. Small cards (1 row = 170px, body ~50px) will have a ~120px image area. Large cards (2 rows = 340px) will have a ~290px image area. XL (2 rows = 340px, wider) will have a big image area.

**Step 5: Commit**
```bash
git add timeline.html
git commit -m "fix polaroid to flex-fill its grid cell"
```

---

### Task 5: Add lightbox overlay HTML and CSS

**Files:**
- Modify: `timeline.html`

**Step 1: Add overlay HTML**

Just before `</body>`, add:
```html
<!-- Lightbox overlay -->
<div class="gallery-overlay" id="gallery-overlay" onclick="handleOverlayClick(event)">
  <div class="lightbox-card" id="lightbox-card"></div>
</div>
```

**Step 2: Add overlay CSS**

Add to the `<style>` block:
```css
/* ── Lightbox overlay ─────────────────────────── */
.gallery-overlay {
  position: fixed;
  inset: 0;
  background: rgba(50, 35, 25, 0.55);
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}
.gallery-overlay.active {
  opacity: 1;
  pointer-events: all;
}
.lightbox-card {
  max-width: 340px;
  width: 90vw;
  transform: rotate(-2deg);
  position: relative;
}
/* In the lightbox, always show the description */
.lightbox-card .polaroid-desc {
  max-height: 200px !important;
  opacity: 1 !important;
  margin-top: 6px !important;
}
/* In the lightbox, the polaroid fills its container */
.lightbox-card .polaroid {
  width: 100%;
  cursor: default;
}
```

**Step 3: Verify**

Overlay div exists in DOM but is invisible (opacity 0, pointer-events none). No visual change yet — JS wires it up in Task 6.

**Step 4: Commit**
```bash
git add timeline.html
git commit -m "add lightbox overlay HTML and CSS"
```

---

### Task 6: Replace togglePolaroid JS with lightbox JS

**Files:**
- Modify: `timeline.html` (the `<script>` block)

**Step 1: Replace the entire script block contents**

Delete all existing JS (the `togglePolaroid` function, keyboard handler for polaroids, Escape handler, and scroll hint logic). Replace with:

```javascript
// ── Lightbox ───────────────────────────────────────
let activeCard = null;

function openLightbox(card) {
  const overlay = document.getElementById('gallery-overlay');
  const lightboxCard = document.getElementById('lightbox-card');

  // Clone the polaroid into the lightbox
  lightboxCard.innerHTML = '';
  const clone = card.cloneNode(true);
  clone.removeAttribute('onclick');
  clone.removeAttribute('id');
  clone.removeAttribute('tabindex');
  clone.style.transform = 'none'; // lightbox-card container handles rotation
  lightboxCard.appendChild(clone);

  // Dim original card
  if (activeCard) activeCard.style.opacity = '';
  card.style.opacity = '0.35';
  activeCard = card;

  // Show overlay
  overlay.classList.add('active');
}

function closeLightbox() {
  const overlay = document.getElementById('gallery-overlay');
  overlay.classList.remove('active');
  if (activeCard) {
    activeCard.style.opacity = '';
    activeCard = null;
  }
}

function handleOverlayClick(e) {
  // Close only if clicking the backdrop (not the card itself)
  if (e.target === e.currentTarget || e.target.id === 'gallery-overlay') {
    closeLightbox();
  }
}

// Escape key closes lightbox
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

// ── Scroll hint ────────────────────────────────────
const hint = document.querySelector('.scroll-hint');
let hintHidden = false;
window.addEventListener('scroll', () => {
  if (!hintHidden) {
    hint.style.opacity = '0';
    hint.style.transition = 'opacity 0.5s';
    hintHidden = true;
  }
}, { passive: true });
```

**Step 2: Update onclick on every polaroid card**

Find every `onclick="togglePolaroid('eX', 'size')"` attribute and replace with `onclick="openLightbox(this)"`.

There are 7 polaroids with onclick (e1–e7). The mini cards m1/m2 don't have onclick currently — add `onclick="openLightbox(this)"` to them too so all cards are clickable.

**Step 3: Verify**

Click any polaroid. The overlay fades in, the card appears centered and large, the caption is visible. Click the dark backdrop or press Escape — overlay closes. The original card returns to full opacity.

**Step 4: Commit**
```bash
git add timeline.html
git commit -m "replace togglePolaroid with lightbox overlay"
```

---

### Task 7: Remove now-unused CSS

**Files:**
- Modify: `timeline.html` (the `<style>` block)

**Step 1: Delete the open/expand state CSS**

Find and delete these rules entirely:
```css
/* expanded state */
.polaroid.open { ... }
.polaroid.open-large { ... }
.polaroid.open-medium { ... }
```

Also delete the `.polaroid-desc` open-state selectors:
```css
.polaroid.open .polaroid-desc,
.polaroid.open-large .polaroid-desc,
.polaroid.open-medium .polaroid-desc { ... }
```

(The `.polaroid-desc` base rule stays — it keeps the description hidden inside grid cards.)

**Step 2: Remove mobile override for open states**

Inside `@media (max-width: 700px)`, delete the lines:
```css
.polaroid.open        { transform: rotate(0deg) scale(1.14) !important; }
.polaroid.open-large  { transform: rotate(0deg) scale(1.22) !important; }
.polaroid.open-medium { transform: rotate(0deg) scale(1.16) !important; }
```

Also remove `width: 120px;` from the mobile `.polaroid` rule — grid controls width now. Keep the `font-size` override for `.polaroid-title`.

**Step 3: Verify**

Page still looks correct. No JS errors. Lightbox still works.

**Step 4: Commit**
```bash
git add timeline.html
git commit -m "remove unused open-state CSS classes"
```

---

### Task 8: Update doodle positions

**Files:**
- Modify: `timeline.html`

**Step 1: Remove old absolute doodle positioning**

The doodle `<span>` elements currently have inline `style="left:Xpx; top:Ypx;"`. These coordinates were tuned for the old SVG layout and will look wrong in the grid.

The doodles live inside `.timeline-track` which is now a grid container. Grid auto-places them too if they're grid children. To avoid the grid treating them as grid items, wrap all doodles in a single `position: absolute` container:

Before the first doodle span, add:
```html
<div class="doodle-layer" aria-hidden="true">
```
After the last doodle span, add:
```html
</div>
```

**Step 2: Add .doodle-layer CSS**

```css
.doodle-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}
```

And add `position: relative;` to `.timeline-track` (keep `display: grid` — these are compatible).

**Step 3: Redistribute doodle positions**

Update the doodle inline `left`/`top` values to scatter across the new layout. Suggested positions (spread across ~2000px width to match the 9-card grid):

```html
<span class="doodle"    style="left:180px;  top:430px;">✦</span>
<span class="doodle-sm doodle" style="left:240px;  top:475px;">★</span>
<span class="doodle"    style="left:520px;  top:60px;">♡</span>
<span class="doodle-sm doodle" style="left:575px;  top:35px;">✦</span>
<span class="doodle-lg doodle" style="left:780px;  top:490px;">♡</span>
<span class="doodle-sm doodle" style="left:840px;  top:545px;">★</span>
<span class="doodle"    style="left:1050px; top:55px;">✦</span>
<span class="doodle-sm doodle" style="left:1110px; top:30px;">♡</span>
<span class="doodle-lg doodle" style="left:1460px; top:470px;">★</span>
<span class="doodle-sm doodle" style="left:1520px; top:510px;">✦</span>
<span class="doodle"    style="left:1800px; top:95px;">♡</span>
```

**Step 4: Verify**

Doodles appear scattered around the gallery without disrupting card layout. No doodle overlaps in a distracting way on top of card text.

**Step 5: Commit**
```bash
git add timeline.html
git commit -m "reposition doodles for grid layout"
```

---

### Task 9: Final visual polish pass

**Files:**
- Modify: `timeline.html`

**Step 1: Check for large empty patches**

Scroll through the full gallery. If there are obvious empty column gaps (more than ~170px of empty space), adjust one or two cards' `grid-row` start to shift them into that area. The `grid-auto-flow: dense` should minimize this, but manual tuning may help.

**Step 2: Verify lightbox on mobile**

Resize browser to under 700px wide. Tap a card. Lightbox should appear, centered. `.lightbox-card` has `width: 90vw` so it stays within viewport. Caption should be readable.

**Step 3: Verify all 9 cards are clickable**

Click each of the 9 polaroids and confirm:
- Overlay appears
- Caption (`.polaroid-desc`) text is visible
- Closing works (click outside + Escape)
- Original card dims while lightbox is open

**Step 4: Final commit**
```bash
git add timeline.html
git commit -m "gallery redesign complete"
```

---

## Verification Checklist

- [ ] No SVG path visible
- [ ] Cards fill the horizontal space in a packed grid
- [ ] 4 distinct size tiers visible (small, medium, large, XL)
- [ ] All cards rotated (scrapbook chaos)
- [ ] Washi tape decorations on select cards
- [ ] Clicking any card opens lightbox overlay
- [ ] Caption text visible in lightbox
- [ ] Click outside / Escape dismisses lightbox
- [ ] Floating petals still animate
- [ ] Page header still shows
- [ ] No JS console errors
- [ ] Mobile (< 700px) works
