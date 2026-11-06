# AGENTS.md — Project Contract

## Source of truth
Read `SOT/PRD.md`, `SOT/UI-GUIDELINE.md`, and `SOT/IMPLEMENTATION_PLAN.md` before making changes. These three files are the sole product specification. If implementation conflicts with them, the SOT wins.

## Scope
- Build a React + Vite front-end prototype for laundry transactions and status tracking.
- Use local dummy data only.
- Keep the blue/white/black futuristic SaaS visual direction and responsive behavior.
- Do not add backend, database, external API, real payment processing, authentication services, or unrelated features.

## Working rules
1. Make the smallest coherent change that satisfies the requested scope.
2. Preserve Indonesian UI copy and the agreed laundry status sequence.
3. Keep business helpers/data separate from UI where practical.
4. Do not claim local demo state is persisted to a server.
5. Destructive actions need confirmation; form input needs labels and validation.
6. Any proposed scope or SOT change requires explicit user approval before implementation.
7. Do not overwrite user work or introduce dependencies without a clear need.

## Quality gate
Run `npm run build` after meaningful changes. Manually verify primary navigation, CRUD flows, transaction total calculation, status history, tracking lookup, print receipt, CSV export, and mobile layout. Report limitations honestly.
