import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // All routes use Client rendering — this is a dynamic SPA that fetches
  // live data from the backend. SSR Prerender mode was trying to execute
  // HTTP calls to localhost:8080 at build time, causing the 9-second hang.
  { path: '**', renderMode: RenderMode.Client },
];
