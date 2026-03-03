import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';

// ─── Constants ────────────────────────────────────────────────────────────────
const FOCAL_LENGTHS = [24, 28, 35, 50, 70, 85, 100, 135, 200, 300];
const FL_MIN = 24, FL_MAX = 300;
const flToPos = (mm: number) =>
  ((Math.sqrt(mm) - Math.sqrt(FL_MIN)) / (Math.sqrt(FL_MAX) - Math.sqrt(FL_MIN))) *
  (FOCAL_LENGTHS.length - 1);
const posToFl = (p: number) => {
  const t = p / (FOCAL_LENGTHS.length - 1);
  const sq = Math.sqrt(FL_MIN) + t * (Math.sqrt(FL_MAX) - Math.sqrt(FL_MIN));
  return Math.max(FL_MIN, Math.min(FL_MAX, Math.round(sq * sq)));
};

const APERTURES = [1, 1.2, 1.4, 1.8, 2, 2.5, 2.8, 3.5, 4, 4.5, 5.6, 6.3, 8, 11, 16, 22, 32, 45, 64];
const DIST_MARKS = [0.3, 0.5, 0.7, 1, 1.5, 2, 3, 5, 7, 10, 15, 20, 50, 9999];

const COC = 0.03;
const SP = 82;       // ring item spacing px
const DOF_H = 150;
const FONT = "'DM Mono','IBM Plex Mono','Courier New',monospace";
const RED = '#FF3C28';
const VW = 1200, VH = 600; // scene coordinate space

// ─── Per-aperture spectrum colors ─────────────────────────────────────────────
const AP_COLORS = [
  '#FFFFFF', '#F0E0FF', '#E8C0FF', '#FF7090', '#FF3C28',
  '#FF6B35', '#FF9F1C', '#FFCC00', '#E0E040', '#A0D840',
  '#50CC66', '#30DDAA', '#20CCCC', '#30AADD', '#4088EE',
  '#5566FF', '#7744EE', '#9933CC', '#AA2299',
];
function apColor(N: number): string {
  const i = APERTURES.indexOf(N);
  return i >= 0 ? AP_COLORS[i] : '#888';
}

// ─── Optics ───────────────────────────────────────────────────────────────────
const hyperfocal = (f: number, N: number) => (f * f) / (N * COC) + f;
const nearL = (S: number, H: number, f: number) => {
  const d = H + S - 2 * f; return d <= 0 ? 1 : (S * (H - f)) / d;
};
const farL = (S: number, H: number, f: number) => {
  if (S >= H) return Infinity; const d = H - S;
  return d <= 0 ? Infinity : (S * (H - f)) / d;
};
const cocAt = (d: number, s: number, f: number, N: number) => {
  if (d >= 1e6 || s >= 1e6) return 0;
  const fm = f / 1000;
  if (d <= fm || s <= fm) return 20;
  return Math.abs((fm * fm * (s - d)) / (N * d * (s - fm))) * 1000;
};
const coc2blur = (c: number, mx = 20) => {
  const r = c / COC; return r <= 1 ? 0 : Math.min(mx, (r - 1) * 1.2);
};

// ─── Focus helpers ────────────────────────────────────────────────────────────
const distToFrac = (d: number): number => {
  if (d >= 9999) return DIST_MARKS.length - 1;
  for (let i = 0; i < DIST_MARKS.length - 1; i++) {
    const a = DIST_MARKS[i], b = DIST_MARKS[i + 1];
    if (d <= b || b >= 9999) {
      if (d <= a) return i;
      if (b >= 9999) return i + Math.min(0.99, Math.log(d / a) / Math.log(200));
      return i + (Math.log(d) - Math.log(a)) / (Math.log(b) - Math.log(a));
    }
  }
  return DIST_MARKS.length - 1;
};
const fracToDist = (p: number): number => {
  const i = Math.floor(p), f = p - i;
  if (i >= DIST_MARKS.length - 1) return 9999;
  const a = DIST_MARKS[i], b = DIST_MARKS[i + 1];
  if (b >= 9999) return a * Math.exp(f * Math.log(200));
  return a * Math.pow(b / a, f);
};
const fmtDist = (d: number) =>
  d >= 9999 ? '∞' : d >= 100 ? d.toFixed(0) : d >= 10 ? d.toFixed(1) : d.toFixed(2);
const fmtFt = (d: number) => d >= 9999 ? '∞' : fmtDist(d * 3.28084);

function distToX(valM: number, activePos: number, cx: number): number {
  return cx + (distToFrac(valM >= 9999 ? 9999 : valM) - activePos) * SP;
}

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useW(ref: React.RefObject<HTMLDivElement | null>): number {
  const [w, setW] = useState(640);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([e]) => setW(Math.floor(e.contentRect.width)));
    ro.observe(ref.current);
    setW(Math.floor(ref.current.getBoundingClientRect().width));
    return () => ro.disconnect();
  }, [ref]);
  return w;
}

function useBoot(): number {
  const [p, setP] = useState(0);
  useEffect(() => {
    const timers = [100, 340, 500, 640, 800, 1050, 1300, 1550, 1800].map((ms, i) =>
      setTimeout(() => setP(i + 1), ms)
    );
    return () => timers.forEach(clearTimeout);
  }, []);
  return p;
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface SceneLayer { distance: number; svg: string; svgLight?: string; }
interface Scene { id: string; name: string; layers: SceneLayer[]; }
interface ModeState { dark: boolean; hiCon: boolean; color: boolean; }

// ─── Empty Scene ──────────────────────────────────────────────────────────────
const EMPTY_SCENE: Scene = {
  id: 'empty', name: 'Empty',
  layers: [{
    distance: Infinity,
    svg: `<rect x="0" y="0" width="1200" height="600" fill="#080808"/><line x1="0" y1="252" x2="1200" y2="252" stroke="rgba(255,255,255,0.03)" stroke-width="0.5"/><line x1="600" y1="0" x2="600" y2="600" stroke="rgba(255,255,255,0.03)" stroke-width="0.5"/>`,
    svgLight: `<rect x="0" y="0" width="1200" height="600" fill="#e8e5e0"/><line x1="0" y1="252" x2="1200" y2="252" stroke="rgba(0,0,0,0.05)" stroke-width="0.5"/><line x1="600" y1="0" x2="600" y2="600" stroke="rgba(0,0,0,0.05)" stroke-width="0.5"/>`,
  }],
};

// ─── Separator ────────────────────────────────────────────────────────────────
const Sep = () => <div style={{ height: 1, background: 'rgba(255,255,255,0.08)' }} />;

// ─── Knurl Strip ──────────────────────────────────────────────────────────────
function KnurlStrip({ height, width }: { height: number; width: number }) {
  const HS = 12, VS = 8;
  const rows = Math.ceil(height / VS) + 1, cols = Math.ceil(width / HS) + 2;
  const p: string[] = [];
  for (let r = 0; r < rows; r++) {
    const ox = (r % 2) * (HS / 2);
    for (let c = 0; c < cols; c++) {
      const cx = c * HS + ox - HS, cy = r * VS;
      p.push(`M${cx},${cy - 3}L${cx + 3},${cy}L${cx},${cy + 3}L${cx - 3},${cy}Z`);
    }
  }
  return (
    <div style={{ overflow: 'hidden', height }}>
      <svg width={width} height={height} style={{ display: 'block' }}>
        <path d={p.join('')} fill="none" stroke="rgba(255,255,255,0.13)" strokeWidth={0.5} />
      </svg>
    </div>
  );
}

// ─── Vertical Toggle ──────────────────────────────────────────────────────────
function VerticalToggle({ value, top, bottom, onChange }: {
  value: string;
  top: { key: string; label: string };
  bottom: { key: string; label: string };
  onChange: (key: string) => void;
}) {
  const isTop = value === top.key;
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', width: 40, borderRadius: 3, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', background: '#060606', cursor: 'pointer', userSelect: 'none' }}>
      <div onClick={() => onChange(top.key)} style={{ height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontSize: 7, letterSpacing: '0.08em', textTransform: 'uppercase', color: isTop ? RED : 'rgba(255,255,255,0.14)', background: isTop ? 'rgba(255,255,255,0.04)' : 'transparent', borderBottom: `1px solid ${isTop ? RED + '33' : 'rgba(255,255,255,0.04)'}`, textShadow: isTop ? `0 0 6px ${RED}44` : 'none', transition: 'all 0.15s ease-out' }}>{top.label}</div>
      <div onClick={() => onChange(bottom.key)} style={{ height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontSize: 7, letterSpacing: '0.08em', textTransform: 'uppercase', color: !isTop ? RED : 'rgba(255,255,255,0.14)', background: !isTop ? 'rgba(255,255,255,0.04)' : 'transparent', borderTop: `1px solid ${!isTop ? RED + '33' : 'rgba(255,255,255,0.04)'}`, textShadow: !isTop ? `0 0 6px ${RED}44` : 'none', transition: 'all 0.15s ease-out' }}>{bottom.label}</div>
    </div>
  );
}

// ─── Continuous Ring ──────────────────────────────────────────────────────────
function ContinuousRing({ pos, marks, markLabels, onChange, posToVal, valToPos, height = 58, tag, fontSize = 13, wheelStep = 0.08, dragSens = 0.30, showOnlyActive = false }: {
  pos: number; marks: number[]; markLabels: string[];
  onChange: (val: number) => void; posToVal: (p: number) => number;
  valToPos?: (v: number) => number; height?: number; tag?: string;
  fontSize?: number; wheelStep?: number; dragSens?: number; showOnlyActive?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef({ a: false, x: 0, p: 0 });
  const r = useRef({ pos, fn: onChange }); r.current = { pos, fn: onChange };
  const mx = marks.length - 1;

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const h = (e: WheelEvent) => {
      e.preventDefault();
      const np = Math.max(0, Math.min(mx, r.current.pos + (e.deltaY > 0 ? wheelStep : -wheelStep)));
      r.current.fn(posToVal(np));
    };
    el.addEventListener('wheel', h, { passive: false });
    return () => el.removeEventListener('wheel', h);
  }, [mx, posToVal, wheelStep]);

  const dn = useCallback((e: React.PointerEvent) => {
    drag.current = { a: true, x: e.clientX, p: pos };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); e.preventDefault();
  }, [pos]);
  const mv = useCallback((e: React.PointerEvent) => {
    if (!drag.current.a) return;
    const np = Math.max(0, Math.min(mx, drag.current.p + (-(e.clientX - drag.current.x) * dragSens) / SP));
    onChange(posToVal(np));
  }, [onChange, mx, posToVal, dragSens]);
  const up = useCallback(() => { drag.current.a = false; }, []);

  const nearestIdx = useMemo(() => {
    let best = 0, bestD = Infinity;
    marks.forEach((m, i) => { const d = Math.abs((valToPos ? valToPos(m) : i) - pos); if (d < bestD) { bestD = d; best = i; } });
    return best;
  }, [marks, pos, valToPos]);

  return (
    <div ref={ref} style={{ position: 'relative', height, overflow: 'hidden', cursor: 'ew-resize', touchAction: 'none', userSelect: 'none' }} onPointerDown={dn} onPointerMove={mv} onPointerUp={up} onPointerCancel={up}>
      {!showOnlyActive && marks.map((m, i) => {
        const mp = valToPos ? valToPos(m) : i;
        const off = mp - pos; if (Math.abs(off) > 3.5) return null;
        const ab = Math.abs(off), isNearest = i === nearestIdx;
        const op = isNearest ? 1 : ab < 0.8 ? 0.4 - ab * 0.25 : ab < 1.8 ? 0.15 : ab < 2.8 ? 0.07 : 0.03;
        const sc = isNearest ? 1.3 : ab < 0.8 ? 1.0 - ab * 0.25 : ab < 1.8 ? 0.72 : 0.62;
        return <div key={i} style={{ position: 'absolute', top: '50%', left: '50%', transform: `translate(calc(-50% + ${off * SP}px), -50%) scale(${sc})`, transition: 'transform 0.06s linear, opacity 0.06s linear', opacity: op, color: isNearest ? RED : 'rgba(255,255,255,0.85)', textShadow: isNearest ? `0 0 10px ${RED}90, 0 0 22px ${RED}50` : 'none', fontFamily: FONT, fontSize, fontWeight: isNearest ? 500 : 300, letterSpacing: '0.05em', whiteSpace: 'nowrap', pointerEvents: 'none' }}>{markLabels[i]}</div>;
      })}
      {showOnlyActive && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) scale(1.3)', fontFamily: FONT, fontSize, fontWeight: 500, color: RED, textShadow: `0 0 10px ${RED}90, 0 0 22px ${RED}50`, letterSpacing: '0.05em', whiteSpace: 'nowrap', pointerEvents: 'none' }}>{markLabels[nearestIdx]}</div>}
      <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'rgba(255,255,255,0.09)', transform: 'translateX(-50%)', pointerEvents: 'none' }} />
      {!showOnlyActive && <><div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '32%', background: 'linear-gradient(to right, #000 50%, transparent)', pointerEvents: 'none' }} /><div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '32%', background: 'linear-gradient(to left, #000 50%, transparent)', pointerEvents: 'none' }} /></>}
      {tag && <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.22)', fontFamily: FONT, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', pointerEvents: 'none' }}>{tag}</div>}
    </div>
  );
}

function FocalRing({ focalMm, onChange, height = 58, showOnlyActive = false }: { focalMm: number; onChange: (mm: number) => void; height?: number; showOnlyActive?: boolean; }) {
  return <ContinuousRing pos={flToPos(focalMm)} marks={FOCAL_LENGTHS} markLabels={FOCAL_LENGTHS.map(String)} onChange={onChange} posToVal={posToFl} valToPos={flToPos} height={height} tag="mm" fontSize={14} wheelStep={0.10} dragSens={0.35} showOnlyActive={showOnlyActive} />;
}

function FocusRing({ focusDist, onChange, height = 58, unit, showOnlyActive = false, focalMm }: { focusDist: number; onChange: (d: number) => void; height?: number; unit: 'm' | 'ft'; showOnlyActive?: boolean; focalMm?: number; }) {
  const p2v = useCallback((p: number) => fracToDist(p), []);
  const flFactor = focalMm ? Math.sqrt(50 / Math.max(24, focalMm)) : 1;
  return <ContinuousRing pos={distToFrac(focusDist)} marks={DIST_MARKS} markLabels={DIST_MARKS.map(d => unit === 'ft' ? fmtFt(d) : fmtDist(d))} onChange={onChange} posToVal={p2v} height={height} tag={unit} fontSize={13} wheelStep={0.02 * flFactor} dragSens={0.083 * flFactor} showOnlyActive={showOnlyActive} />;
}

// ─── Aperture Ring (discrete) ─────────────────────────────────────────────────
function Ring({ values, activeIdx, onChange, height = 58, fmt, tag, tagSide = 'right', fontSize = 13, showOnlyActive = false }: {
  values: number[]; activeIdx: number; onChange: (i: number) => void; height?: number;
  fmt?: (v: number, i: number) => string; tag?: string; tagSide?: 'left' | 'right';
  fontSize?: number; showOnlyActive?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef({ a: false, x: 0, i: 0 });
  const r = useRef({ i: activeIdx, fn: onChange, n: values.length }); r.current = { i: activeIdx, fn: onChange, n: values.length };

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const h = (e: WheelEvent) => { e.preventDefault(); r.current.fn(Math.max(0, Math.min(r.current.n - 1, r.current.i + (e.deltaY > 0 ? 1 : -1)))); };
    el.addEventListener('wheel', h, { passive: false }); return () => el.removeEventListener('wheel', h);
  }, []);

  const dn = useCallback((e: React.PointerEvent) => { drag.current = { a: true, x: e.clientX, i: activeIdx }; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); e.preventDefault(); }, [activeIdx]);
  const mv = useCallback((e: React.PointerEvent) => { if (!drag.current.a) return; onChange(Math.max(0, Math.min(values.length - 1, drag.current.i + Math.round((-(e.clientX - drag.current.x) * 0.55) / SP)))); }, [values.length, onChange]);
  const up = useCallback(() => { drag.current.a = false; }, []);

  return (
    <div ref={ref} style={{ position: 'relative', height, overflow: 'hidden', cursor: 'ew-resize', touchAction: 'none', userSelect: 'none' }} onPointerDown={dn} onPointerMove={mv} onPointerUp={up} onPointerCancel={up}>
      {!showOnlyActive && values.map((v, i) => {
        const off = i - activeIdx; if (Math.abs(off) > 3) return null;
        const ab = Math.abs(off), isA = off === 0;
        return <div key={i} style={{ position: 'absolute', top: '50%', left: '50%', transform: `translate(calc(-50% + ${off * SP}px), -50%) scale(${ab === 0 ? 1.3 : ab === 1 ? 0.88 : 0.7})`, transition: 'transform 0.14s ease-out, opacity 0.14s ease-out', opacity: ab === 0 ? 1 : ab === 1 ? 0.35 : ab === 2 ? 0.12 : 0.04, color: isA ? RED : 'rgba(255,255,255,0.85)', textShadow: isA ? `0 0 10px ${RED}90, 0 0 22px ${RED}50` : 'none', fontFamily: FONT, fontSize, fontWeight: isA ? 500 : 300, letterSpacing: '0.05em', whiteSpace: 'nowrap', pointerEvents: 'none' }}>{fmt ? fmt(v, i) : String(v)}</div>;
      })}
      {showOnlyActive && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) scale(1.3)', fontFamily: FONT, fontSize, fontWeight: 500, color: RED, textShadow: `0 0 10px ${RED}90, 0 0 22px ${RED}50`, letterSpacing: '0.05em', whiteSpace: 'nowrap', pointerEvents: 'none' }}>{fmt ? fmt(values[activeIdx], activeIdx) : String(values[activeIdx])}</div>}
      <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'rgba(255,255,255,0.09)', transform: 'translateX(-50%)', pointerEvents: 'none' }} />
      {!showOnlyActive && <><div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '32%', background: 'linear-gradient(to right, #000 50%, transparent)', pointerEvents: 'none' }} /><div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '32%', background: 'linear-gradient(to left, #000 50%, transparent)', pointerEvents: 'none' }} /></>}
      {tag && !showOnlyActive && <div style={{ position: 'absolute', [tagSide]: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.22)', fontFamily: FONT, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', pointerEvents: 'none' }}>{tag}</div>}
    </div>
  );
}

// ─── Scene Ring ───────────────────────────────────────────────────────────────
function SceneRing({ scenes, activeIdx, onChange, height = 38 }: { scenes: Scene[]; activeIdx: number; onChange: (i: number) => void; height?: number; }) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef({ a: false, x: 0, i: 0 });
  const r = useRef({ i: activeIdx, fn: onChange, n: scenes.length }); r.current = { i: activeIdx, fn: onChange, n: scenes.length };
  const spacing = useMemo(() => Math.max(SP, Math.min(160, Math.max(...scenes.map(s => s.name.length)) * 10 + 36)), [scenes]);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const h = (e: WheelEvent) => { e.preventDefault(); r.current.fn(Math.max(0, Math.min(r.current.n - 1, r.current.i + (e.deltaY > 0 ? 1 : -1)))); };
    el.addEventListener('wheel', h, { passive: false }); return () => el.removeEventListener('wheel', h);
  }, []);

  const dn = useCallback((e: React.PointerEvent) => { drag.current = { a: true, x: e.clientX, i: activeIdx }; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); e.preventDefault(); }, [activeIdx]);
  const mv = useCallback((e: React.PointerEvent) => { if (!drag.current.a) return; onChange(Math.max(0, Math.min(scenes.length - 1, drag.current.i + Math.round((-(e.clientX - drag.current.x) * 0.35) / spacing)))); }, [scenes.length, onChange, spacing]);
  const up = useCallback(() => { drag.current.a = false; }, []);

  return (
    <div ref={ref} style={{ position: 'relative', height, overflow: 'hidden', cursor: 'ew-resize', touchAction: 'none', userSelect: 'none' }} onPointerDown={dn} onPointerMove={mv} onPointerUp={up} onPointerCancel={up}>
      {scenes.map((s, i) => { const off = i - activeIdx; if (Math.abs(off) > 3) return null; const ab = Math.abs(off), isA = off === 0; return <div key={s.id + i} style={{ position: 'absolute', top: '50%', left: '50%', transform: `translate(calc(-50% + ${off * spacing}px), -50%) scale(${ab === 0 ? 1.15 : ab === 1 ? 0.85 : 0.65})`, transition: 'transform 0.14s ease-out, opacity 0.14s ease-out', opacity: ab === 0 ? 1 : ab === 1 ? 0.3 : 0.08, color: isA ? RED : 'rgba(255,255,255,0.7)', textShadow: isA ? `0 0 8px ${RED}66` : 'none', fontFamily: FONT, fontSize: 10, fontWeight: isA ? 500 : 300, letterSpacing: '0.14em', textTransform: 'uppercase', whiteSpace: 'nowrap', pointerEvents: 'none' }}>{s.name}</div>; })}
      <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'rgba(255,255,255,0.06)', transform: 'translateX(-50%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '32%', background: 'linear-gradient(to right, #000 50%, transparent)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '32%', background: 'linear-gradient(to left, #000 50%, transparent)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.15)', fontFamily: FONT, fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', pointerEvents: 'none' }}>scene</div>
    </div>
  );
}

// ─── Scene Loader ─────────────────────────────────────────────────────────────
function SceneLoader({ onLoadScenes }: { onLoadScenes: (s: Scene[]) => void }) {
  const [show, setShow] = useState(false);
  const [val, setVal] = useState('');
  const [err, setErr] = useState('');

  const validate = (s: Scene): string | null => {
    if (!s?.id || !s?.name || !Array.isArray(s?.layers)) return 'needs id, name, layers';
    for (const l of s.layers) {
      if (l.distance === undefined || typeof l.svg !== 'string') return 'layer needs distance+svg';
      if ((l.distance as unknown as string) === 'Infinity' || l.distance === null) l.distance = Infinity;
    }
    s.layers.sort((a, b) => (b.distance === Infinity ? 1e9 : b.distance) - (a.distance === Infinity ? 1e9 : a.distance));
    return null;
  };

  const load = () => {
    setErr('');
    try {
      let raw = val.trim().replace(/^```[\w]*\s*/i, '').replace(/\s*```$/i, '').replace(/^(?:const|let|var)\s+\w+\s*=\s*/, '').replace(/;\s*$/, '');
      let p: Scene | Scene[];
      try { p = JSON.parse(raw); } catch { try { p = new Function(`"use strict"; return (${raw});`)() as Scene | Scene[]; } catch (e) { setErr((e as Error).message); return; } }
      const list = Array.isArray(p) ? p : [p];
      for (const s of list) { const e = validate(s); if (e) { setErr(`${(s as any)?.name || '?'}: ${e}`); return; } }
      onLoadScenes(list); setVal(''); setShow(false);
    } catch (e) { setErr((e as Error).message); }
  };

  if (!show) return <div onClick={() => setShow(true)} style={{ padding: '4px 0', textAlign: 'center', cursor: 'pointer', fontFamily: FONT, fontSize: 7, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.08)' }}>+ LOAD SCENE</div>;
  return (
    <div style={{ padding: '6px 0' }}>
      <textarea value={val} onChange={e => setVal(e.target.value)} placeholder="Paste scene or [scenes]..." style={{ background: '#060606', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 2, color: 'rgba(255,255,255,0.5)', fontFamily: FONT, fontSize: 9, padding: 8, width: '100%', resize: 'vertical', minHeight: 60, outline: 'none' }} rows={4} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
        <div onClick={load} style={{ fontFamily: FONT, fontSize: 7, letterSpacing: '0.15em', textTransform: 'uppercase', color: RED, cursor: 'pointer', padding: '4px 10px', border: `1px solid ${RED}33`, borderRadius: 2 }}>LOAD</div>
        <div onClick={() => { setShow(false); setErr(''); }} style={{ fontFamily: FONT, fontSize: 7, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)', cursor: 'pointer', padding: '4px 10px' }}>CANCEL</div>
        {err && <span style={{ color: '#ff6644', fontFamily: FONT, fontSize: 7, flex: 1 }}>{err}</span>}
      </div>
    </div>
  );
}

// ─── Mode Switches ────────────────────────────────────────────────────────────
function ModeSwitches({ mode, setMode }: { mode: ModeState; setMode: React.Dispatch<React.SetStateAction<ModeState>> }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '6px 0' }}>
      <VerticalToggle value={mode.dark ? 'dark' : 'light'} top={{ key: 'dark', label: '☾' }} bottom={{ key: 'light', label: '☀' }} onChange={v => setMode(m => ({ ...m, dark: v === 'dark' }))} />
      <VerticalToggle value={mode.color ? 'clr' : 'bw'} top={{ key: 'bw', label: 'B&W' }} bottom={{ key: 'clr', label: 'CLR' }} onChange={v => setMode(m => ({ ...m, color: v === 'clr' }))} />
      <VerticalToggle value={mode.hiCon ? 'hi' : 'std'} top={{ key: 'std', label: 'STD' }} bottom={{ key: 'hi', label: 'HI' }} onChange={v => setMode(m => ({ ...m, hiCon: v === 'hi' }))} />
    </div>
  );
}

// ─── Viewfinder ───────────────────────────────────────────────────────────────
function Viewfinder({ fMm, N, focusDist, width, scene, mode, open, onToggle }: {
  fMm: number; N: number; focusDist: number; width: number;
  scene: Scene; mode: ModeState; open: boolean; onToggle: () => void;
}) {
  const W = width, dH = Math.min(340, Math.round(W * 0.58));
  const fovW = Math.max(140, Math.min(1000, (50 / fMm) * 550));
  const fovH = fovW * (dH / W);
  const vbX = (VW - fovW) / 2, vbY = (VH - fovH) / 2 - 10;
  const focM = Math.min(focusDist, 1e5);
  const { dark, hiCon, color } = mode;
  const maxBlur = fMm > 135 ? 10 : fMm > 85 ? 14 : 22;
  const blurs = scene.layers.map(l =>
    coc2blur(cocAt(l.distance >= 9999 || l.distance === Infinity ? 1e5 : l.distance, focM, fMm, N), maxBlur)
  );
  const subI = scene.layers.findIndex(l => l.distance > 1.5 && l.distance < 8);
  const subBlur = subI >= 0 ? blurs[subI] : 5;
  let sf = ''; if (hiCon) sf += ' contrast(1.5) brightness(1.08)'; if (!color) sf += ' saturate(0)'; sf = sf.trim();

  return (
    <div style={{ position: 'relative', margin: '0 auto', width: W, overflow: 'hidden', borderRadius: 4, cursor: 'pointer', height: open ? dH : 22, perspective: '600px', transition: 'height 0.5s cubic-bezier(0.4,0,0.15,1)' }} onClick={onToggle}>
      <div style={{ width: '100%', height: dH, transformOrigin: 'top center', transform: open ? 'rotateX(0)' : 'rotateX(-85deg)', opacity: open ? 1 : 0, transition: 'transform 0.5s cubic-bezier(0.4,0,0.15,1), opacity 0.35s ease-out' }}>
        <svg width={W} height={dH} viewBox={`${vbX} ${vbY} ${fovW} ${fovH}`} preserveAspectRatio="xMidYMid slice" style={{ display: 'block', background: dark ? '#030303' : '#f0ede8', transition: 'background 0.3s', borderRadius: 4 }}>
          <defs>
            {blurs.map((b, i) => b > 0.3 ? <filter key={i} id={`vb${i}`} x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation={b} /></filter> : null)}
            <radialGradient id="vig" cx="50%" cy="48%" r="52%"><stop offset="0%" stopColor="transparent" /><stop offset="55%" stopColor="transparent" /><stop offset="100%" stopColor={dark ? 'rgba(0,0,0,0.80)' : 'rgba(0,0,0,0.30)'} /></radialGradient>
          </defs>
          <g style={{ filter: sf || undefined, transition: 'filter 0.3s' }}>
            {scene.layers.map((l, i) => <g key={i} filter={blurs[i] > 0.3 ? `url(#vb${i})` : undefined} style={{ transition: 'filter 0.4s ease-out' }} dangerouslySetInnerHTML={{ __html: (!dark && l.svgLight) ? l.svgLight : l.svg }} />)}
          </g>
          <rect x={vbX} y={vbY} width={fovW} height={fovH} fill="url(#vig)" />
          {(() => {
            const cx = VW / 2, cy = VH * 0.44, bs = fovW * 0.022, gap = fovW * 0.03;
            const bc = subBlur < 0.8 ? `${RED}66` : dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.12)';
            const sw = Math.max(0.4, fovW * 0.001);
            return <g stroke={bc} strokeWidth={sw} fill="none"><path d={`M${cx - gap},${cy - gap + bs} L${cx - gap},${cy - gap} L${cx - gap + bs},${cy - gap}`} /><path d={`M${cx + gap - bs},${cy - gap} L${cx + gap},${cy - gap} L${cx + gap},${cy - gap + bs}`} /><path d={`M${cx - gap},${cy + gap - bs} L${cx - gap},${cy + gap} L${cx - gap + bs},${cy + gap}`} /><path d={`M${cx + gap - bs},${cy + gap} L${cx + gap},${cy + gap} L${cx + gap},${cy + gap - bs}`} /><circle cx={cx} cy={cy} r={fovW * 0.0025} fill={bc} /></g>;
          })()}
          {(() => {
            const fc = dark ? 'rgba(255,255,255,0.13)' : 'rgba(0,0,0,0.18)', fs = fovW * 0.016;
            return <><text x={vbX + fovW * 0.02} y={vbY + fovH * 0.06} fontFamily={FONT} fontSize={fs} fill={fc} letterSpacing="0.1em">{fMm}mm</text><text x={vbX + fovW * 0.02} y={vbY + fovH * 0.12} fontFamily={FONT} fontSize={fs} fill={fc} letterSpacing="0.1em">f/{N}</text><text x={vbX + fovW * 0.98} y={vbY + fovH * 0.06} fontFamily={FONT} fontSize={fs} fill={fc} textAnchor="end" letterSpacing="0.1em">{fmtDist(focusDist)}m</text></>;
          })()}
        </svg>
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontSize: 7, color: 'rgba(255,255,255,0.10)', letterSpacing: '0.22em', textTransform: 'uppercase', opacity: open ? 0 : 1, transition: 'opacity 0.25s', background: '#050505', borderTop: '1px solid rgba(255,255,255,0.04)', pointerEvents: open ? 'none' : 'auto' }}>▽ VIEWFINDER ▽</div>
    </div>
  );
}

// ─── DoF Curve Field ──────────────────────────────────────────────────────────
function DofField({ fMm, focusPos, width, selectedAp }: { fMm: number; focusPos: number; width: number; selectedAp: number; }) {
  const W = width, H = DOF_H, CX = W / 2;
  const focusDist = fracToDist(focusPos);
  const Smm = Math.min(focusDist, 1e5) * 1000;
  const hfMm = hyperfocal(fMm, selectedAp);
  const hfM = hfMm / 1000;
  const hfX = distToX(hfM, focusPos, CX);

  // Time for sine-wave animation (~30 fps)
  const [time, setTime] = useState(0);
  useEffect(() => {
    let raf: number, start = 0, last = 0;
    const tick = (ts: number) => {
      if (!start) start = ts;
      if (ts - last > 33) { setTime((ts - start) / 1000); last = ts; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const aperturesDesc = useMemo(() => [...APERTURES].reverse(), []);
  const curves = useMemo(() => aperturesDesc.map(N => {
    const Hmm = hyperfocal(fMm, N);
    const nM = nearL(Smm, Hmm, fMm) / 1000;
    const fM = farL(Smm, Hmm, fMm);
    const fFarM = fM === Infinity ? 9999 : fM / 1000;
    const nX = Math.max(-30, Math.min(W + 30, distToX(nM, focusPos, CX)));
    const fX = Math.max(-30, Math.min(W + 30, distToX(fFarM, focusPos, CX)));
    const c = apColor(N);
    const cp1 = H * 0.35, cp2 = H * 0.72;
    const np = `M${CX},0 C${CX},${cp1} ${(CX + 0.85 * (nX - CX)).toFixed(1)},${cp2} ${nX.toFixed(1)},${H}`;
    const fp = `M${CX},0 C${CX},${cp1} ${(CX + 0.85 * (fX - CX)).toFixed(1)},${cp2} ${fX.toFixed(1)},${H}`;
    const fill = `${np} L${fX.toFixed(1)},${H} C${(CX + 0.85 * (fX - CX)).toFixed(1)},${cp2} ${CX},${cp1} ${CX},0 Z`;
    return { N, nX, fX, np, fp, fill, c, sel: N === selectedAp };
  }), [aperturesDesc, fMm, Smm, focusPos, W, CX, H, selectedAp]);

  // Sine-wave strands for selected aperture
  const sineStrands = useCallback((endX: number, t: number, sideOffset = 0) => {
    const STRANDS = 3, STEPS = 32;
    return Array.from({ length: STRANDS }, (_, si) => {
      const pts: string[] = [];
      const amp = 2.0 + si * 1.2, freq = 0.035 + si * 0.008;
      const phase = si * 1.2 + sideOffset + t * (1.0 + si * 0.25);
      for (let s = 0; s <= STEPS; s++) {
        const tt = s / STEPS;
        const cp1y = H * 0.35, cp2y = H * 0.72, cp2x = CX + 0.85 * (endX - CX);
        const mt = 1 - tt;
        const bx = mt * mt * mt * CX + 3 * mt * mt * tt * CX + 3 * mt * tt * tt * cp2x + tt * tt * tt * endX;
        const by = 3 * mt * mt * tt * cp1y + 3 * mt * tt * tt * cp2y + tt * tt * tt * H;
        const dx = endX - CX, dy = H, len = Math.sqrt(dx * dx + dy * dy) || 1;
        const nx = -dy / len;
        const wave = Math.sin(by * freq + phase) * amp * Math.sin(tt * Math.PI);
        pts.push(`${(bx + nx * wave).toFixed(1)},${by.toFixed(1)}`);
      }
      const op = si === 0 ? 0.9 : si === 1 ? 0.55 : 0.3;
      const sw = si === 0 ? 2.2 : si === 1 ? 1.4 : 0.8;
      return { d: `M${pts.join(' L')}`, op, sw, si };
    });
  }, [CX, H]);

  return (
    <div style={{ position: 'relative', height: H, overflow: 'hidden' }}>
      <svg width={W} height={H} style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6" /></filter>
          <filter id="hfglow" x="-40%" y="-10%" width="180%" height="120%"><feGaussianBlur stdDeviation="5" /></filter>
          <linearGradient id="hfgrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={RED} stopOpacity="0.10" /><stop offset="40%" stopColor={RED} stopOpacity="0.04" /><stop offset="100%" stopColor={RED} stopOpacity="0" />
          </linearGradient>
        </defs>
        <style>{`.dc{transition:d 0.12s ease-out}.dl{transition:transform 0.12s ease-out,opacity 0.12s}`}</style>

        <line x1={CX} y1={0} x2={CX} y2={H} stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
        {/* Scale tick marks */}
        {DIST_MARKS.map((_, i) => { const x = CX + (i - focusPos) * SP; return (x > -10 && x < W + 10) ? <line key={i} x1={x} y1={H} x2={x} y2={H - 4} stroke="rgba(255,255,255,0.06)" strokeWidth={0.5} /> : null; })}

        {/* Hyperfocal line */}
        {hfX > -50 && hfX < W + 50 && <>
          <line x1={hfX} y1={0} x2={hfX} y2={H} stroke={RED} strokeWidth={3} opacity={0.2} filter="url(#hfglow)" />
          <line x1={hfX} y1={0} x2={hfX} y2={H} stroke={RED} strokeWidth={1} opacity={0.55} />
          <rect x={Math.min(hfX, CX)} y={0} width={Math.abs(hfX - CX)} height={H} fill="url(#hfgrad)" />
          <text x={hfX} y={11} fontFamily={FONT} fontSize={7} fill={RED} opacity={0.6} textAnchor="middle" fontWeight={500} letterSpacing="0.12em">HF</text>
          <text x={hfX} y={H - 4} fontFamily={FONT} fontSize={6.5} fill={RED} opacity={0.4} textAnchor="middle" letterSpacing="0.06em">{fmtDist(hfM)}m</text>
        </>}

        {/* Fill zones */}
        {curves.map(({ N, fill, c, sel }) => <path key={`f-${N}`} className="dc" d={fill} style={{ d: `path("${fill}")` } as any} fill={c} opacity={sel ? 0.05 : 0.01} />)}

        {/* Non-selected: thin solid lines */}
        {curves.filter(x => !x.sel).map(({ N, np, fp, c }) => (
          <g key={N}>
            <path className="dc" d={np} style={{ d: `path("${np}")` } as any} fill="none" stroke={c} strokeWidth={1} opacity={1} />
            <path className="dc" d={fp} style={{ d: `path("${fp}")` } as any} fill="none" stroke={c} strokeWidth={1} opacity={1} />
          </g>
        ))}

        {/* Selected aperture: animated sine-wave strands */}
        {curves.filter(x => x.sel).map(({ N, c, nX, fX }) => {
          const nearStrands = sineStrands(nX, time, 0);
          const farStrands = sineStrands(fX, time, Math.PI * 0.7);
          return (
            <g key={`s-${N}`}>
              <g filter="url(#lineGlow)" opacity={0.3}>
                {nearStrands.slice(0, 1).map(({ d, si }) => <path key={`gn${si}`} d={d} fill="none" stroke={c} strokeWidth={2.5} />)}
                {farStrands.slice(0, 1).map(({ d, si }) => <path key={`gf${si}`} d={d} fill="none" stroke={c} strokeWidth={2.5} />)}
              </g>
              {nearStrands.map(({ d, op, sw, si }) => <path key={`sn${si}`} d={d} fill="none" stroke={c} strokeWidth={sw} opacity={op} strokeLinecap="round" />)}
              {farStrands.map(({ d, op, sw, si }) => <path key={`sf${si}`} d={d} fill="none" stroke={c} strokeWidth={sw} opacity={op} strokeLinecap="round" />)}
              <circle cx={nX} cy={H} r={3} fill={c} opacity={0.7} />
              <circle cx={fX} cy={H} r={3} fill={c} opacity={0.7} />
            </g>
          );
        })}

        {/* Labels (every 3rd aperture to reduce clutter) */}
        {curves.filter((_, i) => i % 3 === 0).map(({ N, nX, fX, c, sel }) => (
          <g key={`l-${N}`} fontFamily={FONT} fontSize={sel ? 8 : 7} fill={c} fontWeight={sel ? 500 : 300}>
            <text className="dl" x={0} y={0} textAnchor="start" style={{ transform: `translate(${(nX + 3).toFixed(1)}px,${H - 3}px)`, opacity: nX < CX - 14 ? (sel ? 0.8 : 0.3) : 0 }}>{`f/${N}`}</text>
            <text className="dl" x={0} y={0} textAnchor="end" style={{ transform: `translate(${(fX - 3).toFixed(1)}px,${H - 3}px)`, opacity: fX > CX + 14 ? (sel ? 0.8 : 0.3) : 0 }}>{`f/${N}`}</text>
          </g>
        ))}

        <circle cx={CX} cy={4} r={3.5} fill={RED} />
        <circle cx={CX} cy={4} r={6} fill="none" stroke={RED} strokeWidth={0.5} opacity={0.3} />
      </svg>
    </div>
  );
}

// ─── Results ──────────────────────────────────────────────────────────────────
function Results({ fMm, N, focusDist, showOnlyRed = false }: { fMm: number; N: number; focusDist: number; showOnlyRed?: boolean; }) {
  const Smm = Math.min(focusDist, 1e5) * 1000;
  const Hmm = hyperfocal(fMm, N), nMm = nearL(Smm, Hmm, fMm), fFarMm = farL(Smm, Hmm, fMm);
  const hfM = Hmm / 1000, nearM = nMm / 1000, farM = fFarMm === Infinity ? Infinity : fFarMm / 1000;
  const fmt = (m: number, u: 'm' | 'ft') => { if (m === Infinity) return '∞'; const v = u === 'ft' ? m * 3.28084 : m; return v >= 100 ? v.toFixed(1) : v >= 10 ? v.toFixed(1) : v.toFixed(2); };
  const totalDof = farM === Infinity ? Infinity : farM - nearM;
  const pct = totalDof === Infinity ? 100 : Math.min(100, (totalDof / Math.max(hfM, 0.1)) * 100);
  const cols = [
    { l: 'HYPERFOCAL', v: fmt(hfM, 'm'), u: 'm', s: fmt(hfM, 'ft') + ' ft', a: 'left' as const },
    { l: 'NEAR', v: fmt(nearM, 'm'), u: 'm', s: fmt(nearM, 'ft') + ' ft', a: 'center' as const },
    { l: 'FAR', v: fmt(farM, 'm'), u: 'm', s: fmt(farM, 'ft') + ' ft', a: 'right' as const },
  ];
  return (
    <div style={{ fontFamily: FONT }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '18px 20px 14px' }}>
        {cols.map(({ l, v, u, s, a }) => (
          <div key={l} style={{ textAlign: a }}>
            <div style={{ color: `rgba(255,255,255,${showOnlyRed ? 0 : 0.18})`, fontSize: 9, letterSpacing: '0.22em', marginBottom: 5, textTransform: 'uppercase', transition: 'color 0.3s' }}>{l}</div>
            <div style={{ color: RED, fontSize: 22, fontWeight: 500, letterSpacing: '0.02em', textShadow: `0 0 18px ${RED}55`, lineHeight: 1 }}>{v}<span style={{ fontSize: 10, marginLeft: 2, opacity: 0.6 }}>{u}</span></div>
            <div style={{ color: `${RED}55`, fontSize: 10, marginTop: 4, letterSpacing: '0.05em', opacity: showOnlyRed ? 0 : 1, transition: 'opacity 0.3s' }}>{s}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: '0 20px 18px', opacity: showOnlyRed ? 0 : 1, transition: 'opacity 0.3s' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ color: 'rgba(255,255,255,0.17)', fontSize: 9, letterSpacing: '0.18em' }}>TOTAL DOF</span>
          <span style={{ color: `${RED}88`, fontSize: 9, letterSpacing: '0.1em' }}>{totalDof === Infinity ? '∞' : totalDof >= 10 ? totalDof.toFixed(1) + ' m' : totalDof.toFixed(2) + ' m'}</span>
        </div>
        <div style={{ height: 2, background: 'rgba(255,255,255,0.07)', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, right: `${100 - pct}%`, background: RED, boxShadow: `0 0 8px ${RED}66`, transition: 'right 0.14s ease-out' }} />
        </div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const cRef = useRef<HTMLDivElement>(null);
  const W = useW(cRef);
  const cW = Math.min(W, 640);
  const phase = useBoot();

  const [focalMm, setFocalMm] = useState(35);
  const [apIdx, setApIdx] = useState(8); // f/4
  const [focusDist, setFocusDist] = useState(3);
  const [scenes, setScenes] = useState<Scene[]>([EMPTY_SCENE]);
  const [sceneIdx, setSceneIdx] = useState(0);
  const [mode, setMode] = useState<ModeState>({ dark: true, hiCon: false, color: false });
  const [vfOpen, setVfOpen] = useState(true);

  const ap = APERTURES[apIdx];
  const focusPos = distToFrac(focusDist);
  const chromePhase = phase >= 6;

  const handleLoadScenes = useCallback((list: Scene[]) => {
    setScenes(prev => {
      const next = [...prev];
      for (const ns of list) {
        const existIdx = next.findIndex(s => s.id === ns.id);
        if (existIdx >= 0) { next[existIdx] = ns; continue; }
        const baseName = ns.name;
        const count = next.filter(s => s.name === baseName || s.name.match(new RegExp(`^${baseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}_\\d+$`))).length;
        if (count > 0) ns.name = `${baseName}_${count}`;
        next.push(ns);
      }
      setSceneIdx(next.findIndex(s => s.id === list[0].id) || 0);
      return next;
    });
  }, []);

  const activeScene = scenes[sceneIdx] || EMPTY_SCENE;

  // Boot phase fade-in helper
  const b = (minP: number, delay = 0): React.CSSProperties => ({
    opacity: phase >= minP ? 1 : 0,
    transform: phase >= minP ? 'translateY(0)' : 'translateY(5px)',
    transition: `opacity 0.3s cubic-bezier(0.2,0,0.2,1) ${delay}s, transform 0.35s cubic-bezier(0.2,0,0.2,1) ${delay}s`,
  });

  return (
    <div ref={cRef} style={{ background: '#000', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 0', fontFamily: FONT }}>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } body { background: #000; }`}</style>
      <div style={{ width: '100%', maxWidth: 640 }}>

        {/* Title */}
        <div style={{ ...b(1), textAlign: 'center', padding: '0 0 16px', color: 'rgba(255,255,255,0.055)', letterSpacing: '0.42em', fontSize: 11, fontWeight: 300, textTransform: 'uppercase', lineHeight: 2 }}>
          HYPERFOCAL DISTANCE<br /><span style={{ letterSpacing: '0.55em' }}>CALCULATOR</span>
        </div>

        {/* Viewfinder */}
        <div style={b(7)}>
          <SceneRing scenes={scenes} activeIdx={sceneIdx} onChange={setSceneIdx} height={38} /><Sep />
          <ModeSwitches mode={mode} setMode={setMode} /><Sep />
          <Viewfinder fMm={focalMm} N={ap} focusDist={focusDist} width={cW} scene={activeScene} mode={mode} open={vfOpen} onToggle={() => setVfOpen(p => !p)} />
          <div style={{ height: 6 }} /><Sep />
        </div>

        {/* Focal length ring */}
        <div style={b(2)}>
          <Sep />
          <FocalRing focalMm={focalMm} onChange={setFocalMm} height={58} showOnlyActive={!chromePhase} />
          <Sep />
        </div>

        {/* Aperture ring */}
        <div style={b(3)}>
          <div style={{ ...b(6), overflow: 'hidden' }}><KnurlStrip height={28} width={cW} /></div><Sep />
          <Ring values={APERTURES} activeIdx={apIdx} onChange={setApIdx} height={58} fmt={v => `f / ${v}`} tag="aperture" tagSide="left" fontSize={13} showOnlyActive={!chromePhase} />
          <Sep />
          <div style={{ ...b(6), overflow: 'hidden' }}><KnurlStrip height={22} width={cW} /></div><Sep />
        </div>

        {/* DoF curves */}
        <div style={b(8)}>
          <DofField fMm={focalMm} focusPos={focusPos} width={cW} selectedAp={ap} /><Sep />
        </div>

        {/* Focus distance rings */}
        <div style={b(4)}>
          <FocusRing focusDist={focusDist} onChange={setFocusDist} height={58} unit="m" showOnlyActive={!chromePhase} focalMm={focalMm} /><Sep />
          <FocusRing focusDist={focusDist} onChange={setFocusDist} height={58} unit="ft" showOnlyActive={!chromePhase} focalMm={focalMm} /><Sep />
        </div>

        {/* Results */}
        <div style={b(5)}>
          <div style={{ ...b(6), overflow: 'hidden' }}><KnurlStrip height={36} width={cW} /></div><Sep />
          <Results fMm={focalMm} N={ap} focusDist={focusDist} showOnlyRed={!chromePhase} /><Sep />
        </div>

        {/* Footer */}
        <div style={b(9)}>
          <SceneLoader onLoadScenes={handleLoadScenes} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '8px 0 4px', color: 'rgba(255,255,255,0.08)', fontFamily: FONT, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            <span style={{ fontSize: 10, opacity: 0.7 }}>←</span>DRAG · SCROLL · SWIPE<span style={{ fontSize: 10, opacity: 0.7 }}>→</span>
          </div>
          <div style={{ textAlign: 'center', padding: '8px 0 0', color: 'rgba(255,255,255,0.03)', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
            Full Frame · CoC 0.03 mm · f/{ap} · {focalMm}mm
          </div>
        </div>

      </div>
    </div>
  );
}
