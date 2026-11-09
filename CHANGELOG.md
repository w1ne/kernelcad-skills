# kernelCAD skills v0.17.1 (Claude package repair)

- Correct Claude plugin manifest for automatic discovery of all 28 skills.
- Add consistent marketplace metadata, branded square icon, and repeatable CI validation.
- Keep existing user-connected MCP servers; do not auto-install duplicate connections or read credentials.

# Unreleased

## Added

- Dimensions toggle in the 3D viewer (Studio, `/p/<slug>`, ChatGPT viewer): automatic overall size, grouped holes, hole spacing, radii and chamfers; on by default when a model declares dimensions; `?dims=1` forces it on.
- Measure tool: click two points for distance and ΔX/ΔY/ΔZ, with snapping to corners, edges and faces; one click on a round edge shows its diameter.
- `shape.dimension()` for declared linear, diameter, radius and angular dimensions. They show in the viewer, replace the automatic bounding-box dimensions on the PDF/SVG drawing, and `evaluate_script` returns their values.
- Drawing (PDF) in the `/p/<slug>` Download dropdown, and Export Drawing (PDF) in Studio's export menu and command palette.
- Example `examples/gallery/mounting-bracket-dimensioned.kcad.ts` and guide `docs/guide/dimensions-measure-drawings.md`.

# kernelCAD v0.17.0
