# STRIVO

A mobile-first, private fitness tracker built with Next.js App Router, strict TypeScript, Tailwind CSS and Lucide. Data lives in LocalStorage; there is no account, backend, analytics or external API.

## Run

Requires Node.js 20.9 or later.

```sh
npm ci
npm run typecheck
npm run build
npm start
```

Open http://localhost:3000. For development use `npm run dev`.

## Features

Overview, dated workout checklists and rest days, editable beginner workout plan, weight history and date-scaled SVG trend chart, seven dated body measurements, goal editing, kg/lb and in/cm conversion, validated JSON import/export, and confirmed reset. The initial 69 kg weight and seven measurements are explicitly labeled demo entries. New check-ins replace entries on the same date. Weight progress works for both gain and loss goals and is clamped to 0–100%.

The plan is general fitness information. A brief safety reminder is shown in Workouts.

## PWA

Deploy on HTTPS using a Node-compatible Next.js host. `npm start` on localhost also supports service workers. Manifest, standalone mode, regular and maskable icons, Apple touch icon, and production-only service worker are included. Open Settings for installation instructions.

The service worker uses network-first navigation with a cached generic shell fallback. Only immutable Next static assets and explicit public shell resources are cached. LocalStorage records never enter service-worker responses. RSC and query requests bypass the cache. A waiting worker is activated through the in-app update button. Increase the service-worker cache version when changing its caching policy. Next static asset names are content hashed.

### Production installation QA

1. Run the production commands above; visit localhost:3000 in Chrome.
2. In DevTools > Application, confirm manifest validity, 192/512 icons, service-worker activation, and no installability errors.
3. Reload after activation, enable Offline, and reload again. Navigate all five sections and add an entry; reconnect and reload to confirm persistence.
4. On Android Chrome over HTTPS, use Install app / Add to Home screen. On iOS Safari use Share > Add to Home Screen and Open as Web App when offered. Check standalone launch and safe-area navigation on actual devices.
5. Deploy a new build, revisit online, and accept the update banner if a worker is waiting.

LocalStorage is per browser and origin. Export before clearing browser data, changing devices or moving domains. Private browsing and storage quotas may prevent persistence; the app reports failures. Import replaces all records only after confirmation, rejects invalid schemas and files over 5 MB. There is no cloud backup or synchronization. Device installation and platform-specific offline behavior require real-device verification.
