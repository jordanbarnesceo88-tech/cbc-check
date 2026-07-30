# Final Design — Change Log

Forked from `core_design_v2` (commit `1c5a195`) as the final deliverable folder.
`core_design_v2` stays untouched as the rollback baseline; every step here is its own commit.
Full history of everything inherited up to the fork lives in `core_design_v2/CHANGELOG.md`.

## History (newest last)

| Step | What changed |
|------|--------------|
| F0 | Fork of `core_design_v2` at `1c5a195` (identical starting point). |
| F1 | **Hero 3D rebuilt as one cube.** The scattered composition is gone. Eight parts now lock into a single 2x2x2 cube (edge 2.96 units, 0.06 gaps): lit white faces so it reads solid, black edges in the site's line language, one red accent part. Parts also *rotate into alignment* as they assemble (chaos to order). Motion: they fly in and lock on load, then a slow cycle opens the cube to show its parts and snaps it back together; **hovering the composition assembles it and holds**; it flies apart as the hero scrolls away. Reduced motion shows the assembled cube, static. |
| F2 | **Two-tone icons.** Every icon is now a black (white on the flagship card) base layer plus **one red accent element** (`.ic-acc`): calculator display, scale pans, the central person, the trend line, the check mark, the top node, the medal, the anchor ring, the pupil, the lenses. Icon boxes and glyphs enlarged (services 46→54 / 24→28, principles 52→58 / 26→30). The draw-on animation is preserved and the accent layer draws last for emphasis. |

## Notes
- **Deployment:** `netlify.toml` publishes the repo root, so this folder is live at `/final_design/` alongside `/core_design_v2/`. The site root still redirects to `core_design_v2/`; switching the redirect to `final_design/` is a one-line change once this is approved.
- **Icons:** vector, built on library geometry (Tabler). They inherit `currentColor`, so the same markup works on white and black cards, scales crisply, and animates. AI-generated raster icons were considered and rejected for those reasons.
- Still open before launch (inherited): set `FORM_ENDPOINT` in `js/main.js`, replace the `info@cbc.com` placeholder.
