import React, { memo, useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import type { SceneData } from '../scenes/types';
import { SCENES } from '../scenes';

// ─── Constants ────────────────────────────────────────────────────────────────
const FONT = "'DM Mono','IBM Plex Mono','Courier New',monospace";

// Virtual canvas dimensions (as per Guidelines.md)
const VW = 1200;
const VH = 600;

// ─── FOV crop from focal length ───────────────────────────────────────────────
// Based on guideline table: 24mm→~full, 50mm→~550w, 135mm→~204w, 300mm→~92w
function getFovCrop(fMm: number): { cropX: number; cropW: number } {
  const cropW = Math.min(VW, Math.max(60, (VW * 24) / fMm));
  const cropX = (VW - cropW) / 2;
  return { cropX, cropW };
}

// ─── CoC-based Gaussian blur sigma (SVG units) ────────────────────────────────
// Uses full optical formula: CoC = f² × |d−S| / (N × d × S × 1000)
// Converts mm → SVG units (1200 units / 36mm sensor = 33.33 SVG units/mm)
// Applies a 4× visual boost so DoF is clearly perceptible
function computeBlurSigma(
  layerDist: number,
  focusDist: number,
  fMm: number,
  N: number,
): number {
  const d = layerDist === Infinity ? 1e6 : Math.max(layerDist, 0.01);
  const S = Math.max(focusDist, 0.01);
  // CoC in mm (f in mm, d & S in meters)
  const cocMm = (fMm * fMm * Math.abs(d - S)) / (N * d * S * 1000);
  // Convert to SVG units: sigma = (cocMm / 2) × (VW / 36) × boost
  const sigma = (cocMm / 2) * (VW / 36) * 4;
  return Math.min(sigma, 120);
}

function fmtDist(d: number): string {
  if (d >= 9999) return '∞';
  if (d >= 100) return d.toFixed(0);
  if (d >= 10) return d.toFixed(1);
  return d.toFixed(2);
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface ModeState {
  dark: boolean;
  hiCon: boolean;
  color: boolean;
}

interface Viewfinder3DProps {
  fMm: number;
  N: number;
  coc: number;
  focusDist: number;
  width: number;
  sceneId: string;
  mode: ModeState;
  open: boolean;
  onToggle: () => void;
}

// ─── Main Component ───────────────────────────────────────────────────────────
function Viewfinder3D({
  fMm,
  N,
  focusDist,
  width,
  sceneId,
  mode,
  open,
  onToggle,
}: Viewfinder3DProps) {
  const W = width || 1;
  const dH = Math.min(220, Math.round(W * 0.42)) || 1;
  const { dark, hiCon, color } = mode;

  const rootRef = useRef<HTMLDivElement | null>(null);
  const tiltRef = useRef<HTMLDivElement | null>(null);

  // Look up scene data
  const scene = useMemo<SceneData>(
    () => SCENES.find((s) => s.id === sceneId) ?? SCENES[0],
    [sceneId],
  );

  // Sort layers far → near for proper painter's algorithm rendering
  const sortedLayers = useMemo(
    () =>
      [...scene.layers].sort((a, b) => {
        const da = a.distance === Infinity ? Infinity : a.distance;
        const db = b.distance === Infinity ? Infinity : b.distance;
        if (da === Infinity && db === Infinity) return 0;
        if (da === Infinity) return -1;
        if (db === Infinity) return 1;
        return db - da; // far first
      }),
    [scene],
  );

  // Pre-compute blur sigma for each layer
  const blurs = useMemo(
    () => sortedLayers.map((l) => computeBlurSigma(l.distance, focusDist, fMm, N)),
    [sortedLayers, focusDist, fMm, N],
  );

  // FOV crop viewBox
  const { cropX, cropW } = useMemo(() => getFovCrop(fMm), [fMm]);

  // CSS filters for BW / hi-con modes
  let cssFilter = '';
  if (!color) cssFilter += ' saturate(0)';
  if (hiCon) cssFilter += ' contrast(1.5) brightness(1.08)';
  cssFilter = cssFilter.trim();

  // 3D tilt on pointer move (GSAP)
  const maxTilt = 3.5;
  useEffect(() => {
    const tiltEl = tiltRef.current;
    const rootEl = rootRef.current;
    if (!tiltEl || !rootEl) return;

    const toY = gsap.quickTo(tiltEl, 'rotationY', { duration: 0.22, ease: 'power2.out' });
    const toX = gsap.quickTo(tiltEl, 'rotationX', { duration: 0.22, ease: 'power2.out' });

    const onMove = (e: PointerEvent) => {
      const rect = rootEl.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      toY(nx * maxTilt);
      toX(-ny * (maxTilt * 0.6));
    };
    const onLeave = () => { toY(0); toX(0); };

    rootEl.addEventListener('pointermove', onMove);
    rootEl.addEventListener('pointerleave', onLeave);
    return () => {
      rootEl.removeEventListener('pointermove', onMove);
      rootEl.removeEventListener('pointerleave', onLeave);
      gsap.killTweensOf(tiltEl);
    };
  }, []);

  const cornerSize = 20;
  const frameW = '76%';
  const frameH = '66%';

  return (
    <div
      ref={rootRef}
      style={{
        position: 'relative',
        margin: '0 auto',
        width: W,
        overflow: 'hidden',
        borderRadius: 4,
        cursor: 'pointer',
        height: open ? dH : 22,
        perspective: '600px',
        transition: 'height 0.5s cubic-bezier(0.4,0,0.15,1)',
      }}
      onClick={onToggle}
    >
      {/* 3D panel that folds away when closed */}
      <div
        style={{
          width: '100%',
          height: dH,
          transformOrigin: 'top center',
          transform: open ? 'rotateX(0)' : 'rotateX(-85deg)',
          opacity: open ? 1 : 0,
          transition: 'transform 0.5s cubic-bezier(0.4,0,0.15,1), opacity 0.35s ease-out',
          filter: cssFilter || undefined,
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        <div
          ref={tiltRef}
          style={{
            position: 'absolute',
            inset: 0,
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
        >
          {/* ── SVG Viewfinder ────────────────────────────────────────────── */}
          <svg
            viewBox={`${cropX} 0 ${cropW} ${VH}`}
            width={W}
            height={dH}
            style={{
              display: 'block',
              background: dark ? '#030303' : '#f0ede8',
            }}
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Per-layer blur filters */}
            <defs>
              {sortedLayers.map((_, i) => (
                <filter
                  key={`vf-f-${i}`}
                  id={`vf-blur-${i}`}
                  x="-60%"
                  y="-60%"
                  width="220%"
                  height="220%"
                  colorInterpolationFilters="sRGB"
                >
                  <feGaussianBlur stdDeviation={blurs[i].toFixed(2)} />
                </filter>
              ))}

              {/* Vignette gradient */}
              <radialGradient id="vf-vignette-grad" cx="50%" cy="50%" r="72%">
                <stop offset="55%" stopColor="black" stopOpacity="0" />
                <stop offset="100%" stopColor="black" stopOpacity={dark ? 0.62 : 0.28} />
              </radialGradient>
            </defs>

            {/* Render layers far → near with per-layer blur */}
            {sortedLayers.map((layer, i) => {
              const svgContent = dark
                ? layer.svg
                : (layer.svgLight ?? layer.svg);
              const sigma = blurs[i];
              return (
                <g
                  key={`vf-layer-${i}`}
                  filter={sigma > 0.4 ? `url(#vf-blur-${i})` : undefined}
                  dangerouslySetInnerHTML={{ __html: svgContent }}
                />
              );
            })}

            {/* Vignette overlay */}
            <rect
              x={cropX}
              y={0}
              width={cropW}
              height={VH}
              fill="url(#vf-vignette-grad)"
              style={{ pointerEvents: 'none' }}
            />
          </svg>

          {/* HUD: top-left */}
          <div
            style={{
              position: 'absolute',
              top: 10,
              left: 12,
              fontFamily: FONT,
              fontSize: 10,
              letterSpacing: '0.1em',
              color: '#ffffff',
              lineHeight: 1.6,
              mixBlendMode: 'difference',
              pointerEvents: 'none',
            }}
          >
            <div>{fMm}mm</div>
            <div>f/{N}</div>
          </div>

          {/* HUD: top-right */}
          <div
            style={{
              position: 'absolute',
              top: 10,
              right: 12,
              fontFamily: FONT,
              fontSize: 10,
              letterSpacing: '0.1em',
              color: '#ffffff',
              textAlign: 'right',
              mixBlendMode: 'difference',
              pointerEvents: 'none',
            }}
          >
            {fmtDist(focusDist)}m
          </div>

          {/* Viewfinder frame: corner brackets */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: frameW,
              height: frameH,
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              mixBlendMode: 'difference',
            }}
          >
            <div style={{ position: 'absolute', left: 0, top: 0, width: cornerSize, height: cornerSize, borderTop: '1px solid #fff', borderLeft: '1px solid #fff', opacity: 0.85 }} />
            <div style={{ position: 'absolute', right: 0, top: 0, width: cornerSize, height: cornerSize, borderTop: '1px solid #fff', borderRight: '1px solid #fff', opacity: 0.85 }} />
            <div style={{ position: 'absolute', left: 0, bottom: 0, width: cornerSize, height: cornerSize, borderBottom: '1px solid #fff', borderLeft: '1px solid #fff', opacity: 0.85 }} />
            <div style={{ position: 'absolute', right: 0, bottom: 0, width: cornerSize, height: cornerSize, borderBottom: '1px solid #fff', borderRight: '1px solid #fff', opacity: 0.85 }} />
          </div>

          {/* Center dot */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: '#ffffff',
              mixBlendMode: 'difference',
              opacity: 0.7,
              pointerEvents: 'none',
            }}
          />
        </div>
      </div>

      {/* Collapsed label */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 22,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: FONT,
          fontSize: 7,
          color: 'rgba(255,255,255,0.28)',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          opacity: open ? 0 : 1,
          transition: 'opacity 0.25s',
          background: '#050505',
          borderTop: '1px solid rgba(255,255,255,0.04)',
          pointerEvents: open ? 'none' : 'auto',
        }}
      >
        ▽ VIEWFINDER ▽
      </div>
    </div>
  );
}

export default memo(Viewfinder3D);