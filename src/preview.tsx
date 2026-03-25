import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { SCENES } from './app/scenes';
import type { SceneData } from './app/scenes/types';

// ─── Constants ────────────────────────────────────────────────────────────────
const VW = 1200;
const VH = 600;
const FOCAL_LENGTHS = [24, 28, 35, 50, 70, 85, 100, 135, 200, 300];
const FONT = 'monospace';

function getFovCrop(fMm: number) {
  const cropW = Math.min(VW, Math.max(60, (VW * 24) / fMm));
  const cropX = (VW - cropW) / 2;
  return { cropX, cropW };
}

function computeBlurSigma(dist: number, focusDist: number, fMm: number, N: number): number {
  const d = dist === Infinity ? 1e6 : Math.max(dist, 0.01);
  const S = Math.max(focusDist, 0.01);
  const cocMm = (fMm * fMm * Math.abs(d - S)) / (N * d * S * 1000);
  const sigma = (cocMm / 2) * (VW / 36) * 4;
  return Math.min(sigma, 120);
}

function ScenePreview({
  scene,
  dark,
  focalMm,
  focusDist,
  N,
}: {
  scene: SceneData;
  dark: boolean;
  focalMm: number;
  focusDist: number;
  N: number;
}) {
  const { cropX, cropW } = getFovCrop(focalMm);

  const sorted = [...scene.layers].sort((a, b) => {
    const da = a.distance === Infinity ? Infinity : a.distance;
    const db = b.distance === Infinity ? Infinity : b.distance;
    if (da === Infinity && db === Infinity) return 0;
    if (da === Infinity) return -1;
    if (db === Infinity) return 1;
    return db - da;
  });

  const blurs = sorted.map((l) => computeBlurSigma(l.distance, focusDist, focalMm, N));

  return (
    <svg
      viewBox={`${cropX} 0 ${cropW} ${VH}`}
      width="100%"
      height="100%"
      style={{ display: 'block', background: dark ? '#030303' : '#f0ede8' }}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {sorted.map((_, i) => (
          <filter key={i} id={`prev-blur-${i}`} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation={blurs[i].toFixed(2)} />
          </filter>
        ))}
        <radialGradient id="prev-vignette" cx="50%" cy="50%" r="72%">
          <stop offset="55%" stopColor="black" stopOpacity="0" />
          <stop offset="100%" stopColor="black" stopOpacity={dark ? 0.62 : 0.28} />
        </radialGradient>
      </defs>
      {sorted.map((layer, i) => {
        const content = dark ? layer.svg : (layer.svgLight ?? layer.svg);
        const sigma = blurs[i];
        return (
          <g
            key={i}
            filter={sigma > 0.4 ? `url(#prev-blur-${i})` : undefined}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        );
      })}
      <rect x={cropX} y={0} width={cropW} height={VH} fill="url(#prev-vignette)" />
    </svg>
  );
}

function Preview() {
  const [sceneIdx, setSceneIdx] = useState(0);
  const [dark, setDark] = useState(true);
  const [focalMm, setFocalMm] = useState(35);
  const [focusDist, setFocusDist] = useState(3);
  const [N, setN] = useState(4);

  const scene = SCENES[sceneIdx];

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#111', position: 'relative' }}>
      {/* Controls */}
      <div style={{
        position: 'absolute', top: 12, left: 12, zIndex: 10,
        display: 'flex', flexWrap: 'wrap', gap: 8, fontFamily: FONT, fontSize: 12,
        maxWidth: 'calc(100vw - 24px)',
      }}>
        {SCENES.map((s, i) => (
          <button key={s.id} onClick={() => setSceneIdx(i)} style={{
            padding: '4px 12px', cursor: 'pointer', border: 'none', borderRadius: 4,
            background: i === sceneIdx ? '#FF3C28' : '#333', color: '#fff',
          }}>
            {s.name}
          </button>
        ))}
        <button onClick={() => setDark(d => !d)} style={{
          padding: '4px 12px', cursor: 'pointer', border: '1px solid #555', borderRadius: 4,
          background: '#222', color: '#fff',
        }}>
          {dark ? '☾ Dark' : '☀ Light'}
        </button>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {FOCAL_LENGTHS.map(fl => (
            <button key={fl} onClick={() => setFocalMm(fl)} style={{
              padding: '3px 6px', cursor: 'pointer', border: 'none', borderRadius: 3,
              background: fl === focalMm ? '#FF3C28' : '#333', color: '#fff', fontSize: 10,
            }}>{fl}</button>
          ))}
          <span style={{ color: '#666', fontSize: 10 }}>mm</span>
        </div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <span style={{ color: '#888', fontSize: 10 }}>Focus:</span>
          {[0.5, 1, 2, 3, 5, 10, 20].map(d => (
            <button key={d} onClick={() => setFocusDist(d)} style={{
              padding: '3px 6px', cursor: 'pointer', border: 'none', borderRadius: 3,
              background: d === focusDist ? '#FF3C28' : '#333', color: '#fff', fontSize: 10,
            }}>{d}m</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <span style={{ color: '#888', fontSize: 10 }}>f/</span>
          {[1.4, 2, 2.8, 4, 8, 16].map(ap => (
            <button key={ap} onClick={() => setN(ap)} style={{
              padding: '3px 6px', cursor: 'pointer', border: 'none', borderRadius: 3,
              background: ap === N ? '#FF3C28' : '#333', color: '#fff', fontSize: 10,
            }}>{ap}</button>
          ))}
        </div>
      </div>

      {/* Scene */}
      <div style={{ width: '100%', height: '100%' }}>
        <ScenePreview scene={scene} dark={dark} focalMm={focalMm} focusDist={focusDist} N={N} />
      </div>

      {/* Info */}
      <div style={{
        position: 'absolute', bottom: 12, left: 12, zIndex: 10,
        fontFamily: FONT, fontSize: 11, color: '#666', lineHeight: 1.6,
      }}>
        {focalMm}mm · f/{N} · focus {focusDist}m
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<Preview />);
