# Security Audit Log

## Completed Security Hardening Tasks
| Finding ID | Severity | Category | Location | Description | Status | Resolution / Action Taken |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **SEC-001** | Info | System | `Audit Required` | Awaiting initial security baseline scan | Completed | Conducted extensive security scan. Checked JWT signing keys, CORS options, and Cookie properties. |
| **SEC-002** | High | Input Sanitization | `server/middleware/mongoSanitize.js` | Express 5 parses query and params dynamically using native getter properties. This caused standard in-place sanitization middlewares to mutate a temporary object, leaving the query keys un-sanitized for controllers and validators, causing NoSQL injection vulnerability on nested parameters. | Patched | Rewrote `mongoSanitize` middleware to use `Object.defineProperty` on Express 5's request object `query` and `params` getters, locking down sanitized, deep-cloned request attributes. Added explicit `app.set('query parser', 'extended')` in `app.js` to enforce consistent object-based query parsing across testing environments. Assessed simpler assignments but retained `Object.defineProperty` as a strict requirement to prevent silent failure on read-only prototype getters in Express 5. |
| **SEC-004** | Medium | Rate Limiting | `server/app.js` | Critical authentication and session renewal endpoints (`/api/auth/refresh`, `/api/auth/confirm-session`) lacked explicit stricter rate-limiting middleware, exposing them to automated brute-force / session enumeration attacks. | Patched | Extended `authLimiter` middleware in `server/app.js` across `/api/auth/refresh` and `/api/auth/confirm-session` routes. |

## Pending / Open Security Review
| Finding ID | Severity | Category | Location | Description | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **SEC-003** | Low | CORS Config | `server/app.js` | Origin whitelist relies on `env.CORS_ORIGINS`. Ensure this environment variable excludes wildcards (`*`) or trailing slash variants in production configs to avoid origin spoofing. | Monitoring |
