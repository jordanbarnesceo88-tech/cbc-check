# Core Design v2 — Change Log

Every step below is a separate git commit, so any of them is a clean roll-back point.

## How to roll back
From the project root (`website_3`):

```bash
git log --oneline            # list every step with its hash
git checkout <hash> -- core_design_v2   # restore the folder to that step (keeps newer history)
# or, to move the whole project back to a step:
git revert <hash>            # safely undo one step
git reset --hard <hash>      # hard rewind (destructive; only if you are sure)
```

If a change ever looks wrong in the browser, tell me which step and I will roll it back.

## History (newest last)

| Step | Commit subject | What changed |
|------|----------------|--------------|
| 0 | `Baseline: 5 design directions + core_design_v2 (verified)` | First tracked snapshot: v1–v5 prototypes + core_design_v2. |
| 1 | `core_v2 step 1: split CSS into cascade-ordered partials` | `css/styles.css` → `tokens.css`, `base.css`, `components.css`, `sections.css`, `responsive.css`. Linked in order in `index.html`. No visual change. |
| 2 | `core_v2 step 2: replace hand-rolled icons with Phosphor (CDN)` | Service-panel icons now use the Phosphor icon set (regular) via CDN: calculator, scales, users-three, chart-line-up, shield-check, strategy. |
| 3 | `core_v2 step 3: 3D cubes assemble on load and on scroll` | Hero cubes start dispersed, assemble into formation on load, and disperse/re-assemble as you scroll the hero (scrubbed). Reduced-motion shows the assembled formation, static. |
| 4 | `core_v2 step 4: working form submission flow + states` | Contact form does a real `fetch` POST with loading / success / error states. Set `FORM_ENDPOINT` in `js/main.js` to go live (Formspree / Getform / your own URL); empty = demo mode. |
| R1 | `core_v2 refine 1: carry the ledger grid across all sections` | The hero grid motif now paints site-wide (body), white sections made transparent to show it, approach band + footer get matching grids. |
| R2 | `core_v2 refine 2: calmer hero 3D (taste)` | Removed per-cube spin (busy flicker); one slow group rotation + fixed 3/4 tilt + pointer parallax. Assemble-on-scroll kept. |
| R3 | `core_v2 refine 3: richer approach timeline` | Added a 5th step (Optimization); per-step reveal (dot pop + slide), step activates as the red fill reaches it; timeline column parallax (desktop). |
| R4 | `core_v2 refine 4: add Privacy + Terms pages and footer legal links` | New bilingual single-column legal pages (`privacy.html`, `terms.html`, `css/legal.css`, `js/legal.js`); footer on every page links to them. |
| R5 | `core_v2 refine 5: responsiveness across screen sizes` | Breakpoints at 900 / 600 / 480 / 360 (tablet stack, phone header fit, stats + footer collapse, smaller hero headline). Legal pages now also load `responsive.css`. |
| R6 | `core_v2 refine 6: fix + strengthen timeline scroll effect` | The timeline triggers sat after the pinned services section and never fired (stale positions). Fixed with `refreshPriority` on the pin. Added a sticky heading + per-step parallax so scrolling clearly drives the timeline (fill scrubs, steps activate, steps drift). Asset links now carry `?v=` cache-busting. |
| R7 | `core_v2 refine 7: upgrade principles into value cards (ui-ux-pro)` | Bare number+word becomes a value card: Phosphor icon, index number, value, one-line benefit. Hover shows a red box-accent + red icon; cards stagger-reveal on scroll. Contained the horizontal pan track (`overflow-x:clip`) to remove a reported (non-scrolling) width overflow. Assets bumped to `?v=3`. |
| R8 | `core_v2 refine 8: unify grid + principle hover reveal (taste)` | (1) Removed the hero's masked/parallax grid layer (the top/bottom blur); hero is transparent so the single continuous body grid shows, same as every section. (2) `#approach` is a transparent wash (no offset grid) so lines run straight through; removed the uneven floating hero box-particles. (3) Principle cards: removed hover colour change; the description now stays hidden and fades + rises in on hover (always shown on touch). `sections.css` bumped to `?v=4`. |
| R9 | `core_v2 refine 9: review + refactor (dead code, robustness)` | Behavior-preserving cleanup: removed dead i18n keys (`hsJur/hsDir/hsYears/scrollHint`), the no-op `#hero [data-par]` parallax loop, unused `userData.spin`, unread `raf`, unused `--on-dark` token, unused `.mono` class, unused `id="navCta"`; folded the redundant `FORM_T.error` into the existing `formError` i18n. Added a `<noscript>` fallback so no-JS users still see the reveal content. All local assets bumped to `?v=5`. |
| R10 | `core_v2 refine 10: animated line icons (draw-on)` | Replaced the static Phosphor font icons with inline Tabler stroke SVGs that draw themselves on when scrolled into view (works in the pinned horizontal services too) and replay on card hover. Dropped the Phosphor CDN (one fewer dependency). Reduced-motion + no-JS leave icons fully drawn. `index.html` assets bumped to `?v=6`. |
| R11 | `core_v2 fix: services pin overlapping the About section` | On deploy, slow web-font load grew About after the pin's start was computed, so the pinned services section engaged early and overlapped About (now visible since `#services` is transparent for the grid). Fix: a debounced `ResizeObserver` re-arms ScrollTrigger on any document-height change, and removed `anticipatePin` (which pinned a few px early at the boundary). `main.js` bumped to `?v=7`. |

## Notes for going live
- **Form endpoint:** open `js/main.js`, set `var FORM_ENDPOINT = '...'` to your Formspree/Getform/own POST URL. Leave empty to keep demo mode.
- **Contact email:** `info@cbc.com` is a placeholder in `index.html` and `js/main.js` (3 spots). Replace with the real address.
- **Fonts/icons/3D** load from CDNs (Google Fonts, Phosphor, GSAP, Three.js). For full offline/production control, self-host them.
