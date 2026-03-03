Hyperfocal Distance Calculator
Interactive Lens Barrel Interface — Project Brief

1. The Idea
A landing page for camera lenses that doubles as a functional hyperfocal distance calculator. Rather than a typical web form with dropdowns and sliders, the entire interface is modeled after the physical barrel markings found on manual focus lenses from the analog era. The reference point is the Sears Auto Zoom multi-coated telephoto lens, whose barrel features layered rings of engraved numbers, colored depth-of-field indicator lines, and diamond-knurled grip texture.
The visual treatment draws from a second reference: a typographic poster by Yep! Type Foundry depicting a Leica Summilux-M 1:1.4/35 ASPH in a flat, graphic style — dark background, orange line work, no three-dimensional lens outline. The lens body dissolves into the black background. Only the barrel markings, numbers, and indicator lines float in the void. This creates a pure, instrument-like interface where the data is the design.
Core Concept
The calculator is not a tool placed on a landing page. The calculator is the landing page. Every visual element serves double duty: it communicates lens barrel aesthetics while simultaneously functioning as an interactive control or computed readout.
Design Constraints

Black background only — no lens outline, no container, no card. The barrel markings exist in negative space.
White lines and tick marks for structural elements (separator lines, index marks, scale ticks).
Red (#FF3C28) for active/selected values and computed results. This is the only accent color.
Colored DoF curves (white, red, amber, green, blue) matching traditional lens barrel color coding for f-stop indicators.
DM Mono typeface throughout — monospaced, technical, precise.
Minimalist to the extreme — no shadows, no gradients, no rounded corners on containers. Flat, engraved, instrument-grade.


2. Barrel Elements Identified
The Sears Auto Zoom lens barrel was analyzed to extract the following distinct visual elements, each mapped to an interactive function:
Barrel ElementPhysical FormUI MappingAperture RingBottom band: (A) · 22 16 11 8 5.6 4 in white/orange numerals, evenly spaced on black bandDrag-to-rotate ring with f/1.4 through f/22. Active value centered with red highlight.Focus Distance ScaleTwo rows: feet (20, 30, 60, ∞) and meters (5, 7, 10, 20, ∞) in white numerals above colored DoF linesDual rotating scales (m + ft) with center-locked active value. Numbers fade toward edges.DoF Indicator LinesColored V-shaped lines fanning symmetrically from center index mark. White, green, yellow, red pairs for f-stop groups.Cubic bezier curves computed per-aperture, bowing outward from convergence point. Color-coded: white (f/1.4–2), red (f/2.8–4), amber (f/5.6–8), green (f/11–16), blue (f/22).Focal Length ScaleRight side markings: 100, 135, 150, 200 with colored dashesTop rotating ring with 24–200mm values.Knurled Grip TextureDiamond grid pattern on focus barrel, raised tactile diamonds in rowsSVG diamond pattern rendered between rings. Subtle white strokes on black.Separator LinesThin machined grooves between ring sections1px horizontal lines at rgba(255,255,255,0.08) dividing each barrel section.Center Index MarkVertical white line at 12 o'clock position for reading current settingPersistent center tick mark on each ring. Faint white line through DoF curve area.MACRO LabelGreen text with triangle pointer at base of barrelNot implemented — outside calculator scope.

3. Interaction Model
The interface rejects clicks, dropdowns, and sliders in favor of a single unified gesture: horizontal drag to rotate. This mirrors the physical act of twisting a lens barrel ring.
Drag-to-Rotate Mechanic
Each ring uses Pointer Events with pointer capture to ensure the drag remains locked even if the cursor leaves the element. The mapping is inverted: dragging left advances the value (as if rotating a barrel toward you), dragging right retreats it. A sensitivity factor of 0.55× the item spacing converts pixel displacement to discrete index steps.
Scroll wheel input is also supported as a secondary input, incrementing or decrementing by one step per wheel tick.
Center-Locked Display
The active (selected) value is always fixed at the horizontal center of its ring. Neighboring values are positioned at fixed pixel offsets from center. As distance from center increases, values undergo three simultaneous transformations:

Opacity decay: 1.0 → 0.35 → 0.12 → 0.04 → 0 (invisible beyond 3 positions out)
Scale reduction: 1.3× (active) → 0.88× → 0.7×
Color shift: Red (#FF3C28 with glow) at center, fading to dim white, then invisible

Black gradient masks cover both edges to smoothly clip values entering or leaving the visible frame. This creates the illusion of an infinite rotating drum.

4. Depth of Field Curves
The depth of field indicator is the visual centerpiece of the interface. On a physical lens, this appears as a set of colored V-shaped lines fanning out symmetrically from a center index mark. Each pair of lines corresponds to an f-stop and shows the near and far limits of acceptable sharpness at that aperture.
Curve Geometry
Rather than straight lines, the implementation uses SVG cubic bezier curves (C path commands) to create a smooth, bowed arc from the convergence point at top-center to the computed near/far positions at the bottom:

First control point: Vertically at 0.7× midpoint, horizontally locked to center — keeps the curve vertical near the convergence.
Second control point: Vertically at 1.4× midpoint, horizontally 85% toward the endpoint — creates the outward bow in the lower half.
Endpoint: Computed from real DoF physics — the interpolated position on the focus distance scale where the near or far limit falls.

Color Coding
F-stopsColorHexTraditionf/1.4, f/2White#FFFFFFWidest aperturesf/2.8, f/4Red#FF3C28Fast aperturesf/5.6, f/8Amber#FFAA00Mid-rangef/11, f/16Green#00CC66Sharp zonef/22Blue#3B9DFFMaximum DoF
All nine f-stops are rendered simultaneously, widest-first (f/22) down to narrowest (f/1.4). Each curve endpoint is labeled with its f-number. A red convergence dot sits at the top where all curves meet. As the focus ring is dragged, all 18 curves dynamically reshape based on real optics calculations.

5. Optical Physics
All calculations use standard thin-lens optics with a circle of confusion (CoC) of 0.03mm for full-frame sensors.
Hyperfocal Distance:
H = f² / (N × c) + f
Depth of Field Limits:
Near = S(H−f) / (H+S−2f)
Far  = S(H−f) / (H−S)    [or ∞ if S ≥ H]
Where f = focal length (mm), N = f-number, c = circle of confusion, S = subject distance (mm), H = hyperfocal distance (mm).

6. Layout Anatomy (Top to Bottom)

Title block — "HYPERFOCAL DISTANCE" / "CALCULATOR" in ultra-dim uppercase tracking
Focal length ring — 24, 35, 50, 85, 100, 135, 200mm. Drag to rotate.
Knurl spacer — 30px diamond grid texture
Aperture ring — f/1.4 through f/22. Drag to rotate.
Knurl spacer — 24px
DoF curve field — 110px tall. 18 bezier curves, center convergence dot, f-stop labels.
Focus distance ring (meters) — 0.5m to ∞. Drag to rotate. 58px tall.
Focus distance ring (feet) — Synchronized with meters. Same 58px height.
Knurl spacer — 40px
Results band — Three-column grid: Hyperfocal, Near Limit, Far Limit. Red values with ft equivalents.
Total DoF bar — Thin 2px progress bar with red fill proportional to total depth.
Footer — "Full Frame · CoC 0.03mm" in near-invisible text.


7. Iterative Refinements
v1 — Foundation
Established the barrel-ring layout, black background, knurl textures, and clickable number scales. Straight V-lines for DoF. All values visible simultaneously. Feet row was vertically compressed and barely legible.
v2 — Drag Interaction
Replaced click-on-number with drag-to-rotate via Pointer Events and pointer capture. Added scroll wheel support. Fixed feet row height from 28px to 58px. All three rings now use the same drag mechanic.
v3 — Rotating Drum
Locked the active value to center. Numbers slide in from the sides on drag, fading and shrinking as they move away from the index mark. Black gradient edge masks create the illusion of values entering and leaving a viewport. Values beyond 3 positions from center are removed from the DOM entirely.
v4 — Bezier DoF Curves
Replaced straight V-lines with cubic bezier curves for all 9 f-stops. Color-coded by aperture group using traditional lens barrel conventions. Curve endpoints accurately positioned at computed DoF limits on the focus scale. F-stop labels at endpoints. Convergence dot at top.

8. Technical Implementation

Single-file React JSX — no build step, no external CSS, no state management library. Pure hooks (useState, useCallback, useRef, useEffect).
SVG for precision graphics — DoF curves, knurl patterns, and scale tick marks. Knurl texture pre-computes all diamond paths into a single <path> element.
CSS transitions — all position, opacity, scale, and color changes use 0.14s ease-out. No spring physics, no animation libraries.
Entry animations — each barrel section fades up with staggered delays (0.1s increments) on mount via CSS keyframes.
640px max-width — constrained to approximate the width of a lens barrel.
Google Fonts (DM Mono) — weights 300, 400, 500. Fallback: IBM Plex Mono, Courier New, monospace.


The result is a calculator that doesn't look like a calculator. It looks like a lens barrel that happens to compute hyperfocal distances. The interface teaches you how manual focus lenses work by making you operate one.