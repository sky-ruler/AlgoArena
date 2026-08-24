# Technical Debt Log

## Completed Tasks
| ID | Priority | Layer | Component / Route | Description of Debt | Status | Resolved Date |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TD-001** | P0 | General | `Entire Codebase` | Initial codebase scan required to identify debt, syntax errors, and test suite health | Resolved | August 5, 2026 |
| **TD-002** | P1 | Backend | `server/middleware/mongoSanitize.js` | Express 5 uses read-only property getters on request objects (`req.query`, `req.params`). Attempted standard property reassignment, but verified that direct assignments fail silently in non-strict mode (leaving parameters un-sanitized). Therefore, overriding the prototype getters on the instance using `Object.defineProperty` is retained as a necessary, robust, and permanent architectural design. | Closed (Retained Robust Design) | August 9, 2026 |
| **TD-003** | P2 | Cache | `server/src/services/clanScope.service.js` | Clan chief lookups use a simple local in-memory cache variable (`chiefClanCache`). Refactored to use an asynchronous, extensible `ChiefClanCacheProvider` with native support for negative caching, making it Redis-ready and preventing NoSQL stampedes. | Resolved | August 6, 2026 |
| **TD-004** | P2 | Backend | `server/src/controllers/` | Inconsistent patterns for direct manual collection queries. Standardized user username lookups to utilize Mongoose schema B-Tree index via exact lowercased query `{ username: username.toLowerCase() }` instead of dynamic un-indexed regex. | Resolved | August 10, 2026 |

## Open Technical Debt Backlog
| ID | Priority | Layer | Component / Route | Description of Debt | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
