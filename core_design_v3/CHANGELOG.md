# Core Design v3 — "Blackout" — Change Log

A completely new pass over `core_design_v2`: same brand system (black / red `#F40000` /
white / gray), same content, IA and bilingual mechanics — inverted onto an off-black
canvas with a new type voice and new motion DNA.

| Step | Commit subject | What it is |
|------|----------------|------------|
| 0 | `core_v3: new "Blackout" version (Fable 5)` | Initial build. Off-black canvas + the same continuous 64px ledger grid (inverted); pure-black bands (marquee, stats, footer); Unbounded display + Golos Text body (full Cyrillic); grid-aligned flickering mosaic canvas hero (2D, no Three.js); sticky-STACK services with a white flagship anchor card; approach with a giant outlined numeral that swaps as steps pass; outlined-type sectors marquee; draw-on Tabler icons, count-up stats, magnetic CTA and RU/EN toggle carried over from v2. |

## Notes
- **Deployment:** `netlify.toml` now publishes the repo root, so both versions ship side by side. Site root still redirects to `core_design_v2/` (the current live design); this version is at `/core_design_v3/`. Deep links to the old root-level pages move under `/core_design_v2/` (e.g. `/core_design_v2/privacy.html`).
- **Legal pages:** the footer links to the shared pages in `core_design_v2` (relative `../core_design_v2/privacy.html`). If v3 is ever promoted to the only published folder, copy those pages in.
- **Form:** same contract as v2 — set `FORM_ENDPOINT` in `js/main.js` to go live; empty = demo mode.
- Rollback works the same as v2: every step is one commit (`git revert <hash>`).
