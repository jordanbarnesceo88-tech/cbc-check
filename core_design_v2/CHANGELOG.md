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

## Notes for going live
- **Form endpoint:** open `js/main.js`, set `var FORM_ENDPOINT = '...'` to your Formspree/Getform/own POST URL. Leave empty to keep demo mode.
- **Contact email:** `info@cbc.com` is a placeholder in `index.html` and `js/main.js` (3 spots). Replace with the real address.
- **Fonts/icons/3D** load from CDNs (Google Fonts, Phosphor, GSAP, Three.js). For full offline/production control, self-host them.
