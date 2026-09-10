'use client';

import dynamic from 'next/dynamic';

// CRUCIAL SSR FIX:
// Three.js / WebGL touch `window` and `document` at import time. Next.js
// prerenders every route on the server (even client components, for the
// initial HTML), so importing CrystalScene normally would crash the
// Vercel build with "window is not defined". `ssr: false` tells Next to
// skip server rendering for this subtree entirely and mount it only in
// the browser.
const CrystalScene = dynamic(() => import('./CrystalScene'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
    </div>
  ),
});

interface SceneProps {
  score: number;
}

export default function Scene({ score }: SceneProps) {
  return (
    <div className="h-full w-full">
      <CrystalScene score={score} />
    </div>
  );
}
