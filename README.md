# kernelCAD skills

Cross-agent install for the kernelCAD skill tree. Local MCP by default; hosted MCP available as an opt-in fallback.

## Install

```bash
npx skills add w1ne/kernelcad-skills
```

The `skills` CLI drops each `SKILL.md` into your agent's skill directory:

| Agent          | Project-scope path | Global-scope path     |
| :---           | :---               | :---                  |
| Claude Code    | `.claude/skills/`  | `~/.claude/skills/`   |
| Cursor         | `.agents/skills/`  | `~/.cursor/skills/`   |
| Codex          | `.agents/skills/`  | `~/.codex/skills/`    |
| GitHub Copilot | `.agents/skills/`  | `~/.copilot/skills/`  |

## Connect the kernelCAD MCP

### Local (default)

Install the CLI once:

```bash
npm i -g kernelcad@^0.17
```

Then register a local stdio MCP server in your agent (per-agent snippets below).

#### Claude Code

```bash
claude mcp add kernelcad -- kernelcad mcp
```

#### Cursor

Add the kernelcad MCP entry to your MCP config:

```json
{ "mcpServers": { "kernelcad": { "command": "kernelcad", "args": ["mcp"] } } }
```

#### Codex

Add the kernelcad MCP entry to your MCP config:

```toml
[mcp_servers.kernelcad]
command = "kernelcad"
args = ["mcp"]
```

#### GitHub Copilot

Add the kernelcad MCP entry to your settings:

```json
{ "mcp.servers": { "kernelcad": { "command": "kernelcad", "args": ["mcp"] } } }
```

### Hosted

No local install. OAuth runs on the first tool call.

```bash
claude mcp add --transport http kernelcad https://mcp.kernelcad.com/mcp
```

## Skills in this distribution

- `blockout-model` — Coarse parametric blockout of the primary masses before committing to detail. Establishes the bounding envelope, canonical-view alignment, and reference-image plane, then confirms the blockout is plausible before detail work begins.
- `image-replicator` — The render→score→iterate loop for reference-photo reconstruction. How to invoke kernelcad render, run scoreAgainstReference, interpret per-gate numbers, and decide which gate to chase next.
- `kernelcad` — kernelCAD entry decision tree — what skill to load when, universal conventions that apply everywhere. Load this FIRST; it points at the right specialty skill for your task.
- `kernelcad-assemblies` — Multi-part assemblies — assembly(), parts, connectors, 7 mate types, fixed and revolute joints, .model()/.solvedModel(). Use for any model with two or more mechanical parts that need joint metadata.
- `kernelcad-authoring` — kernelCAD model authoring API — primitives, transforms, booleans, sketches, path-builder, sketch-text, return-single-shape rule, conventions, CLI commands, and verification gates. Load this when writing or modifying .kcad.ts geometry.
- `kernelcad-drawings` — Export 2D engineering-drawing sheets (SVG, or a printable PDF on a standard sheet) from any model or assembly — third-angle front/top/left + isometric views with hidden-line removal, overall dimensions, and a title block. Use when the deliverable is a human-readable fabrication or review drawing.
- `kernelcad-fea` — Answer "will this part hold this load?" with solver evidence — declare a linear-static structural study with shape.feaStudy({ material, fixed, loads, minSafetyFactor? }), then run it with run_fea for peak von Mises stress, peak displacement, minimum safety factor against yield, named hot-spot regions, mesh-trust flags and stress-heatmap PNGs. A declared minSafetyFactor turns the study into a gate that fails evaluate_script. Use when sizing a bracket, mount, tab, clevis or any load-bearing part, when a load-capacity check reported beam-not-applicable, or before committing to a wall thickness or material grade.
- `kernelcad-features` — Edge and face features — fillet, chamfer, shell, face refs through operations, holes, cutouts. Use when adding rounded edges, recesses, bolt patterns, or carved profiles to a kernelCAD model.
- `kernelcad-fields` — Signed-distance fields — sdf.sphere/.box/.cylinder/.torus, sdf.smoothBlend, sdf.materialize. Use for smooth-blended primitives and organic shapes that BREP fillet cannot reach; result is a standard Shape.
- `kernelcad-from-reference` — Reproduce a real-world artifact from one or more reference photographs using kernelCAD primitives. Orchestrator skill — names sub-skills and their order. Load this first; it points at the right sub-skill for each stage.
- `kernelcad-kinematic` — Use when verifying whether a moving assembly is buildable — sampled-pose collision sweeps across joint ranges, IK reachability for end-effector targets, mounting-hole fastener consistency, and static-load capacity on cantilever-shaped parts. Loads alongside kernelcad-authoring to gate design-time mechanism feasibility.
- `kernelcad-mcp` — kernelCAD MCP server (kernelcad mcp) — introspect a running model, list features, run edit ops, fetch diagnostic codes. Use when you need to inspect a live model dynamically rather than re-evaluate from source.
- `kernelcad-nurbs` — NURBS surfaces (nurbsSurface, surfaceFromCurves, surfaceFromBoundary, .thicken, .toShape) AND NURBS curves (nurbsCurve, spline3d, hermiteG2, curveBridge, Curve3D.bridge) AND surfaceIntersection AND rail loft (Sketch.loft rails) AND multi-section sweeps (variableSweep) AND G1/G2 fillet continuity AND 2D NURBS path segments (path().spline / .nurbsSegment / .hermiteG2). Use for freeform geometry that primitives + sketches cannot express.
- `kernelcad-params` — Editable symbolic parameters — param(), params(), ParamRef arithmetic, MCP set_param. Use when the model needs values the agent or studio can change live.
- `kernelcad-parts` — Bundled parts catalog — discover, fetch, and mate standard fasteners, bearings, motors, headers, and connectors. Use whenever the model needs an off-the-shelf component instead of hand-modeled placeholder geometry.
- `kernelcad-patterns` — Mechanical patterns — linear, circular, grid. Use when replicating a sub-feature (hole, rib, fin, tab, spoke) along an axis, around an axis, or across a 2D grid as a single editable unit.
- `kernelcad-print` — Close the physical print loop — check FDM printability and pick the print orientation first (dfmSpec process 'fdm'), slice a model to real G-code with a slicer CLI (export target:'model' format:'gcode'), then upload it to a network printer and start the print (send_to_printer). Load when the task is "print this" / "send this to my printer" / "will this print without supports", not just "export the mesh".
- `kernelcad-repair` — Turn a failed evaluation into a bounded, applied fix — why_did_this_fail for the repair region and candidates, then repair_script to apply and verify. Load when evaluate_script reports an error, a gate fails, or a feature shows up degraded in featureHealth.
- `kernelcad-sdformat` — Export multi-part assemblies to SDFormat — closed kinematic loops, native ball joints, solved per-link poses, per-link inertial/visual/collision with mesh files. Use when the downstream simulator ingests SDFormat directly or the assembly needs closed-loop / native-spherical-joint support.
- `kernelcad-sheet-metal` — Folded sheet-metal parts — sheetMetal(profile, opts), .bend(edge, angle, radius), .flattenPattern(). Use when building L-brackets, U-channels, service panels, or any part fabricated from a flat blank + folds.
- `kernelcad-shopcheck` — Preflight a sheet-metal flat pattern or planar body against a job-shop's public ordering rules — material catalog, minimum hole / slot / web, bend radius, flange minimums, sheet-stock limits. Vendor identifier and material SKU are required parameters. Use when about to export DXF / STEP for a manufacturing service and you need a conservative, evidence-backed go / no-go before upload.
- `kernelcad-srdf` — Add planning-group, end-effector, virtual-joint, and allowed-collision metadata on top of an assembly. Use after kernelcad-urdf when the downstream consumer needs motion-planner semantics layered on the URDF.
- `kernelcad-trace-from-image` — Convert pixel-space features from a reference photo into normalized [0,1] waypoints, then into mm coordinates feedable to path().spline / path().nurbsSegment. Uses the trace_from_image MCP tool. Load when your blockout is in place and the next step is an organic-curve outline (eyewear brow, ergonomic handle, sneaker midsole) that would take more than a minute to eyeball off the photo.
- `kernelcad-urdf` — Export multi-part assemblies to URDF — links, joints, inertial blocks, per-link STL meshes. Use when an assembly needs to be consumed by an external motion planner or simulator.
- `photo-to-device` — Use when rebuilding a simple front-on consumer electronic, passive enclosure, controller, instrument face, or hobby case from a photo with a known dimension and no moving mechanism.
- `prepare-prompt` — Turn a vague user ask into a Real Object Brief before writing any geometry. The brief is the contract that all downstream sub-skills work from.
- `render-inspect` — Interpret diagnostic hints from kernelcad evaluate during a reference reconstruction. Which hints mean "missing feature", which mean "wrong arg", which mean "illegal geometry". Cross-references kernelcad-features for feature details.
- `use-the-available-kernel` — Hard rules for which kernelCAD primitive to reach for when authoring from a reference photo. The from-reference loop fails most often because the author defaults to easy primitives and skips ones that exist. Read before writing any geometry.

## Source

This repo is generated from the kernelCAD source tree on each release tag. Edits to the SKILL.md files happen upstream — open a PR against the kernelCAD source repo, not here.
