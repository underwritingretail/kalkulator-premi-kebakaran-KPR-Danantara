# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

For the Perluasan Jaminan cards, preserve the agreed icon semantics: three-line water waves for Banjir, cracked/outlined ground for Gempa, a group of people for Kerusuhan, and fire for Kerusuhan dan Huru-Hara.

In the Total TSI banner, show only the Total TSI label and amount; do not display the maximum-limit copy.

Keep Perluasan Jaminan collapsed by default. Show an inline Ya/Tidak question beside the section title, reveal extension choices only for Ya, and clear selected extension data when Tidak is chosen.

Do not show a descriptive paragraph below the main Kalkulator Premi Kebakaran KPR Danantara heading.

Keep Alamat Risiko manually editable and provide a Pilih dari Map action. The map opens in a modal, resolves an address from a clicked OpenStreetMap location, and only updates the field after the user confirms Gunakan Alamat.

Use the field label `Okupasi (Penggunaan Bangunan)`. Keep construction-class descriptions inside the opened Kelas Konstruksi dropdown, not below the selected field.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.
