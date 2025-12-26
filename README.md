# LITM-OBR

LITM-OBR is a web-based extension for **Owlbear Rodeo**, built with **React**, **TypeScript**, and **Vite**.

The project focuses on **record-keeping and visualization** for tabletop roleplaying games, without enforcing rules or automating gameplay.

---

## Project Goals

- Provide a clean, responsive UI for tracking information during play
- Integrate seamlessly with Owlbear Rodeo via its official SDK
- Remain lightweight, modular, and easy to extend
- Avoid rule enforcement or automated game logic

This project intentionally leaves game mechanics to the table and the players.

---

## Tech Stack

- **Framework:** React
- **Language:** TypeScript
- **Build Tool:** Vite
- **SDK:** `@owlbear-rodeo/sdk`
- **Environment:** Nix (via flakes)
- **Runtime:** Browser (embedded in Owlbear Rodeo)

---

## Project Structure

```
litm-obr/
├── src/
│   ├── main.tsx        # React entry point
│   ├── App.tsx         # Main application shell
│   ├── App.css         # Component styles
│   ├── style.css       # Global styles
│   ├── hooks/          # Custom React hooks
│   ├── obrd/           # Owlbear SDK wrappers / adapters
│   ├── components/     # UI components
│   └── utils/          # Utilities
├── public/
│   ├── icon.svg
│   └── manifest.json
├── index.html
├── vite.config.js
├── tsconfig.json
├── flake.nix
├── package.json
└── AGENTS.md
```

---

## Development Environment

This project uses **Nix flakes** to ensure reproducible development environments.

### Enter the dev shell

```bash
nix develop
```

### Common commands

```bash
npm run dev       # Start the dev server
npm run build     # Build production assets
npm run preview   # Preview production build
```

---

## Owlbear Rodeo Integration

This extension runs inside Owlbear Rodeo via an iframe.

### Key characteristics

- Loaded inside the Owlbear Rodeo client
- Communicates through the official SDK
- Requires CORS configuration for development
- Runs entirely client-side

### SDK references

- Documentation: https://docs.owlbear.rodeo/
- API reference: https://docs.owlbear.rodeo/extensions/apis/
- Getting started: https://docs.owlbear.rodeo/extensions/tutorial-hello-world/

---

## Design Philosophy

- Favor clarity over cleverness
- Keep UI and logic loosely coupled
- Avoid enforcing rules or outcomes
- Make state visible and understandable

---

## Status

Early development / exploratory phase.

Functionality and structure may evolve as the project grows.

---

## Contributing

See `AGENTS.md` for contribution rules, development constraints, and agent behavior guidelines.