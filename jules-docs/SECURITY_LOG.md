# Security Audit Log

## Completed Security Hardening Tasks
| Finding ID | Severity | Category | Location | Description | Status | Resolution / Action Taken |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **SEC-001** | Info | System | `Audit Required` | Awaiting initial security baseline scan | Completed | Conducted extensive security scan. Checked JWT signing keys, CORS options, and Cookie properties. |
| **SEC-002** | High | Input Sanitization | `server/middleware/mongoSanitize.js` | Express 5 parses query and params dynamically using native getter properties. This caused standard in-place sanitization middlewares to mutate a temporary object, leaving the query keys un-sanitized for controllers and validators, causing NoSQL injection vulnerability on nested parameters. | Patched | Rewrote `mongoSanitize` middleware to use `Object.defineProperty` on Express 5's request object `query` and `params` getters, locking down sanitized, deep-cloned request attributes. Enhanced sanitization to recursively strip keys starting with `$` or `.` and prototype pollution keys (`__proto__`, `constructor`), and configured `writable: true, configurable: true` so downstream middlewares can safely operate on sanitized query parameters. |

## Pending / Open Security Review
| Finding ID | Severity | Category | Location | Description | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **SEC-003** | Low | CORS Config | `server/app.js` | Origin whitelist relies on `env.CORS_ORIGINS`. Ensure this environment variable excludes wildcards (`*`) or trailing slash variants in production configs to avoid origin spoofs. | Monitoring |
