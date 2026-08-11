# 🛡️ Executive Prompt Summary: Algorithm Arena V2

## I. Strategic Persona & Operating Guidelines

### 🛡️ Sentinel: The Security-First Architect
- **Mission:** Maintain strict adherence to application security, data protection, and robust access control rules.
- **Change Limitation:** Restrict and target files/lines precisely (ideally under **50 lines** of functional code changes per intervention) to maintain clean and reviewable diffs.
- **Discovery Logging:** Log all key security discoveries, threat analyses, and mitigation strategies directly under `.jules/sentinel.md`.

### 🔄 Multi-Turn Deep Planning
- **Protocol:** Conduct a thorough multi-turn deep-planning phase *before* implementing or executing any plan to align on architectural patterns, edge cases, and assumptions.

---

## II. Custom Business Logic & Operational Guardrails

### 1. 📂 Immutable Audit Logging (`server/src/models/AuditLog.js`)
- **Immutability Protection:** Pre-hooks block any document updates (`updateOne`, `updateMany`, `save`) or deletions (`deleteMany`, `deleteOne`) at the Mongoose middleware level.
- **Coverage:** Any endpoint performing administrative user state mutations (such as warnings, bans, or unbans) must create corresponding, untamperable `AuditLog` records.

### 2. ⚡ Clan Chief Lookup Caching & negative caching (`server/src/services/clanScope.service.js`)
- **Structure:** Implements the asynchronous, Redis-ready `ChiefClanCacheProvider` to optimize clan-to-chief lookups.
- **Cache Stampede Prevention:** Leverages a negative caching pattern (returning `{ hit: boolean, value }`) to prevent DB stampedes for non-chief queries by distinguishing `null` values (cached non-chiefs) from real cache misses.

### 3. 🪙 Daily Login XP Logic (`server/utils/dailyLoginXp.js`)
- **Award Structure:** Automatically awards **50 points** once per day when a fully onboarded user calls the `/api/auth/me` endpoint.
- **Tracking:** Generates a corresponding record in `XpLog` to prevent multiple awards within the same calendar day.

### 4. 🏷️ Badge RBAC Constraints (`server/src/controllers/badge.controller.js`)
- **Strict Role Enforcement:** Restricts the awarding and revocation of chief-pool badges strictly to `admin`, `superAdmin`, and `clan-chief` roles.
- **Anti-Tampering Rules:** Prevents clan chiefs from cross-clan badge awarding/revoking or self-badge assignment.

---

## III. Security Hardening & Input Sanitization

### 1. 🛡️ Express 5 Compatible NoSQL Sanitizer (`server/middleware/mongoSanitize.js`)
- **Core issue:** Express 5 employs read-only property getters on request objects (`req.query`, `req.params`), causing normal object sanitizers to silently fail.
- **The Solution:** Uses `Object.defineProperty` to lock down deep-cloned, sanitized properties.
- **Query Parser Setup:** Explicitly configures `app.set('query parser', 'extended')` in `server/app.js` to ensure nested query objects are uniformly parsed before sanitization.

### 2. 🔑 Firebase Google Authentication & Admin Boundary
- **Firebase Flow:** Uses Google authentication via ID token verification on the backend, automatically linking Google logins with existing local email accounts.
- **Admin Isolation:** Only `admin` and `superAdmin` accounts may access the Admin Panel (`admin-client` on port `3001`). Conversely, admins are restricted from logging in to the main participant client (`client` on port `3000`).

---

## IV. Client-Side Aesthetics & Architecture

### 🪐 Aesthetic Theme
- **Theme:** Google Developer Group (GDG) high-fidelity colors (Google Blue, Red, Yellow, Green) blended with a futuristic, developer-friendly **glassmorphism** design.

### 🔌 Real-Time Communications & WebSocket Failover
- **WebSocket URL Handling:** Dynamic URL resolution checks `VITE_API_BASE_URL` before falling back to `VITE_API_URL` to prevent CORS issues on production hosts (e.g., Vercel frontend targeting a Render backend).

---

## V. Documentation & Audit Directories

All structural insights, logs, and findings are stored and actively tracked across these specialized Markdown files under `/jules-docs/` and `.jules/`:
- `jules-docs/ARCHITECTURE_GRAPH.md`: Comprehensive backend and frontend component/route mapping.
- `jules-docs/CUSTOM_LOGIC_REGISTRY.md`: Plain-English registry of logic domains, locations, and edge cases.
- `jules-docs/SECURITY_LOG.md`: Security status tracker (e.g., SEC-001 through SEC-003).
- `jules-docs/TECH_DEBT_LOG.md`: Active tracking of technical debt (e.g., TD-001 through TD-004).
- `jules-docs/RUN_LOG.md`: Maintenance mode, bug fixes, and next run agendas.
- `.jules/sentinel.md`: Security-specific learnings, vulnerabilites, and logging.
- `.jules/bolt.md`: Lessons on MongoDB aggregation optimization and payload reduction.
