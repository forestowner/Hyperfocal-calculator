**Add your own guidelines here**
<!--

System Guidelines

Use this file to provide the AI with rules and guidelines you want it to follow.
This template outlines a few examples of things you can add. You can add your own sections and format it to suit your needs

TIP: More context isn't always better. It can confuse the LLM. Try and add the most important rules you need

# General guidelines

Any general rules you want the AI to follow.
For example:

* Only use absolute positioning when necessary. Opt for responsive and well structured layouts that use flexbox and grid by default
* Refactor code as you go to keep code clean
* Keep file sizes small and put helper functions and components in their own files.

--------------

# Design system guidelines
Rules for how the AI should make generations look like your company's design system

Additionally, if you select a design system to use in the prompt box, you can reference
your design system's components, tokens, variables and components.
For example:

* Use a base font-size of 14px
* Date formats should always be in the format “Jun 10”
* The bottom toolbar should only ever have a maximum of 4 items
* Never use the floating action button with the bottom toolbar
* Chips should always come in sets of 3 or more
* Don't use a dropdown if there are 2 or fewer options

You can also create sub sections and add more specific details
For example:


## Button
The Button component is a fundamental interactive element in our design system, designed to trigger actions or navigate
users through the application. It provides visual feedback and clear affordances to enhance user experience.

### Usage
Buttons should be used for important actions that users need to take, such as form submissions, confirming choices,
or initiating processes. They communicate interactivity and should have clear, action-oriented labels.

### Variants
* Primary Button
  * Purpose : Used for the main action in a section or page
  * Visual Style : Bold, filled with the primary brand color
  * Usage : One primary button per section to guide users toward the most important action
* Secondary Button
  * Purpose : Used for alternative or supporting actions
  * Visual Style : Outlined with the primary color, transparent background
  * Usage : Can appear alongside a primary button for less important actions
* Tertiary Button
  * Purpose : Used for the least important actions
  * Visual Style : Text-only with no border, using primary color
  * Usage : For actions that should be available but not emphasized
-->
# Viewfinder Scene SVG Construction Guide

## Overview

The Hyperfocal Calculator viewfinder renders **layered SVG scenes** where each layer sits at a specific physical distance from the camera. The engine applies Gaussian blur based on real circle-of-confusion optics — layers at the focus distance are sharp, everything else blurs proportionally.

Scenes are pasted into the app as JavaScript objects. The engine handles blur, FOV cropping, and display mode switching automatically.

---

## Canvas Specification

```
Virtual Canvas:  1200 × 600 units
Horizon Line:    y = 252 (42% from top)
Coordinate Origin: top-left (0, 0)
```

- **Sky region**: y = 0 to ~270
- **Ground region**: y = 252 to 600
- **Subject center**: approximately x = 600, y = 260–380

FOV crop by focal length:
- 24mm → ~900 units wide (most of canvas visible)
- 50mm → ~550 units wide
- 135mm → ~204 units wide
- 300mm → ~92 units wide (extreme center crop)

**Design rule**: Primary subject near center (x: 450–750). Spread secondary elements across full width for wide-angle visibility.

---

## Scene Data Format

```javascript
const myScene = {
  id: 'my-scene',
  name: 'My Scene',
  layers: [
    {
      distance: Infinity,
      svg: `<rect x="0" y="0" width="1200" height="280" fill="#0a0e14"/>`,
      svgLight: `<rect x="0" y="0" width="1200" height="280" fill="#c8d4e0"/>`
    },
    {
      distance: 80,
      svg: `<path d="..." fill="#111822"/>`,
      svgLight: `<path d="..." fill="#8898aa"/>`
    },
    {
      distance: 5,
      svg: `...dark mode SVG...`,
      svgLight: `...light mode SVG...`
    },
    {
      distance: 0.3,
      svg: `...bokeh shapes...`,
      svgLight: `...light bokeh...`
    }
  ]
};
```

### Layer Fields

| Field | Required | Description |
|-------|----------|-------------|
| `distance` | Yes | Distance in meters. Use `Infinity` for sky. |
| `svg` | Yes | SVG content for **dark mode** (with full color). |
| `svgLight` | No | SVG content for **light mode** (with full color). If omitted, dark `svg` is used in light mode — which is fine for dark-themed viewfinders, but will look flat on the light background. |

### Rules

1. Layers sorted **far → near** (engine auto-sorts, but author in order for clarity)
2. `svg` and `svgLight` are raw SVG markup — no wrapping `<svg>` tag
3. All coordinates in the 1200×600 canvas space
4. **Do not add blur filters** — the engine handles all blur
5. **Always include full color** in your SVGs — BW mode is handled by the engine
6. HTML comments (`<!-- -->`) are allowed
7. You can use `<defs>`, gradients, `<clipPath>`, etc.

---

## Display Modes — How They Work

The app has three independent mode toggles. Here's exactly what each does:

### ☾/☀ Dark / Light Mode

| Mode | What the engine does |
|------|---------------------|
| **Dark** (default) | Renders `svg` field. Black background (`#030303`). |
| **Light** | Renders `svgLight` field if present, else falls back to `svg`. Light background (`#f0ede8`). Vignette is softer. |

**This is the only mode that needs explicit SVG authoring.** You must provide `svgLight` variants for each layer if you want proper light mode support. The dark and light SVGs have the **same shapes and layout** but with inverted brightness:

```
Dark fill: #0e1118  →  Light fill: #c0c8d0
Dark fill: #3a4050  →  Light fill: #8090a0  
Dark fill: #d4a844  →  Light fill: #b08830 (warm accents stay warm, just adjusted)
```

### BW / CLR — Black & White vs Color

| Mode | What the engine does |
|------|---------------------|
| **BW** (default) | Applies CSS `saturate(0)` to the entire scene — all colors become grayscale. |
| **Color** | Renders SVG as-authored — all colors visible. |

**No SVG changes needed.** Always author your SVGs with full color. BW desaturation is automatic and always looks good because it's a simple luminance conversion.

### Hi — High Contrast

| Mode | What the engine does |
|------|---------------------|
| **Normal** (default) | No adjustment. |
| **Hi** | Applies CSS `contrast(1.5) brightness(1.08)` to the scene. Crushes midtones, deepens shadows, brightens highlights. |

**No SVG changes needed.** This filter works well on both dark and light base SVGs. For best results, ensure your SVGs have good tonal separation (see brightness guidelines below).

### Mode Combinations

All three modes are independent, giving 8 combinations:

| Dark/Light | BW/Color | Contrast | SVG Used | CSS Filters |
|-----------|----------|----------|----------|-------------|
| Dark | BW | Normal | `svg` | `saturate(0)` |
| Dark | Color | Normal | `svg` | none |
| Dark | BW | Hi | `svg` | `saturate(0) contrast(1.5) brightness(1.08)` |
| Dark | Color | Hi | `svg` | `contrast(1.5) brightness(1.08)` |
| Light | BW | Normal | `svgLight` | `saturate(0)` |
| Light | Color | Normal | `svgLight` | none |
| Light | BW | Hi | `svgLight` | `saturate(0) contrast(1.5) brightness(1.08)` |
| Light | Color | Hi | `svgLight` | `contrast(1.5) brightness(1.08)` |

**Key insight**: You only need to author **two SVG variants per layer** (dark + light). The engine handles all other mode combinations via CSS filters that work reliably on properly authored SVGs.

---

## Color Palette Guide

### Dark Mode Fills (`svg`)

Elements should get progressively brighter closer to camera:

| Depth | Background fills | Object fills | Stroke | Accent color |
|-------|-----------------|--------------|--------|--------------|
| ∞ Sky | `#080a10` | — | — | Stars: `rgba(200,220,255,0.06)` |
| 60-100m | `#0e1118` – `#111822` | — | `rgba(x,x,x,0.03)` | — |
| 15-25m | `#141822` – `#181c28` | Windows: `#d4a844` @ 30-60% | `#1a1c22` | Warm lights |
| 8-12m | `#12141a` – `#181a22` | Road marks: `#d4a844` @ 30-50% | `#1a1c22` | — |
| 3-6m | — | Figures: `#3a4050` – `#505060` | `#2a2e38` | Skin: `#b09080` |
| 1-2m | — | Furniture: `#3a404a` – `#555` | — | Red accents: `#8a3030` |
| 0.5-0.8m | `#1a1c24` (frames) | — | — | — |
| 0.3m | transparent | — | `rgba(255,255,255,0.03-0.06)` | Warm: `#d4a844` @ 2-5% |

### Light Mode Fills (`svgLight`)

Mirror the same shapes, invert the brightness scale:

| Depth | Background fills | Object fills | Stroke | Accent color |
|-------|-----------------|--------------|--------|--------------|
| ∞ Sky | `#c8d4e0` – `#d0dce8` | — | — | Stars: not visible / clouds instead |
| 60-100m | `#a0aab8` – `#8898a8` | — | `rgba(0,0,0,0.04)` | — |
| 15-25m | `#94a0b0` – `#8a96a6` | Windows: `#6a5830` @ 40-70% | `#7a8a9a` | Warm lights: `#a08030` |
| 8-12m | `#b8c0cc` – `#a8b0bc` | Road marks: `#8a7030` @ 40-60% | `#9aa0aa` | — |
| 3-6m | — | Figures: `#4a5060` – `#606878` | `#5a6070` | Skin: `#c0a090` |
| 1-2m | — | Furniture: `#6a7080` – `#808898` | — | Red: `#a04040` |
| 0.5-0.8m | `#8a9098` (frames) | — | — | — |
| 0.3m | transparent | — | `rgba(0,0,0,0.04-0.08)` | Warm: `#a08030` @ 3-6% |

### Color Accents by Scene Type

Always include color — BW desaturation is automatic:

| Scene Type | Primary accent | Secondary | Warm highlights | Cool tones |
|-----------|---------------|-----------|-----------------|------------|
| **Street/Night** | `#d4a844` (amber lights) | `#8a3030` (red signs) | Window glow | `#1a2a3a` (night sky) |
| **Nature** | `#2a5a2a` (foliage) | `#5a4a38` (earth/bark) | `#d4a060` (sunset) | `#1a3050` (water) |
| **Portrait** | `#b09080` (skin) | `#2a4a2a` (plants) | `#d4a844` (studio) | `#2a2040` (backdrop) |
| **Abstract** | `#4a4a8a` (blue) | `#8a4a4a` (red) | `#8a8a4a` (yellow) | `#4a8a8a` (cyan) |

---

## Layer Distance Guidelines

Use **7-10 layers** for rich depth:

| Layer | Distance | Purpose |
|-------|----------|---------|
| Sky | `Infinity` | Backdrop gradient, celestial objects |
| Far BG | 60-100m | Mountains, distant skyline |
| Mid BG | 15-25m | Building blocks, tree masses |
| Ground | 8-12m | Terrain, roads, ground plane |
| Subject | 3-6m | Primary focal subject |
| Near FG | 1.5-2.5m | Urban furniture, flowers, rocks |
| Close FG | 0.5-0.8m | Framing elements at edges |
| Bokeh | 0.2-0.4m | Out-of-focus highlight shapes |

---

## Element Construction Recipes

### Mountains

```svg
<!-- Dark -->
<path d="M0,260 L100,210 L200,230 L300,190 ... L1200,260Z" fill="#0e1520"/>
<path d="M0,260 L80,228 L200,242 ... L1200,260Z" fill="#111822"/>

<!-- Light equivalent -->
<path d="M0,260 L100,210 L200,230 L300,190 ... L1200,260Z" fill="#8898a8"/>
<path d="M0,260 L80,228 L200,242 ... L1200,260Z" fill="#94a0b0"/>
```

### Trees (detailed, multi-ellipse)

```svg
<!-- Dark -->
<rect x="498" y="280" width="4" height="30" fill="#3d2b1a" rx="1"/>
<ellipse cx="500" cy="262" rx="14" ry="18" fill="#1a3a1a"/>
<ellipse cx="494" cy="268" rx="10" ry="12" fill="#163016" opacity="0.7"/>

<!-- Light equivalent -->
<rect x="498" y="280" width="4" height="30" fill="#8a7050" rx="1"/>
<ellipse cx="500" cy="262" rx="14" ry="18" fill="#4a8a4a"/>
<ellipse cx="494" cy="268" rx="10" ry="12" fill="#408038" opacity="0.7"/>
```

### People (silhouette + detail)

```svg
<!-- Dark -->
<ellipse cx="600" cy="348" rx="14" ry="4" fill="rgba(0,0,0,0.25)"/>
<path d="M588,305 Q585,320 540,345 L560,345 Q570,310 565,280Z" fill="#3a4050"/>
<ellipse cx="550" cy="255" rx="12" ry="15" fill="#b09080" opacity="0.8"/>

<!-- Light equivalent -->
<ellipse cx="600" cy="348" rx="14" ry="4" fill="rgba(0,0,0,0.10)"/>
<path d="M588,305 Q585,320 540,345 L560,345 Q570,310 565,280Z" fill="#606878"/>
<ellipse cx="550" cy="255" rx="12" ry="15" fill="#c0a090" opacity="0.8"/>
```

### Buildings with Windows

```svg
<!-- Dark: dark walls, glowing windows -->
<rect x="100" y="180" width="70" height="80" fill="#141822"/>
<rect x="115" y="195" width="8" height="12" fill="#d4a844" opacity="0.4"/>
<rect x="130" y="195" width="8" height="12" fill="#0a0a0a"/>

<!-- Light: mid-tone walls, darker windows, warm reflections -->
<rect x="100" y="180" width="70" height="80" fill="#94a0b0"/>
<rect x="115" y="195" width="8" height="12" fill="#a08030" opacity="0.5"/>
<rect x="130" y="195" width="8" height="12" fill="#7a8898"/>
```

### Bokeh (hexagonal)

```svg
<!-- Dark -->
<polygon points="80,360 94,352 94,336 80,328 66,336 66,352"
  fill="#d4a844" fill-opacity="0.02"
  stroke="#d4a844" stroke-width="1.5" stroke-opacity="0.05"/>

<!-- Light -->
<polygon points="80,360 94,352 94,336 80,328 66,336 66,352"
  fill="#a08030" fill-opacity="0.03"
  stroke="#a08030" stroke-width="1.5" stroke-opacity="0.06"/>
```

---

## Scene Checklists

### Street / Night

Dark (`svg`):
- [ ] Deep blue-black sky with moon + ambient glow (`#080a10`)
- [ ] Distant skyline silhouette with jagged roofline (`#0e1118`)
- [ ] Mid buildings with lit (amber `#d4a844`) and unlit (`#0a0a0a`) windows
- [ ] Ground plane with road, perspective dashes
- [ ] Person silhouette + lamppost with light halo
- [ ] Urban furniture spread across width (hydrant left, bollards right, bin far-right)
- [ ] Framing railings at extreme edges
- [ ] Warm hexagonal bokeh

Light (`svgLight`):
- [ ] Pale overcast sky (`#c8d4e0`)
- [ ] Skyline in mid-gray silhouette (`#8898a8`)
- [ ] Buildings in gray-blue with warm window tints
- [ ] Lighter road surface (`#a8b0bc`), visible markings
- [ ] Figure in medium tones (`#606878`), lamppost darker
- [ ] Furniture in mid-tones, visible reflective strips
- [ ] Railings slightly darker than background
- [ ] Subtle warm bokeh circles

### Nature

Dark (`svg`):
- [ ] Night sky with stars, moon or aurora (`#0a0e14`)
- [ ] 2-3 overlapping mountain ridges (`#0e1520` → `#111822`)
- [ ] Forest treeline, mixed tree types, spread across width
- [ ] Meadow with stream/path, bushes
- [ ] Wildlife or feature subject (deer, bird)
- [ ] Wildflowers distributed left-center-right
- [ ] Tall grass blades across full width
- [ ] Large leaf shapes at edges, hexagonal bokeh

Light (`svgLight`):
- [ ] Daylight sky with subtle clouds (`#b0c8e0`)
- [ ] Mountain ridges in blue-gray (`#7888a0` → `#8898aa`)
- [ ] Green treeline (`#4a8a4a` → `#408038`)
- [ ] Bright meadow (`#7aaa6a`), blue stream
- [ ] Subject in warm earth tones
- [ ] Colorful wildflowers, bright green grass
- [ ] Bright green leaf shapes, softer bokeh

### Portrait

Dark (`svg`):
- [ ] Smooth dark studio backdrop (`#121015`)
- [ ] Back wall with frames/art (`#181520`)
- [ ] Plants, studio props
- [ ] Detailed bust: face, shoulders, clothing, hair
- [ ] Table/surface with small objects
- [ ] Draped fabric, scattered petals at edges
- [ ] Soft circular bokeh

Light (`svgLight`):
- [ ] Warm cream studio backdrop (`#e0d8d0`)
- [ ] Light wall with visible frames
- [ ] Green plants pop against light wall
- [ ] Subject with natural skin tones, visible clothing color
- [ ] Table objects clearly visible
- [ ] Light fabric at edges
- [ ] Very subtle bokeh

### Abstract

Dark (`svg`):
- [ ] Near-black with faint grid/concentric guides (`#080810`)
- [ ] Large wire-frame geometrics (rotated squares, triangles)
- [ ] Mid circles with color tints at low opacity
- [ ] Bold filled shapes with thick strokes
- [ ] Intersecting lines, smaller geometrics
- [ ] Large edge shapes, geometric bokeh (hexagons, triangles)

Light (`svgLight`):
- [ ] Near-white with faint grid (`#e8e8f0`)
- [ ] Geometric outlines in medium tones
- [ ] Colored circles more saturated
- [ ] Bold shapes with lighter fills, darker strokes
- [ ] Same layout, inverted tonal range

---

## Conversion Tips: Dark → Light

When creating `svgLight` from `svg`:

1. **Backgrounds**: Dark (`#08-#1a`) → Light (`#a0-#e0`)
2. **Objects**: Dark (`#2a-#55`) → Medium (`#60-#90`)
3. **Accents**: Keep hue, adjust brightness (amber `#d4a844` → `#a08030`)
4. **Shadows**: `rgba(0,0,0,0.4)` → `rgba(0,0,0,0.10)`
5. **Glows**: `opacity="0.15"` → `opacity="0.08"` (less dramatic in light)
6. **Strokes on bokeh**: `rgba(255,255,255,0.05)` → `rgba(0,0,0,0.06)`
7. **Stars**: Remove or replace with clouds/haze
8. **Lit windows**: `#d4a844` at lower opacity, or switch to reflection tints

General rule: **invert the value (HSV) but keep the hue and roughly the saturation**. Dark fills become light, light accents become medium.

---

## How to Add a Custom Scene

1. Write your scene as a JS object with `id`, `name`, `layers`
2. Each layer has `distance`, `svg`, and optionally `svgLight`
3. Click **+ LOAD SCENE** in the app
4. Paste the entire JS object (with or without `const name = `)
5. Click **LOAD SCENE** — the scene appears as a tab

Scenes with the same `id` replace each other on reload — iterate freely.

---

## Performance Notes

- Keep total SVG under ~50KB per mode per scene
- Avoid `<filter>` elements — the engine handles blur
- ~200 SVG elements max per scene for smooth rendering
- Test at both 24mm (wide) and 200mm+ (tight crop)
- `svgLight` can share shapes via copy-paste — only change fill/stroke values

