import type { SceneData } from './types';

export const geometricScene: SceneData = {
  id: 'geometric',
  name: 'Geometric',
  layers: [
    // ── Backdrop (Infinity) ────────────────────────────────────────────────────
    {
      distance: Infinity,
      svg: `
        <defs>
          <radialGradient id="geo-bg-grad" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stop-color="#0c0c18" stop-opacity="1"/>
            <stop offset="100%" stop-color="#070710" stop-opacity="1"/>
          </radialGradient>
        </defs>
        <!-- Background -->
        <rect x="0" y="0" width="1200" height="600" fill="url(#geo-bg-grad)"/>
        <!-- Faint grid -->
        <!-- Vertical lines -->
        <line x1="150" y1="0" x2="150" y2="600" stroke="rgba(100,100,180,0.04)" stroke-width="1"/>
        <line x1="300" y1="0" x2="300" y2="600" stroke="rgba(100,100,180,0.04)" stroke-width="1"/>
        <line x1="450" y1="0" x2="450" y2="600" stroke="rgba(100,100,180,0.04)" stroke-width="1"/>
        <line x1="600" y1="0" x2="600" y2="600" stroke="rgba(100,100,180,0.06)" stroke-width="1"/>
        <line x1="750" y1="0" x2="750" y2="600" stroke="rgba(100,100,180,0.04)" stroke-width="1"/>
        <line x1="900" y1="0" x2="900" y2="600" stroke="rgba(100,100,180,0.04)" stroke-width="1"/>
        <line x1="1050" y1="0" x2="1050" y2="600" stroke="rgba(100,100,180,0.04)" stroke-width="1"/>
        <!-- Horizontal lines -->
        <line x1="0" y1="100" x2="1200" y2="100" stroke="rgba(100,100,180,0.04)" stroke-width="1"/>
        <line x1="0" y1="200" x2="1200" y2="200" stroke="rgba(100,100,180,0.04)" stroke-width="1"/>
        <line x1="0" y1="300" x2="1200" y2="300" stroke="rgba(100,100,180,0.06)" stroke-width="1"/>
        <line x1="0" y1="400" x2="1200" y2="400" stroke="rgba(100,100,180,0.04)" stroke-width="1"/>
        <line x1="0" y1="500" x2="1200" y2="500" stroke="rgba(100,100,180,0.04)" stroke-width="1"/>
        <!-- Concentric rings from center -->
        <circle cx="600" cy="300" r="120" fill="none" stroke="rgba(100,100,200,0.04)" stroke-width="1"/>
        <circle cx="600" cy="300" r="240" fill="none" stroke="rgba(100,100,200,0.04)" stroke-width="1"/>
        <circle cx="600" cy="300" r="360" fill="none" stroke="rgba(100,100,200,0.04)" stroke-width="1"/>
        <circle cx="600" cy="300" r="480" fill="none" stroke="rgba(100,100,200,0.03)" stroke-width="1"/>
      `,
      svgLight: `
        <defs>
          <radialGradient id="geo-bg-light-grad" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stop-color="#eceef8"/>
            <stop offset="100%" stop-color="#e0e4f0"/>
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="1200" height="600" fill="url(#geo-bg-light-grad)"/>
        <line x1="150" y1="0" x2="150" y2="600" stroke="rgba(80,80,140,0.07)" stroke-width="1"/>
        <line x1="300" y1="0" x2="300" y2="600" stroke="rgba(80,80,140,0.07)" stroke-width="1"/>
        <line x1="450" y1="0" x2="450" y2="600" stroke="rgba(80,80,140,0.07)" stroke-width="1"/>
        <line x1="600" y1="0" x2="600" y2="600" stroke="rgba(80,80,140,0.10)" stroke-width="1"/>
        <line x1="750" y1="0" x2="750" y2="600" stroke="rgba(80,80,140,0.07)" stroke-width="1"/>
        <line x1="900" y1="0" x2="900" y2="600" stroke="rgba(80,80,140,0.07)" stroke-width="1"/>
        <line x1="1050" y1="0" x2="1050" y2="600" stroke="rgba(80,80,140,0.07)" stroke-width="1"/>
        <line x1="0" y1="100" x2="1200" y2="100" stroke="rgba(80,80,140,0.07)" stroke-width="1"/>
        <line x1="0" y1="200" x2="1200" y2="200" stroke="rgba(80,80,140,0.07)" stroke-width="1"/>
        <line x1="0" y1="300" x2="1200" y2="300" stroke="rgba(80,80,140,0.10)" stroke-width="1"/>
        <line x1="0" y1="400" x2="1200" y2="400" stroke="rgba(80,80,140,0.07)" stroke-width="1"/>
        <line x1="0" y1="500" x2="1200" y2="500" stroke="rgba(80,80,140,0.07)" stroke-width="1"/>
        <circle cx="600" cy="300" r="120" fill="none" stroke="rgba(80,80,180,0.07)" stroke-width="1"/>
        <circle cx="600" cy="300" r="240" fill="none" stroke="rgba(80,80,180,0.07)" stroke-width="1"/>
        <circle cx="600" cy="300" r="360" fill="none" stroke="rgba(80,80,180,0.07)" stroke-width="1"/>
      `,
    },

    // ── Far wireframes (60m) ───────────────────────────────────────────────────
    {
      distance: 60,
      svg: `
        <!-- Large rotated square left -->
        <rect x="50" y="100" width="280" height="280" fill="none" stroke="rgba(80,80,160,0.12)" stroke-width="2" transform="rotate(22, 190, 240)"/>
        <rect x="80" y="130" width="220" height="220" fill="none" stroke="rgba(80,80,160,0.08)" stroke-width="1.5" transform="rotate(22, 190, 240)"/>
        <!-- Large triangle right -->
        <polygon points="900,80 1100,440 700,440" fill="none" stroke="rgba(100,60,140,0.10)" stroke-width="2"/>
        <polygon points="920,110 1080,410 760,410" fill="none" stroke="rgba(100,60,140,0.07)" stroke-width="1.5"/>
        <!-- Center rotated cross -->
        <line x1="500" y1="150" x2="700" y2="450" stroke="rgba(60,100,160,0.08)" stroke-width="2"/>
        <line x1="700" y1="150" x2="500" y2="450" stroke="rgba(60,100,160,0.08)" stroke-width="2"/>
        <!-- Large hexagon center-right -->
        <polygon points="820,160 880,160 910,212 880,264 820,264 790,212" fill="none" stroke="rgba(80,120,80,0.10)" stroke-width="2"/>
        <!-- Far ground plane suggestion -->
        <line x1="0" y1="420" x2="1200" y2="420" stroke="rgba(100,100,180,0.06)" stroke-width="1"/>
        <line x1="0" y1="460" x2="1200" y2="460" stroke="rgba(100,100,180,0.04)" stroke-width="1"/>
      `,
      svgLight: `
        <rect x="50" y="100" width="280" height="280" fill="none" stroke="rgba(60,60,140,0.18)" stroke-width="2" transform="rotate(22, 190, 240)"/>
        <rect x="80" y="130" width="220" height="220" fill="none" stroke="rgba(60,60,140,0.12)" stroke-width="1.5" transform="rotate(22, 190, 240)"/>
        <polygon points="900,80 1100,440 700,440" fill="none" stroke="rgba(80,40,120,0.16)" stroke-width="2"/>
        <polygon points="920,110 1080,410 760,410" fill="none" stroke="rgba(80,40,120,0.10)" stroke-width="1.5"/>
        <line x1="500" y1="150" x2="700" y2="450" stroke="rgba(40,80,140,0.12)" stroke-width="2"/>
        <line x1="700" y1="150" x2="500" y2="450" stroke="rgba(40,80,140,0.12)" stroke-width="2"/>
        <polygon points="820,160 880,160 910,212 880,264 820,264 790,212" fill="none" stroke="rgba(40,100,60,0.14)" stroke-width="2"/>
      `,
    },

    // ── Mid distance shapes (20m) ──────────────────────────────────────────────
    {
      distance: 20,
      svg: `
        <!-- Tilted rectangle mid-left -->
        <rect x="120" y="180" width="160" height="100" fill="#1e1c2a" stroke="rgba(80,80,180,0.15)" stroke-width="1.5" transform="rotate(-12, 200, 230)"/>
        <!-- Color tint circle left -->
        <circle cx="200" cy="230" r="60" fill="#4a4a8a" fill-opacity="0.06" stroke="#4a4a8a" stroke-width="1" stroke-opacity="0.10"/>
        <!-- Floating hexagon center-left -->
        <polygon points="380,160 440,160 470,212 440,264 380,264 350,212" fill="#2a1a3a" fill-opacity="0.8" stroke="#6a4a8a" stroke-width="1.5" stroke-opacity="0.20"/>
        <!-- Diamond shape center -->
        <polygon points="600,120 680,220 600,320 520,220" fill="#1a1a2a" stroke="rgba(80,80,200,0.18)" stroke-width="2"/>
        <!-- Circle accent (red) -->
        <circle cx="750" cy="260" r="55" fill="#FF3C28" fill-opacity="0.08" stroke="#FF3C28" stroke-width="1.5" stroke-opacity="0.20"/>
        <circle cx="750" cy="260" r="35" fill="#FF3C28" fill-opacity="0.04" stroke="#FF3C28" stroke-width="1" stroke-opacity="0.12"/>
        <!-- Right tilted rectangle -->
        <rect x="920" y="160" width="200" height="130" fill="#1a1c2a" stroke="rgba(80,80,180,0.12)" stroke-width="1.5" transform="rotate(8, 1020, 225)"/>
        <!-- Intersecting lines -->
        <line x1="0" y1="300" x2="1200" y2="300" stroke="rgba(100,100,200,0.06)" stroke-width="1.5"/>
        <line x1="0" y1="320" x2="1200" y2="320" stroke="rgba(100,100,200,0.04)" stroke-width="1"/>
        <!-- Ground suggestion -->
        <rect x="0" y="420" width="1200" height="180" fill="#141214"/>
        <line x1="0" y1="420" x2="1200" y2="420" stroke="rgba(100,100,200,0.08)" stroke-width="1.5"/>
      `,
      svgLight: `
        <rect x="120" y="180" width="160" height="100" fill="#c0bcd8" stroke="rgba(60,60,160,0.22)" stroke-width="1.5" transform="rotate(-12, 200, 230)"/>
        <circle cx="200" cy="230" r="60" fill="#4a4a8a" fill-opacity="0.10" stroke="#4a4a8a" stroke-width="1" stroke-opacity="0.16"/>
        <polygon points="380,160 440,160 470,212 440,264 380,264 350,212" fill="#d0c8e8" fill-opacity="0.8" stroke="#6a4a8a" stroke-width="1.5" stroke-opacity="0.28"/>
        <polygon points="600,120 680,220 600,320 520,220" fill="#c8c8e0" stroke="rgba(60,60,180,0.28)" stroke-width="2"/>
        <circle cx="750" cy="260" r="55" fill="#FF3C28" fill-opacity="0.12" stroke="#FF3C28" stroke-width="1.5" stroke-opacity="0.30"/>
        <circle cx="750" cy="260" r="35" fill="#FF3C28" fill-opacity="0.06" stroke="#FF3C28" stroke-width="1" stroke-opacity="0.18"/>
        <rect x="920" y="160" width="200" height="130" fill="#c4c0d8" stroke="rgba(60,60,160,0.18)" stroke-width="1.5" transform="rotate(8, 1020, 225)"/>
        <rect x="0" y="420" width="1200" height="180" fill="#c8c4cc"/>
        <line x1="0" y1="420" x2="1200" y2="420" stroke="rgba(60,60,160,0.12)" stroke-width="1.5"/>
      `,
    },

    // ── Primary subjects (5m) ─────────────────────────────────────────────────
    {
      distance: 5,
      svg: `
        <!-- Large sphere (approximated as circle, will look great blurred) -->
        <defs>
          <radialGradient id="geo-sphere-grad" cx="38%" cy="35%" r="65%">
            <stop offset="0%" stop-color="#6060a8"/>
            <stop offset="60%" stop-color="#3a3a7a"/>
            <stop offset="100%" stop-color="#1a1a3a"/>
          </radialGradient>
          <radialGradient id="geo-cube-grad" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#8a3a28"/>
            <stop offset="100%" stop-color="#4a1a14"/>
          </radialGradient>
        </defs>
        <!-- Main sphere (center) -->
        <circle cx="570" cy="310" r="88" fill="url(#geo-sphere-grad)"/>
        <circle cx="570" cy="310" r="88" fill="none" stroke="#6868b8" stroke-width="1.5" stroke-opacity="0.25"/>
        <!-- Sphere highlight -->
        <circle cx="548" cy="285" r="20" fill="rgba(150,150,255,0.12)"/>
        <!-- Shadow -->
        <ellipse cx="580" cy="400" rx="80" ry="15" fill="rgba(0,0,0,0.45)"/>

        <!-- Cube/box shape right -->
        <!-- Front face -->
        <polygon points="760,250 860,250 860,370 760,370" fill="#2a1218"/>
        <!-- Top face -->
        <polygon points="760,250 800,210 900,210 860,250" fill="#3a1a20"/>
        <!-- Right face -->
        <polygon points="860,250 900,210 900,330 860,370" fill="#1e0e10"/>
        <!-- Red accent stripe -->
        <rect x="760" y="295" width="100" height="8" fill="#8a3030" opacity="0.6"/>

        <!-- Small cylinder left -->
        <ellipse cx="340" cy="240" rx="30" ry="10" fill="#2a283a"/>
        <rect x="310" y="240" width="60" height="110" fill="#2a283a"/>
        <ellipse cx="340" cy="350" rx="30" ry="10" fill="#252335"/>

        <!-- Red sphere (small, accent) -->
        <circle cx="830" cy="200" r="28" fill="#FF3C28" fill-opacity="0.75"/>
        <circle cx="820" cy="192" r="8" fill="rgba(255,200,200,0.25)"/>

        <!-- Ground plane -->
        <rect x="0" y="385" width="1200" height="215" fill="#100f14"/>
        <!-- Ground lines perspective -->
        <line x1="600" y1="385" x2="0" y2="600" stroke="rgba(80,80,160,0.08)" stroke-width="1"/>
        <line x1="600" y1="385" x2="1200" y2="600" stroke="rgba(80,80,160,0.08)" stroke-width="1"/>
      `,
      svgLight: `
        <defs>
          <radialGradient id="geo-sphere-light-grad" cx="38%" cy="35%" r="65%">
            <stop offset="0%" stop-color="#9090c8"/>
            <stop offset="60%" stop-color="#6060a0"/>
            <stop offset="100%" stop-color="#4040788"/>
          </radialGradient>
        </defs>
        <circle cx="570" cy="310" r="88" fill="url(#geo-sphere-light-grad)"/>
        <circle cx="570" cy="310" r="88" fill="none" stroke="#7878c0" stroke-width="1.5" stroke-opacity="0.35"/>
        <circle cx="548" cy="285" r="20" fill="rgba(200,200,255,0.20)"/>
        <ellipse cx="580" cy="400" rx="80" ry="15" fill="rgba(0,0,0,0.18)"/>
        <polygon points="760,250 860,250 860,370 760,370" fill="#c0a0a0"/>
        <polygon points="760,250 800,210 900,210 860,250" fill="#d0b0b0"/>
        <polygon points="860,250 900,210 900,330 860,370" fill="#b08080"/>
        <rect x="760" y="295" width="100" height="8" fill="#a04040" opacity="0.7"/>
        <ellipse cx="340" cy="240" rx="30" ry="10" fill="#9090b0"/>
        <rect x="310" y="240" width="60" height="110" fill="#9090b0"/>
        <ellipse cx="340" cy="350" rx="30" ry="10" fill="#8888a8"/>
        <circle cx="830" cy="200" r="28" fill="#FF3C28" fill-opacity="0.80"/>
        <circle cx="820" cy="192" r="8" fill="rgba(255,220,220,0.35)"/>
        <rect x="0" y="385" width="1200" height="215" fill="#c8c4cc"/>
        <line x1="600" y1="385" x2="0" y2="600" stroke="rgba(60,60,140,0.12)" stroke-width="1"/>
        <line x1="600" y1="385" x2="1200" y2="600" stroke="rgba(60,60,140,0.12)" stroke-width="1"/>
      `,
    },

    // ── Near objects (1.5m) ───────────────────────────────────────────────────
    {
      distance: 1.5,
      svg: `
        <!-- Floating torus ring (left) -->
        <circle cx="180" cy="280" r="65" fill="none" stroke="#4a4a8a" stroke-width="14" stroke-opacity="0.55"/>
        <circle cx="180" cy="280" r="65" fill="none" stroke="#6868b0" stroke-width="6" stroke-opacity="0.30"/>
        <!-- Inner detail -->
        <circle cx="180" cy="280" r="40" fill="none" stroke="#3a3a70" stroke-width="3" stroke-opacity="0.25"/>

        <!-- Floating triangle right -->
        <polygon points="1020,200 1120,380 920,380" fill="#1a1a2a" stroke="#6888cc" stroke-width="3" stroke-opacity="0.40"/>
        <polygon points="1020,220 1104,365 936,365" fill="none" stroke="#4a68aa" stroke-width="1.5" stroke-opacity="0.20"/>

        <!-- Smaller geometric accents -->
        <!-- Pentagon left-center -->
        <polygon points="380,240 420,210 460,230 455,275 375,275" fill="#1e1a2e" stroke="#7a5a9a" stroke-width="2" stroke-opacity="0.30"/>
        <!-- Yellow accent bar -->
        <rect x="490" y="380" width="220" height="8" fill="#8a8a40" opacity="0.35" rx="2"/>
        <!-- Cyan accent circle -->
        <circle cx="850" cy="320" r="35" fill="none" stroke="#208888" stroke-width="3" stroke-opacity="0.35"/>
        <circle cx="850" cy="320" r="22" fill="#102828" stroke="#206060" stroke-width="1.5" stroke-opacity="0.30"/>
      `,
      svgLight: `
        <circle cx="180" cy="280" r="65" fill="none" stroke="#5050a0" stroke-width="14" stroke-opacity="0.60"/>
        <circle cx="180" cy="280" r="65" fill="none" stroke="#7070c0" stroke-width="6" stroke-opacity="0.35"/>
        <circle cx="180" cy="280" r="40" fill="none" stroke="#4040880" stroke-width="3" stroke-opacity="0.30"/>
        <polygon points="1020,200 1120,380 920,380" fill="#c8c0d8" stroke="#5070bb" stroke-width="3" stroke-opacity="0.50"/>
        <polygon points="380,240 420,210 460,230 455,275 375,275" fill="#d0c8e0" stroke="#8060aa" stroke-width="2" stroke-opacity="0.38"/>
        <rect x="490" y="380" width="220" height="8" fill="#8a8a30" opacity="0.50" rx="2"/>
        <circle cx="850" cy="320" r="35" fill="none" stroke="#208888" stroke-width="3" stroke-opacity="0.45"/>
        <circle cx="850" cy="320" r="22" fill="#c0d4d4" stroke="#208888" stroke-width="1.5" stroke-opacity="0.40"/>
      `,
    },

    // ── Close FG frames (0.6m) ────────────────────────────────────────────────
    {
      distance: 0.6,
      svg: `
        <!-- Left edge arc frame -->
        <path d="M0,0 Q120,300 0,600" fill="none" stroke="rgba(80,80,160,0.18)" stroke-width="3"/>
        <path d="M30,50 Q140,300 30,550" fill="none" stroke="rgba(80,80,160,0.10)" stroke-width="2"/>
        <!-- Right edge arc frame -->
        <path d="M1200,0 Q1080,300 1200,600" fill="none" stroke="rgba(80,80,160,0.18)" stroke-width="3"/>
        <path d="M1170,50 Q1060,300 1170,550" fill="none" stroke="rgba(80,80,160,0.10)" stroke-width="2"/>
        <!-- Corner squares (thin) -->
        <rect x="5" y="5" width="80" height="80" fill="none" stroke="rgba(100,100,200,0.14)" stroke-width="1.5"/>
        <rect x="1115" y="5" width="80" height="80" fill="none" stroke="rgba(100,100,200,0.14)" stroke-width="1.5"/>
        <rect x="5" y="515" width="80" height="80" fill="none" stroke="rgba(100,100,200,0.14)" stroke-width="1.5"/>
        <rect x="1115" y="515" width="80" height="80" fill="none" stroke="rgba(100,100,200,0.14)" stroke-width="1.5"/>
        <!-- Center guide lines -->
        <line x1="0" y1="300" x2="80" y2="300" stroke="rgba(100,100,200,0.12)" stroke-width="1"/>
        <line x1="1120" y1="300" x2="1200" y2="300" stroke="rgba(100,100,200,0.12)" stroke-width="1"/>
        <!-- Red accent marks -->
        <rect x="0" y="298" width="25" height="4" fill="#FF3C28" fill-opacity="0.25"/>
        <rect x="1175" y="298" width="25" height="4" fill="#FF3C28" fill-opacity="0.25"/>
      `,
      svgLight: `
        <path d="M0,0 Q120,300 0,600" fill="none" stroke="rgba(60,60,140,0.25)" stroke-width="3"/>
        <path d="M30,50 Q140,300 30,550" fill="none" stroke="rgba(60,60,140,0.14)" stroke-width="2"/>
        <path d="M1200,0 Q1080,300 1200,600" fill="none" stroke="rgba(60,60,140,0.25)" stroke-width="3"/>
        <path d="M1170,50 Q1060,300 1170,550" fill="none" stroke="rgba(60,60,140,0.14)" stroke-width="2"/>
        <rect x="5" y="5" width="80" height="80" fill="none" stroke="rgba(60,60,180,0.20)" stroke-width="1.5"/>
        <rect x="1115" y="5" width="80" height="80" fill="none" stroke="rgba(60,60,180,0.20)" stroke-width="1.5"/>
        <rect x="5" y="515" width="80" height="80" fill="none" stroke="rgba(60,60,180,0.20)" stroke-width="1.5"/>
        <rect x="1115" y="515" width="80" height="80" fill="none" stroke="rgba(60,60,180,0.20)" stroke-width="1.5"/>
        <rect x="0" y="298" width="25" height="4" fill="#FF3C28" fill-opacity="0.35"/>
        <rect x="1175" y="298" width="25" height="4" fill="#FF3C28" fill-opacity="0.35"/>
      `,
    },

    // ── Bokeh (0.3m) ──────────────────────────────────────────────────────────
    {
      distance: 0.3,
      svg: `
        <!-- Blue geometric bokeh left -->
        <polygon points="100,250 128,235 128,205 100,190 72,205 72,235" fill="#4a4a8a" fill-opacity="0.03" stroke="#4a4a8a" stroke-width="2" stroke-opacity="0.06"/>
        <polygon points="100,290 122,278 122,254 100,242 78,254 78,278" fill="#4a4a8a" fill-opacity="0.02" stroke="#4a4a8a" stroke-width="1.5" stroke-opacity="0.05"/>
        <!-- Red accent bokeh -->
        <polygon points="60,370 82,358 82,334 60,322 38,334 38,358" fill="#FF3C28" fill-opacity="0.02" stroke="#FF3C28" stroke-width="1.5" stroke-opacity="0.05"/>
        <!-- Yellow bokeh center -->
        <circle cx="580" cy="100" r="32" fill="none" stroke="#8a8a40" stroke-width="2" stroke-opacity="0.04"/>
        <circle cx="640" cy="140" r="22" fill="none" stroke="#8a8a40" stroke-width="1.5" stroke-opacity="0.035"/>
        <!-- Cyan bokeh right -->
        <polygon points="1100,240 1128,225 1128,195 1100,180 1072,195 1072,225" fill="#208888" fill-opacity="0.03" stroke="#208888" stroke-width="2" stroke-opacity="0.06"/>
        <polygon points="1140,310 1162,298 1162,274 1140,262 1118,274 1118,298" fill="#208888" fill-opacity="0.02" stroke="#208888" stroke-width="1.5" stroke-opacity="0.05"/>
        <!-- Large faint circle (left) -->
        <circle cx="150" cy="350" r="60" fill="none" stroke="#4a4a8a" stroke-width="2" stroke-opacity="0.035"/>
        <!-- Large faint circle (right) -->
        <circle cx="1050" cy="350" r="55" fill="none" stroke="#208888" stroke-width="2" stroke-opacity="0.035"/>
      `,
      svgLight: `
        <polygon points="100,250 128,235 128,205 100,190 72,205 72,235" fill="#4040880" fill-opacity="0.04" stroke="#404088" stroke-width="2" stroke-opacity="0.08"/>
        <polygon points="100,290 122,278 122,254 100,242 78,254 78,278" fill="#404088" fill-opacity="0.03" stroke="#404088" stroke-width="1.5" stroke-opacity="0.06"/>
        <polygon points="60,370 82,358 82,334 60,322 38,334 38,358" fill="#CC2820" fill-opacity="0.03" stroke="#CC2820" stroke-width="1.5" stroke-opacity="0.07"/>
        <circle cx="580" cy="100" r="32" fill="none" stroke="#707020" stroke-width="2" stroke-opacity="0.06"/>
        <circle cx="640" cy="140" r="22" fill="none" stroke="#707020" stroke-width="1.5" stroke-opacity="0.05"/>
        <polygon points="1100,240 1128,225 1128,195 1100,180 1072,195 1072,225" fill="#186868" fill-opacity="0.04" stroke="#186868" stroke-width="2" stroke-opacity="0.08"/>
        <circle cx="150" cy="350" r="60" fill="none" stroke="#404088" stroke-width="2" stroke-opacity="0.05"/>
        <circle cx="1050" cy="350" r="55" fill="none" stroke="#186868" stroke-width="2" stroke-opacity="0.05"/>
      `,
    },
  ],
};
