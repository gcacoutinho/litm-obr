# AGENTS.md — LITM-OBR

This document defines **how agents should behave when working on this repository**.
It is a behavioral and architectural contract — not general documentation.

If in doubt, follow this file over any other document.

---

## 1) Agent Scope & Authority

You are assisting with a web-based Owlbear Rodeo extension.

Your responsibilities:
- Make small, reviewable changes
- Respect existing structure and intent
- Avoid inventing mechanics or APIs
- Ask for clarification when requirements are ambiguous

Do **not** infer or implement gameplay rules unless explicitly instructed.

---

## 2) Project Intent

This project is currently focused on:
- Record-keeping
- Visualization
- UI support for tabletop play

It does **not**:
- Enforce rules
- Automate gameplay
- Make decisions on behalf of players or GMs

Treat all game-related data as **descriptive**, not **prescriptive**.

---

## 3) Development Environment (Nix)

This project uses **Nix devShells**.

### Rules
- Always assume work happens inside the devShell.
- Do not suggest global installs.
- If tooling is missing, update the Nix configuration instead.
- Use npm consistently with the existing `package-lock.json`.
- Prefix commands with `nix develop -c` to run inside the devShell.

Expected entry command format:

```bash
nix develop -c <command>
```

---

## 4) Workflow Expectations

### Before making changes
1. Read `README.md`
2. Inspect existing code and patterns
3. Identify whether the change is UI, state, or SDK-related

### While making changes
- Keep diffs small and focused
- Prefer clarity over abstraction
- Avoid speculative features

### After making changes
1. Validate the changes by running (if possible):
   - `nix develop -c npm run typecheck` or `nix develop -c tsc -p .`
   - `nix develop -c npm run lint` (if available)
   - `nix develop -c npm run build`
   
   If you cannot run commands, state clearly what should be run.

2. Commit the changes:
   - Create a git commit only after validating a logical feature or task
   - Use a clear, descriptive commit message that explains the "why"
   - Do NOT push to the remote repository unless explicitly requested by the user

---

## 5) TypeScript Rules

- Avoid `any`
- Prefer `unknown` + narrowing
- Use `type` for unions
- Let TypeScript guide correctness

---

## 6) React Conventions

- Functional components only
- Hooks for side effects
- No side effects during render
- Small, composable components

---

## 7) Owlbear SDK Usage

### Official references
- https://docs.owlbear.rodeo/extensions/apis/
- https://docs.owlbear.rodeo/extensions/tutorial-hello-world/

### Rules
- Never guess SDK APIs
- Confirm behavior via documentation
- Prefer SDK types over custom definitions

### Integration guidelines
- Centralize SDK access (e.g., `src/obrd/`)
- UI components should not directly call SDK methods unless intentional
- Clean up listeners and subscriptions

---

## 8) SDK Examples (Reference Only)

These examples are illustrative — **not authoritative**.

```ts
useEffect(() => {
  OBR.onReady(() => {
    // SDK ready
  });
}, []);
```

```ts
useEffect(() => {
  return OBR.broadcast.onMessage("channel", (event) => {
    // handle message
  });
}, []);
```

---

## 9) Development Constraints

- Assume the app runs in an iframe
- Assume resizing can happen at any time
- Avoid long-running tasks on the main thread
- Do not rely on filesystem or server access

---

## 10) Output Format When Responding

When completing a task, respond with:

1. Summary  
2. Files changed  
3. How to test  
4. Notes / assumptions  

---

## 11) Guiding Principle

> Prefer clarity over power.  
> Prefer understanding over automation.  
> Prefer small, correct steps over clever solutions.
