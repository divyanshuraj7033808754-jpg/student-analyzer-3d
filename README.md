# Student Analyzer 3D

A futuristic, 3D-animated analytics platform for student academic performance —
built with Next.js 14 (App Router), TypeScript, Tailwind CSS, React Three Fiber,
and Framer Motion.

## Stack

- **Framework:** Next.js 14 (App Router) + TypeScript (strict mode)
- **Styling:** Tailwind CSS, Lucide React icons, Framer Motion
- **3D:** Three.js via `@react-three/fiber` + `@react-three/drei`
- **Backend:** Next.js Route Handler (`app/api/analyze/route.ts`) with Zod validation
  — no external database required

## Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Run the dev server
npm run dev

# 3. Open http://localhost:3000
```

To verify a production build locally (recommended before deploying):

```bash
npm run build
npm run start
```

## Deploying to Vercel

**Option A — Vercel Dashboard**
1. Push this project to a GitHub/GitLab/Bitbucket repo.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Vercel auto-detects Next.js — no build command changes needed
   (`next build` / `.next` output are the defaults).
4. Click **Deploy**.

**Option B — Vercel CLI**
```bash
npm i -g vercel
vercel        # first deploy / preview
vercel --prod # promote to production
```

No environment variables are required for the base app — everything runs
server-side within the Route Handler, with no external DB.

## Why this won't hit the classic "window is not defined" Vercel error

Three.js/WebGL code touches `window`/`document` at import time. Next.js
prerenders every route on the server (even for client components, to produce
the initial HTML), so importing a `<Canvas>` component directly would crash
the build. This project avoids that with a two-file split:

- `components/3d/CrystalScene.tsx` — the actual `<Canvas>` + Three.js content.
- `components/3d/Scene.tsx` — imports `CrystalScene` via `next/dynamic` with
  `{ ssr: false }`, which tells Next to skip server-rendering that subtree
  entirely and mount it only in the browser.

`app/page.tsx` only ever imports `Scene`, never `CrystalScene` directly.

## Project Structure

```
student-analyzer-3d/
├── app/
│   ├── api/analyze/route.ts   # POST /api/analyze — validation + scoring engine
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                # hero + form + dashboard composition
├── components/
│   ├── 3d/
│   │   ├── CrystalScene.tsx    # actual R3F Canvas (client-only content)
│   │   └── Scene.tsx           # ssr:false dynamic wrapper
│   ├── ui/
│   │   ├── CircularProgress.tsx
│   │   ├── RadarChart.tsx
│   │   └── RiskGauge.tsx
│   ├── Dashboard.tsx
│   └── StudentForm.tsx
├── lib/
│   ├── analysis.ts             # scoring / risk / percentile engine
│   ├── schema.ts                # Zod validation
│   └── types.ts                 # shared TS interfaces
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## API

`POST /api/analyze`

Request body:
```json
{
  "name": "Priya Sharma",
  "subjects": [
    { "subject": "Mathematics", "score": 82 },
    { "subject": "Science", "score": 76 },
    { "subject": "English", "score": 91 }
  ],
  "attendance": 88,
  "studyHours": 3.5,
  "extracurricular": 6
}
```

Response `200`:
```json
{
  "success": true,
  "data": {
    "performanceIndex": 83.4,
    "overallGrade": "A",
    "riskLevel": "low",
    "riskFactor": 12.5,
    "consistencyIndex": 88.2,
    "percentile": 74,
    "subjectBreakdown": [ { "subject": "Mathematics", "score": 82, "strength": true } ],
    "weaknesses": [],
    "insights": ["..."],
    "tips": ["..."],
    "colorTheme": "green"
  }
}
```

Response `400` (validation failure) includes a Zod `details.fieldErrors` object.

## Notes / Known Constraints

- This build was authored and hand-verified in an offline sandbox without
  network access, so `npm install` / `next build` could not be executed here.
  The dependency versions in `package.json` are pinned to a mutually
  compatible set (Next 14.2.5, React 18.3.1, three 0.160.0, R3F 8.15.19, drei
  9.99.7). **Run `npm run build` locally once before your first deploy** to
  catch any environment-specific issues early.
- No database is used; all computation happens per-request in the Route
  Handler. If you want persistence (saved student profiles, history), add a
  store (Postgres/Supabase/Vercel KV) and a second endpoint — the current
  `AnalysisResult` shape is ready to be persisted as-is.
