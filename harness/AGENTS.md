# Agent rules for kernelCAD skills

These rules apply to every agent that loads a kernelCAD skill, regardless of host.

## CAD authoring discipline

For any task that creates or modifies CAD output, use the bundled
`kernelcad` skill first and load `kernelcad-authoring` before editing a
`.kcad.ts` model. The source file is the design source of truth; generated
PNG/MP4/STEP/STL/score artifacts are evidence or deliverables, not files to
hand-edit.

Adopt this loop:

1. Classify the job and write down the engineering intent before coding.
2. Plan the `.kcad.ts` source, parameters, imports, explicit output artifacts,
   and verification commands.
3. Edit source and provenance only.
4. Generate named targets only; do not refresh whole artifact directories unless
   the task is explicitly a release/demo rebuild.
5. Validate with deterministic commands before relying on screenshots.
6. If a rendered artifact is produced, inspect it visually and report concrete
   visible evidence. Do not mark visually broken CAD done because tests passed.
7. When visual evidence matters, run `kernelcad render inspect <file> <outDir>`
   to produce a deterministic inspection bundle with a manifest and canonical
   RGB views. Add `--channels rgb,mask,depth,normals` when machine-readable
   object masks, depth, or view-space normals are needed. Use `--focus <names>`
   or `--hide <names>` to isolate feature ids or assembly part names when
   clutter would obscure the check. Keep richer channels in the same manifest
   packet; do not replace the canonical RGB views.

Prefer `lib.fromSTEP(...)` for real purchased components such as servos,
bearings, motors, fasteners, sensors, PCBs, and connectors. Hand-modeled
placeholder boxes/cylinders are acceptable for blockouts, but final review must
either replace them with vendor/catalog geometry or label the limitation.

## Multi-agent parallelization

When multiple agents (or a single agent dispatching subagents) work on
the same `.kcad.ts` source, serialize across these three buckets and
parallelize only within a bucket:

- **Mutating generation** — anything that writes to the `.kcad.ts` file
  or changes its evaluation: every `add_*` MCP edit
  tool, `set_param`, `remove_feature`.
- **Inspection** — read-only tools that observe the current evaluation:
  `evaluate_script`, `inspect`, `query`,
  `lookup_diagnostics`, `why_did_this_fail`, `verify`.
- **Render / review** — anything that produces a visual artifact:
  `kernelcad render inspect`, `review_cad`, screenshot capture.

Two agents inspecting the same source in parallel is fine. Two agents
rendering it in parallel is fine. Mixing buckets against the same
source produces stale views and corrupt state — sequence inspection
→ mutating generation → render → review.

Derived artifacts (STEP, STL, DXF, 3MF, GLB, URDF, SRDF, SDF, PNG,
MP4) are outputs, not source. Do not hand-edit them.
