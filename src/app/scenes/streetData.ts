import type { SceneData } from './types';

export const streetScene: SceneData = {
  id: 'street',
  name: 'Street',
  layers: [
    // ── Sky (Infinity) ────────────────────────────────────────────────────────
    {
      distance: Infinity,
      svg: `
        <defs>
          <radialGradient id="st-moon-glow" cx="21%" cy="13%" r="18%">
            <stop offset="0%" stop-color="#d4c890" stop-opacity="0.18"/>
            <stop offset="100%" stop-color="#d4c890" stop-opacity="0"/>
          </radialGradient>
          <radialGradient id="st-sky-grad" cx="50%" cy="100%" r="70%">
            <stop offset="0%" stop-color="#0d1520" stop-opacity="0.6"/>
            <stop offset="100%" stop-color="#080a10" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="1200" height="285" fill="#080a10"/>
        <rect x="0" y="0" width="1200" height="285" fill="url(#st-sky-grad)"/>
        <rect x="0" y="0" width="1200" height="285" fill="url(#st-moon-glow)"/>
        <!-- Moon -->
        <circle cx="252" cy="78" r="24" fill="#cec8a0" opacity="0.82"/>
        <circle cx="252" cy="78" r="40" fill="#cec8a0" opacity="0.06"/>
        <circle cx="252" cy="78" r="70" fill="#cec8a0" opacity="0.025"/>
        <!-- Stars -->
        <circle cx="68" cy="22" r="1.1" fill="rgba(200,220,255,0.55)"/>
        <circle cx="140" cy="14" r="0.9" fill="rgba(200,220,255,0.50)"/>
        <circle cx="195" cy="38" r="0.8" fill="rgba(200,220,255,0.40)"/>
        <circle cx="318" cy="26" r="1.2" fill="rgba(200,220,255,0.48)"/>
        <circle cx="390" cy="10" r="0.9" fill="rgba(200,220,255,0.42)"/>
        <circle cx="440" cy="45" r="0.7" fill="rgba(200,220,255,0.35)"/>
        <circle cx="510" cy="19" r="1.0" fill="rgba(200,220,255,0.50)"/>
        <circle cx="570" cy="8"  r="0.8" fill="rgba(200,220,255,0.38)"/>
        <circle cx="630" cy="32" r="1.1" fill="rgba(200,220,255,0.44)"/>
        <circle cx="700" cy="18" r="0.8" fill="rgba(200,220,255,0.36)"/>
        <circle cx="760" cy="42" r="1.0" fill="rgba(200,220,255,0.52)"/>
        <circle cx="820" cy="12" r="0.9" fill="rgba(200,220,255,0.40)"/>
        <circle cx="890" cy="28" r="1.2" fill="rgba(200,220,255,0.46)"/>
        <circle cx="950" cy="16" r="0.8" fill="rgba(200,220,255,0.38)"/>
        <circle cx="1010" cy="38" r="0.9" fill="rgba(200,220,255,0.42)"/>
        <circle cx="1075" cy="22" r="1.1" fill="rgba(200,220,255,0.48)"/>
        <circle cx="1130" cy="10" r="0.8" fill="rgba(200,220,255,0.35)"/>
        <circle cx="1175" cy="30" r="1.0" fill="rgba(200,220,255,0.44)"/>
      `,
      svgLight: `
        <defs>
          <linearGradient id="st-sky-light-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#a8c4d8"/>
            <stop offset="100%" stop-color="#c8d8e8"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="1200" height="285" fill="url(#st-sky-light-grad)"/>
        <!-- Clouds -->
        <ellipse cx="300" cy="80" rx="120" ry="30" fill="white" opacity="0.6"/>
        <ellipse cx="380" cy="70" rx="80" ry="22" fill="white" opacity="0.5"/>
        <ellipse cx="850" cy="60" rx="100" ry="25" fill="white" opacity="0.55"/>
        <ellipse cx="950" cy="50" rx="70" ry="18" fill="white" opacity="0.45"/>
      `,
    },

    // ── Far cityscape (80m) ────────────────────────────────────────────────────
    {
      distance: 80,
      svg: `
        <!-- Distant skyline silhouette -->
        <path d="M0,260 L0,218 L25,218 L25,200 L55,200 L55,185 L80,185 L80,208 L110,208 L110,192 L145,192 L145,172 L175,172 L175,168 L210,168 L210,195 L250,195 L250,178 L290,178 L290,162 L330,162 L330,188 L370,188 L370,176 L415,176 L415,158 L455,158 L455,178 L490,178 L490,192 L535,192 L535,168 L575,168 L575,148 L620,148 L620,168 L665,168 L665,180 L705,180 L705,162 L750,162 L750,145 L800,145 L800,168 L845,168 L845,180 L890,180 L890,165 L930,165 L930,148 L975,148 L975,168 L1015,168 L1015,178 L1055,178 L1055,158 L1100,158 L1100,188 L1145,188 L1145,208 L1180,208 L1180,220 L1200,220 L1200,260 Z" fill="#0e1118"/>
        <!-- Lit windows far -->
        <rect x="58" y="192" width="5" height="7" fill="#d4a844" opacity="0.32"/>
        <rect x="160" y="178" width="5" height="6" fill="#d4a844" opacity="0.25"/>
        <rect x="175" y="178" width="4" height="6" fill="#d4a844" opacity="0.20"/>
        <rect x="295" y="170" width="5" height="7" fill="#d4a844" opacity="0.30"/>
        <rect x="420" y="165" width="4" height="6" fill="#d4a844" opacity="0.28"/>
        <rect x="432" y="165" width="4" height="6" fill="#000a0a" opacity="0.5"/>
        <rect x="580" y="155" width="5" height="7" fill="#d4a844" opacity="0.35"/>
        <rect x="595" y="155" width="4" height="6" fill="#d4a844" opacity="0.22"/>
        <rect x="632" y="158" width="5" height="7" fill="#d4a844" opacity="0.18"/>
        <rect x="758" y="152" width="5" height="7" fill="#d4a844" opacity="0.32"/>
        <rect x="808" y="175" width="4" height="6" fill="#d4a844" opacity="0.25"/>
        <rect x="938" y="155" width="5" height="7" fill="#d4a844" opacity="0.30"/>
        <rect x="980" y="175" width="4" height="6" fill="#d4a844" opacity="0.20"/>
        <rect x="1064" y="165" width="5" height="7" fill="#d4a844" opacity="0.28"/>
        <!-- Water tower right -->
        <rect x="1070" y="142" width="22" height="16" fill="#111520" rx="2"/>
        <rect x="1073" y="136" width="16" height="8" fill="#111520"/>
        <rect x="1079" y="128" width="4" height="12" fill="#111520"/>
      `,
      svgLight: `
        <path d="M0,260 L0,218 L25,218 L25,200 L55,200 L55,185 L80,185 L80,208 L110,208 L110,192 L145,192 L145,172 L175,172 L175,168 L210,168 L210,195 L250,195 L250,178 L290,178 L290,162 L330,162 L330,188 L370,188 L370,176 L415,176 L415,158 L455,158 L455,178 L490,178 L490,192 L535,192 L535,168 L575,168 L575,148 L620,148 L620,168 L665,168 L665,180 L705,180 L705,162 L750,162 L750,145 L800,145 L800,168 L845,168 L845,180 L890,180 L890,165 L930,165 L930,148 L975,148 L975,168 L1015,168 L1015,178 L1055,178 L1055,158 L1100,158 L1100,188 L1145,188 L1145,208 L1180,208 L1180,220 L1200,220 L1200,260 Z" fill="#8898a8"/>
        <rect x="58" y="192" width="5" height="7" fill="#a08030" opacity="0.45"/>
        <rect x="295" y="170" width="5" height="7" fill="#a08030" opacity="0.40"/>
        <rect x="580" y="155" width="5" height="7" fill="#a08030" opacity="0.50"/>
        <rect x="758" y="152" width="5" height="7" fill="#a08030" opacity="0.42"/>
        <rect x="1064" y="165" width="5" height="7" fill="#a08030" opacity="0.38"/>
        <rect x="1070" y="142" width="22" height="16" fill="#909aa8" rx="2"/>
        <rect x="1073" y="136" width="16" height="8" fill="#909aa8"/>
        <rect x="1079" y="128" width="4" height="12" fill="#909aa8"/>
      `,
    },

    // ── Mid buildings (20m) ────────────────────────────────────────────────────
    {
      distance: 20,
      svg: `
        <!-- Left block -->
        <rect x="0" y="185" width="100" height="80" fill="#141822"/>
        <!-- Window grid left -->
        <rect x="10" y="195" width="10" height="14" fill="#d4a844" opacity="0.45"/>
        <rect x="28" y="195" width="10" height="14" fill="#0a0a0a"/>
        <rect x="46" y="195" width="10" height="14" fill="#d4a844" opacity="0.30"/>
        <rect x="64" y="195" width="10" height="14" fill="#d4a844" opacity="0.18"/>
        <rect x="10" y="216" width="10" height="14" fill="#0a0a0a"/>
        <rect x="28" y="216" width="10" height="14" fill="#d4a844" opacity="0.38"/>
        <rect x="46" y="216" width="10" height="14" fill="#0a0a0a"/>
        <rect x="64" y="216" width="10" height="14" fill="#d4a844" opacity="0.22"/>
        <!-- Mid-left tower -->
        <rect x="140" y="160" width="90" height="105" fill="#141822"/>
        <rect x="148" y="170" width="11" height="16" fill="#d4a844" opacity="0.50"/>
        <rect x="166" y="170" width="11" height="16" fill="#0a0808"/>
        <rect x="184" y="170" width="11" height="16" fill="#d4a844" opacity="0.28"/>
        <rect x="202" y="170" width="11" height="16" fill="#d4a844" opacity="0.40"/>
        <rect x="148" y="193" width="11" height="16" fill="#0a0808"/>
        <rect x="166" y="193" width="11" height="16" fill="#d4a844" opacity="0.35"/>
        <rect x="184" y="193" width="11" height="16" fill="#d4a844" opacity="0.20"/>
        <rect x="202" y="193" width="11" height="16" fill="#0a0808"/>
        <rect x="148" y="216" width="11" height="16" fill="#d4a844" opacity="0.42"/>
        <rect x="166" y="216" width="11" height="16" fill="#0a0808"/>
        <rect x="184" y="216" width="11" height="16" fill="#d4a844" opacity="0.32"/>
        <rect x="202" y="216" width="11" height="16" fill="#d4a844" opacity="0.18"/>
        <!-- Centre-left short block -->
        <rect x="280" y="200" width="75" height="65" fill="#111820"/>
        <rect x="290" y="210" width="9" height="13" fill="#d4a844" opacity="0.38"/>
        <rect x="306" y="210" width="9" height="13" fill="#0a0a0a"/>
        <rect x="322" y="210" width="9" height="13" fill="#d4a844" opacity="0.25"/>
        <rect x="290" y="230" width="9" height="13" fill="#d4a844" opacity="0.30"/>
        <rect x="306" y="230" width="9" height="13" fill="#d4a844" opacity="0.15"/>
        <rect x="322" y="230" width="9" height="13" fill="#0a0a0a"/>
        <!-- Centre tall tower -->
        <rect x="480" y="140" width="110" height="125" fill="#141c28"/>
        <rect x="490" y="150" width="12" height="18" fill="#d4a844" opacity="0.55"/>
        <rect x="510" y="150" width="12" height="18" fill="#0a0a10"/>
        <rect x="530" y="150" width="12" height="18" fill="#d4a844" opacity="0.30"/>
        <rect x="550" y="150" width="12" height="18" fill="#d4a844" opacity="0.42"/>
        <rect x="490" y="176" width="12" height="18" fill="#0a0a10"/>
        <rect x="510" y="176" width="12" height="18" fill="#d4a844" opacity="0.48"/>
        <rect x="530" y="176" width="12" height="18" fill="#d4a844" opacity="0.22"/>
        <rect x="550" y="176" width="12" height="18" fill="#0a0a10"/>
        <rect x="490" y="202" width="12" height="18" fill="#d4a844" opacity="0.35"/>
        <rect x="510" y="202" width="12" height="18" fill="#0a0a10"/>
        <rect x="530" y="202" width="12" height="18" fill="#d4a844" opacity="0.45"/>
        <rect x="550" y="202" width="12" height="18" fill="#d4a844" opacity="0.18"/>
        <!-- Right mid block -->
        <rect x="720" y="175" width="95" height="90" fill="#141822"/>
        <rect x="730" y="185" width="11" height="16" fill="#d4a844" opacity="0.40"/>
        <rect x="748" y="185" width="11" height="16" fill="#0a0a0a"/>
        <rect x="766" y="185" width="11" height="16" fill="#d4a844" opacity="0.28"/>
        <rect x="784" y="185" width="11" height="16" fill="#d4a844" opacity="0.35"/>
        <rect x="730" y="208" width="11" height="16" fill="#0a0a0a"/>
        <rect x="748" y="208" width="11" height="16" fill="#d4a844" opacity="0.32"/>
        <rect x="766" y="208" width="11" height="16" fill="#0a0a0a"/>
        <rect x="784" y="208" width="11" height="16" fill="#d4a844" opacity="0.20"/>
        <!-- Far-right tower -->
        <rect x="1000" y="155" width="85" height="110" fill="#141822"/>
        <rect x="1010" y="165" width="11" height="16" fill="#d4a844" opacity="0.48"/>
        <rect x="1028" y="165" width="11" height="16" fill="#0a0808"/>
        <rect x="1046" y="165" width="11" height="16" fill="#d4a844" opacity="0.25"/>
        <rect x="1064" y="165" width="11" height="16" fill="#d4a844" opacity="0.38"/>
        <rect x="1010" y="188" width="11" height="16" fill="#0a0808"/>
        <rect x="1028" y="188" width="11" height="16" fill="#d4a844" opacity="0.42"/>
        <rect x="1046" y="188" width="11" height="16" fill="#0a0808"/>
        <rect x="1064" y="188" width="11" height="16" fill="#d4a844" opacity="0.22"/>
        <rect x="1010" y="211" width="11" height="16" fill="#d4a844" opacity="0.30"/>
        <rect x="1028" y="211" width="11" height="16" fill="#0a0808"/>
        <rect x="1046" y="211" width="11" height="16" fill="#d4a844" opacity="0.35"/>
        <!-- Right edge block -->
        <rect x="1130" y="195" width="70" height="70" fill="#111820"/>
        <rect x="1140" y="205" width="9" height="13" fill="#d4a844" opacity="0.38"/>
        <rect x="1156" y="205" width="9" height="13" fill="#0a0a0a"/>
        <rect x="1172" y="205" width="9" height="13" fill="#d4a844" opacity="0.25"/>
      `,
      svgLight: `
        <rect x="0" y="185" width="100" height="80" fill="#9aabb8"/>
        <rect x="10" y="195" width="10" height="14" fill="#a08030" opacity="0.55"/>
        <rect x="28" y="195" width="10" height="14" fill="#7a8898"/>
        <rect x="46" y="195" width="10" height="14" fill="#a08030" opacity="0.40"/>
        <rect x="64" y="195" width="10" height="14" fill="#a08030" opacity="0.28"/>
        <rect x="10" y="216" width="10" height="14" fill="#7a8898"/>
        <rect x="28" y="216" width="10" height="14" fill="#a08030" opacity="0.48"/>
        <rect x="46" y="216" width="10" height="14" fill="#7a8898"/>
        <rect x="64" y="216" width="10" height="14" fill="#a08030" opacity="0.32"/>
        <rect x="140" y="160" width="90" height="105" fill="#94a0b0"/>
        <rect x="148" y="170" width="11" height="16" fill="#a08030" opacity="0.60"/>
        <rect x="166" y="170" width="11" height="16" fill="#7a8898"/>
        <rect x="184" y="170" width="11" height="16" fill="#a08030" opacity="0.38"/>
        <rect x="202" y="170" width="11" height="16" fill="#a08030" opacity="0.50"/>
        <rect x="148" y="193" width="11" height="16" fill="#7a8898"/>
        <rect x="166" y="193" width="11" height="16" fill="#a08030" opacity="0.45"/>
        <rect x="184" y="193" width="11" height="16" fill="#a08030" opacity="0.28"/>
        <rect x="202" y="193" width="11" height="16" fill="#7a8898"/>
        <rect x="148" y="216" width="11" height="16" fill="#a08030" opacity="0.52"/>
        <rect x="166" y="216" width="11" height="16" fill="#7a8898"/>
        <rect x="184" y="216" width="11" height="16" fill="#a08030" opacity="0.40"/>
        <rect x="202" y="216" width="11" height="16" fill="#a08030" opacity="0.25"/>
        <rect x="480" y="140" width="110" height="125" fill="#8898aa"/>
        <rect x="490" y="150" width="12" height="18" fill="#a08030" opacity="0.65"/>
        <rect x="510" y="150" width="12" height="18" fill="#7a8898"/>
        <rect x="530" y="150" width="12" height="18" fill="#a08030" opacity="0.40"/>
        <rect x="550" y="150" width="12" height="18" fill="#a08030" opacity="0.52"/>
        <rect x="490" y="176" width="12" height="18" fill="#7a8898"/>
        <rect x="510" y="176" width="12" height="18" fill="#a08030" opacity="0.58"/>
        <rect x="530" y="176" width="12" height="18" fill="#a08030" opacity="0.30"/>
        <rect x="550" y="176" width="12" height="18" fill="#7a8898"/>
        <rect x="720" y="175" width="95" height="90" fill="#94a0b0"/>
        <rect x="730" y="185" width="11" height="16" fill="#a08030" opacity="0.50"/>
        <rect x="748" y="185" width="11" height="16" fill="#7a8898"/>
        <rect x="766" y="185" width="11" height="16" fill="#a08030" opacity="0.38"/>
        <rect x="784" y="185" width="11" height="16" fill="#a08030" opacity="0.45"/>
        <rect x="1000" y="155" width="85" height="110" fill="#94a0b0"/>
        <rect x="1010" y="165" width="11" height="16" fill="#a08030" opacity="0.58"/>
        <rect x="1028" y="165" width="11" height="16" fill="#7a8898"/>
        <rect x="1046" y="165" width="11" height="16" fill="#a08030" opacity="0.35"/>
        <rect x="1064" y="165" width="11" height="16" fill="#a08030" opacity="0.48"/>
      `,
    },

    // ── Ground / road (10m) ────────────────────────────────────────────────────
    {
      distance: 10,
      svg: `
        <!-- Ground plane -->
        <rect x="0" y="252" width="1200" height="350" fill="#12141a"/>
        <!-- Sidewalks (lighter strips) -->
        <rect x="0" y="252" width="1200" height="22" fill="#181a22"/>
        <!-- Road surface (darker center band) -->
        <rect x="200" y="252" width="800" height="350" fill="#0e1016"/>
        <!-- Road edge lines -->
        <line x1="200" y1="252" x2="200" y2="600" stroke="#d4a844" stroke-width="2" stroke-opacity="0.18"/>
        <line x1="1000" y1="252" x2="1000" y2="600" stroke="#d4a844" stroke-width="2" stroke-opacity="0.18"/>
        <!-- Center dashed line -->
        <line x1="600" y1="270" x2="600" y2="320" stroke="#d4a844" stroke-width="3" stroke-opacity="0.28" stroke-dasharray="18,22"/>
        <line x1="600" y1="360" x2="600" y2="430" stroke="#d4a844" stroke-width="3" stroke-opacity="0.22" stroke-dasharray="18,22"/>
        <line x1="600" y1="470" x2="600" y2="560" stroke="#d4a844" stroke-width="3" stroke-opacity="0.15" stroke-dasharray="18,22"/>
        <!-- Crosswalk marks (far) -->
        <rect x="400" y="255" width="20" height="6" fill="#d4a844" opacity="0.14"/>
        <rect x="426" y="255" width="20" height="6" fill="#d4a844" opacity="0.14"/>
        <rect x="452" y="255" width="20" height="6" fill="#d4a844" opacity="0.14"/>
        <rect x="478" y="255" width="20" height="6" fill="#d4a844" opacity="0.14"/>
        <!-- Ground reflections (wet road) -->
        <rect x="350" y="300" width="500" height="80" fill="#1a1c28" opacity="0.3"/>
        <!-- Manhole cover -->
        <circle cx="600" cy="350" r="18" fill="#181820" stroke="#252530" stroke-width="1.5"/>
        <circle cx="600" cy="350" r="12" fill="none" stroke="#252530" stroke-width="1"/>
      `,
      svgLight: `
        <rect x="0" y="252" width="1200" height="350" fill="#b0b8c4"/>
        <rect x="0" y="252" width="1200" height="22" fill="#bcc4cc"/>
        <rect x="200" y="252" width="800" height="350" fill="#a8b0bc"/>
        <line x1="200" y1="252" x2="200" y2="600" stroke="#8a7030" stroke-width="2" stroke-opacity="0.30"/>
        <line x1="1000" y1="252" x2="1000" y2="600" stroke="#8a7030" stroke-width="2" stroke-opacity="0.30"/>
        <line x1="600" y1="270" x2="600" y2="320" stroke="#8a7030" stroke-width="3" stroke-opacity="0.35" stroke-dasharray="18,22"/>
        <line x1="600" y1="360" x2="600" y2="430" stroke="#8a7030" stroke-width="3" stroke-opacity="0.28" stroke-dasharray="18,22"/>
        <rect x="400" y="255" width="20" height="6" fill="#8a7030" opacity="0.22"/>
        <rect x="426" y="255" width="20" height="6" fill="#8a7030" opacity="0.22"/>
        <rect x="452" y="255" width="20" height="6" fill="#8a7030" opacity="0.22"/>
        <rect x="478" y="255" width="20" height="6" fill="#8a7030" opacity="0.22"/>
        <circle cx="600" cy="350" r="18" fill="#9aa0aa" stroke="#8898a8" stroke-width="1.5"/>
        <circle cx="600" cy="350" r="12" fill="none" stroke="#8898a8" stroke-width="1"/>
      `,
    },

    // ── Subject: lamppost + person (4m) ───────────────────────────────────────
    {
      distance: 4,
      svg: `
        <defs>
          <radialGradient id="st-lamp-halo" cx="50%" cy="100%" r="60%">
            <stop offset="0%" stop-color="#ffe080" stop-opacity="0.22"/>
            <stop offset="60%" stop-color="#ffe080" stop-opacity="0.06"/>
            <stop offset="100%" stop-color="#ffe080" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <!-- Lamp post pole -->
        <rect x="748" y="148" width="7" height="118" fill="#706858" rx="2"/>
        <!-- Lamp arm -->
        <rect x="720" y="148" width="36" height="5" fill="#706858" rx="2"/>
        <!-- Lamp globe -->
        <ellipse cx="724" cy="150" rx="14" ry="10" fill="#fffccc" opacity="0.9"/>
        <ellipse cx="724" cy="150" rx="20" ry="16" fill="#ffe880" opacity="0.12"/>
        <!-- Light halo on ground -->
        <ellipse cx="730" cy="260" rx="80" ry="20" fill="url(#st-lamp-halo)"/>
        <!-- Lamp cone of light -->
        <path d="M724,158 L680,260 L780,260 Z" fill="#ffe080" opacity="0.04"/>

        <!-- Person silhouette (slightly right of center) -->
        <!-- Shadow -->
        <ellipse cx="638" cy="265" rx="18" ry="5" fill="rgba(0,0,0,0.35)"/>
        <!-- Legs -->
        <path d="M628,240 L622,265 L632,265 Z" fill="#3a4050"/>
        <path d="M648,240 L642,265 L653,265 Z" fill="#3a4050"/>
        <!-- Body -->
        <path d="M622,200 Q618,220 620,240 L656,240 Q658,220 654,200 Z" fill="#3a4050"/>
        <!-- Head -->
        <ellipse cx="638" cy="192" rx="12" ry="14" fill="#b09080" opacity="0.85"/>
        <!-- Arm holding coffee cup -->
        <path d="M622,210 Q608,218 605,224" fill="none" stroke="#3a4050" stroke-width="5" stroke-linecap="round"/>
        <rect x="600" y="222" width="10" height="12" fill="#5a4030" rx="2"/>
      `,
      svgLight: `
        <rect x="748" y="148" width="7" height="118" fill="#90887a" rx="2"/>
        <rect x="720" y="148" width="36" height="5" fill="#90887a" rx="2"/>
        <ellipse cx="724" cy="150" rx="14" ry="10" fill="#e8e0c8" opacity="0.85"/>
        <ellipse cx="638" cy="265" rx="18" ry="5" fill="rgba(0,0,0,0.12)"/>
        <path d="M628,240 L622,265 L632,265 Z" fill="#606878"/>
        <path d="M648,240 L642,265 L653,265 Z" fill="#606878"/>
        <path d="M622,200 Q618,220 620,240 L656,240 Q658,220 654,200 Z" fill="#606878"/>
        <ellipse cx="638" cy="192" rx="12" ry="14" fill="#c0a090" opacity="0.90"/>
        <path d="M622,210 Q608,218 605,224" fill="none" stroke="#606878" stroke-width="5" stroke-linecap="round"/>
        <rect x="600" y="222" width="10" height="12" fill="#80705a" rx="2"/>
      `,
    },

    // ── Near urban furniture (1.5m) ────────────────────────────────────────────
    {
      distance: 1.5,
      svg: `
        <!-- Bench (left of center) -->
        <!-- Seat -->
        <rect x="320" y="245" width="110" height="10" fill="#3a404a" rx="2"/>
        <!-- Backrest -->
        <rect x="320" y="228" width="110" height="8" fill="#3a404a" rx="2"/>
        <!-- Bench legs -->
        <rect x="328" y="254" width="8" height="18" fill="#2e3440" rx="1"/>
        <rect x="415" y="254" width="8" height="18" fill="#2e3440" rx="1"/>
        <!-- Backrest support -->
        <rect x="335" y="228" width="5" height="28" fill="#2e3440" rx="1"/>
        <rect x="420" y="228" width="5" height="28" fill="#2e3440" rx="1"/>

        <!-- Bollards (spread across) -->
        <rect x="180" y="240" width="12" height="28" fill="#383838" rx="3"/>
        <rect x="186" y="236" width="10" height="6" fill="#444" rx="2"/>
        <rect x="220" y="240" width="12" height="28" fill="#383838" rx="3"/>
        <rect x="226" y="236" width="10" height="6" fill="#444" rx="2"/>

        <!-- Fire hydrant -->
        <rect x="960" y="244" width="18" height="22" fill="#8a3030" rx="3"/>
        <rect x="957" y="242" width="24" height="6" fill="#8a3030" rx="2"/>
        <rect x="963" y="236" width="12" height="8" fill="#723030" rx="2"/>
        <!-- Hydrant side caps -->
        <rect x="952" y="250" width="8" height="6" fill="#8a3030" rx="1"/>
        <rect x="978" y="250" width="8" height="6" fill="#8a3030" rx="1"/>

        <!-- Trash can (far right) -->
        <path d="M1060,238 L1060,265 Q1060,268 1063,268 L1083,268 Q1086,268 1086,265 L1086,238 Z" fill="#484840"/>
        <rect x="1058" y="236" width="30" height="5" fill="#555550" rx="1"/>
        <rect x="1065" y="232" width="16" height="5" fill="#555550" rx="2"/>
      `,
      svgLight: `
        <rect x="320" y="245" width="110" height="10" fill="#7a8090" rx="2"/>
        <rect x="320" y="228" width="110" height="8" fill="#7a8090" rx="2"/>
        <rect x="328" y="254" width="8" height="18" fill="#6a7080" rx="1"/>
        <rect x="415" y="254" width="8" height="18" fill="#6a7080" rx="1"/>
        <rect x="335" y="228" width="5" height="28" fill="#6a7080" rx="1"/>
        <rect x="420" y="228" width="5" height="28" fill="#6a7080" rx="1"/>
        <rect x="180" y="240" width="12" height="28" fill="#808898" rx="3"/>
        <rect x="186" y="236" width="10" height="6" fill="#8898a8" rx="2"/>
        <rect x="220" y="240" width="12" height="28" fill="#808898" rx="3"/>
        <rect x="226" y="236" width="10" height="6" fill="#8898a8" rx="2"/>
        <rect x="960" y="244" width="18" height="22" fill="#a04040" rx="3"/>
        <rect x="957" y="242" width="24" height="6" fill="#a04040" rx="2"/>
        <rect x="963" y="236" width="12" height="8" fill="#904040" rx="2"/>
        <rect x="952" y="250" width="8" height="6" fill="#a04040" rx="1"/>
        <rect x="978" y="250" width="8" height="6" fill="#a04040" rx="1"/>
        <path d="M1060,238 L1060,265 Q1060,268 1063,268 L1083,268 Q1086,268 1086,265 L1086,238 Z" fill="#7a8088"/>
        <rect x="1058" y="236" width="30" height="5" fill="#8898a8" rx="1"/>
        <rect x="1065" y="232" width="16" height="5" fill="#8898a8" rx="2"/>
      `,
    },

    // ── Close FG: railings (0.6m) ─────────────────────────────────────────────
    {
      distance: 0.6,
      svg: `
        <!-- Left railing section -->
        <!-- Top rail -->
        <rect x="0" y="218" width="280" height="8" fill="#484840" rx="2"/>
        <!-- Bottom rail -->
        <rect x="0" y="255" width="280" height="6" fill="#3e3e38" rx="1"/>
        <!-- Vertical posts left side -->
        <rect x="10" y="218" width="7" height="43" fill="#404038" rx="1"/>
        <rect x="38" y="218" width="6" height="43" fill="#404038" rx="1"/>
        <rect x="66" y="218" width="6" height="43" fill="#404038" rx="1"/>
        <rect x="94" y="218" width="6" height="43" fill="#404038" rx="1"/>
        <rect x="122" y="218" width="6" height="43" fill="#404038" rx="1"/>
        <rect x="150" y="218" width="6" height="43" fill="#404038" rx="1"/>
        <rect x="178" y="218" width="6" height="43" fill="#404038" rx="1"/>
        <rect x="206" y="218" width="6" height="43" fill="#404038" rx="1"/>
        <rect x="234" y="218" width="6" height="43" fill="#404038" rx="1"/>
        <rect x="262" y="218" width="6" height="43" fill="#404038" rx="1"/>
        <!-- Reflective strip on top rail (safety) -->
        <rect x="0" y="218" width="280" height="2" fill="#d4a844" opacity="0.12"/>

        <!-- Right railing section -->
        <rect x="920" y="218" width="280" height="8" fill="#484840" rx="2"/>
        <rect x="920" y="255" width="280" height="6" fill="#3e3e38" rx="1"/>
        <rect x="926" y="218" width="7" height="43" fill="#404038" rx="1"/>
        <rect x="954" y="218" width="6" height="43" fill="#404038" rx="1"/>
        <rect x="982" y="218" width="6" height="43" fill="#404038" rx="1"/>
        <rect x="1010" y="218" width="6" height="43" fill="#404038" rx="1"/>
        <rect x="1038" y="218" width="6" height="43" fill="#404038" rx="1"/>
        <rect x="1066" y="218" width="6" height="43" fill="#404038" rx="1"/>
        <rect x="1094" y="218" width="6" height="43" fill="#404038" rx="1"/>
        <rect x="1122" y="218" width="6" height="43" fill="#404038" rx="1"/>
        <rect x="1150" y="218" width="6" height="43" fill="#404038" rx="1"/>
        <rect x="1178" y="218" width="6" height="43" fill="#404038" rx="1"/>
        <rect x="920" y="218" width="280" height="2" fill="#d4a844" opacity="0.12"/>
      `,
      svgLight: `
        <rect x="0" y="218" width="280" height="8" fill="#7a8090" rx="2"/>
        <rect x="0" y="255" width="280" height="6" fill="#7a8090" rx="1"/>
        <rect x="10" y="218" width="7" height="43" fill="#6a7080" rx="1"/>
        <rect x="38" y="218" width="6" height="43" fill="#6a7080" rx="1"/>
        <rect x="66" y="218" width="6" height="43" fill="#6a7080" rx="1"/>
        <rect x="94" y="218" width="6" height="43" fill="#6a7080" rx="1"/>
        <rect x="122" y="218" width="6" height="43" fill="#6a7080" rx="1"/>
        <rect x="150" y="218" width="6" height="43" fill="#6a7080" rx="1"/>
        <rect x="178" y="218" width="6" height="43" fill="#6a7080" rx="1"/>
        <rect x="206" y="218" width="6" height="43" fill="#6a7080" rx="1"/>
        <rect x="234" y="218" width="6" height="43" fill="#6a7080" rx="1"/>
        <rect x="262" y="218" width="6" height="43" fill="#6a7080" rx="1"/>
        <rect x="0" y="218" width="280" height="2" fill="#a08030" opacity="0.18"/>
        <rect x="920" y="218" width="280" height="8" fill="#7a8090" rx="2"/>
        <rect x="920" y="255" width="280" height="6" fill="#7a8090" rx="1"/>
        <rect x="926" y="218" width="7" height="43" fill="#6a7080" rx="1"/>
        <rect x="954" y="218" width="6" height="43" fill="#6a7080" rx="1"/>
        <rect x="982" y="218" width="6" height="43" fill="#6a7080" rx="1"/>
        <rect x="1010" y="218" width="6" height="43" fill="#6a7080" rx="1"/>
        <rect x="1038" y="218" width="6" height="43" fill="#6a7080" rx="1"/>
        <rect x="1066" y="218" width="6" height="43" fill="#6a7080" rx="1"/>
        <rect x="1094" y="218" width="6" height="43" fill="#6a7080" rx="1"/>
        <rect x="1122" y="218" width="6" height="43" fill="#6a7080" rx="1"/>
        <rect x="1150" y="218" width="6" height="43" fill="#6a7080" rx="1"/>
        <rect x="1178" y="218" width="6" height="43" fill="#6a7080" rx="1"/>
        <rect x="920" y="218" width="280" height="2" fill="#a08030" opacity="0.18"/>
      `,
    },

    // ── Bokeh (0.3m) ──────────────────────────────────────────────────────────
    {
      distance: 0.3,
      svg: `
        <!-- Warm hexagonal bokeh shapes -->
        <polygon points="140,320 162,308 162,284 140,272 118,284 118,308" fill="#d4a844" fill-opacity="0.025" stroke="#d4a844" stroke-width="2" stroke-opacity="0.06"/>
        <polygon points="90,380 108,369 108,348 90,337 72,348 72,369" fill="#d4a844" fill-opacity="0.02" stroke="#d4a844" stroke-width="1.5" stroke-opacity="0.05"/>
        <polygon points="195,290 220,277 220,250 195,237 170,250 170,277" fill="#d4c844" fill-opacity="0.015" stroke="#d4c844" stroke-width="1.5" stroke-opacity="0.04"/>

        <!-- Cool hexagonal bokeh (right side) -->
        <polygon points="1060,300 1082,288 1082,264 1060,252 1038,264 1038,288" fill="#4488cc" fill-opacity="0.02" stroke="#4488cc" stroke-width="2" stroke-opacity="0.05"/>
        <polygon points="1110,360 1130,349 1130,328 1110,317 1090,328 1090,349" fill="#4488cc" fill-opacity="0.015" stroke="#4488cc" stroke-width="1.5" stroke-opacity="0.04"/>

        <!-- Circular bokeh (scattered) -->
        <circle cx="55" cy="300" r="28" fill="none" stroke="#d4a844" stroke-width="1.5" stroke-opacity="0.04"/>
        <circle cx="55" cy="300" r="12" fill="#d4a844" fill-opacity="0.015"/>
        <circle cx="1150" cy="280" r="22" fill="none" stroke="#4488cc" stroke-width="1.5" stroke-opacity="0.04"/>
        <circle cx="320" cy="350" r="18" fill="none" stroke="#d4a844" stroke-width="1.2" stroke-opacity="0.03"/>
        <circle cx="880" cy="340" r="24" fill="none" stroke="#d4a844" stroke-width="1.2" stroke-opacity="0.03"/>
      `,
      svgLight: `
        <polygon points="140,320 162,308 162,284 140,272 118,284 118,308" fill="#a08030" fill-opacity="0.03" stroke="#a08030" stroke-width="2" stroke-opacity="0.07"/>
        <polygon points="90,380 108,369 108,348 90,337 72,348 72,369" fill="#a08030" fill-opacity="0.025" stroke="#a08030" stroke-width="1.5" stroke-opacity="0.06"/>
        <polygon points="1060,300 1082,288 1082,264 1060,252 1038,264 1038,288" fill="#3366aa" fill-opacity="0.025" stroke="#3366aa" stroke-width="2" stroke-opacity="0.06"/>
        <circle cx="55" cy="300" r="28" fill="none" stroke="#a08030" stroke-width="1.5" stroke-opacity="0.05"/>
        <circle cx="1150" cy="280" r="22" fill="none" stroke="#3366aa" stroke-width="1.5" stroke-opacity="0.05"/>
        <circle cx="320" cy="350" r="18" fill="none" stroke="#a08030" stroke-width="1.2" stroke-opacity="0.04"/>
      `,
    },
  ],
};
