# Technical Debt Log

## Completed Tasks
| ID | Priority | Layer | Component / Route | Description of Debt | Status | Resolved Date |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TD-001** | P0 | General | `Entire Codebase` | Initial codebase scan required to identify debt, syntax errors, and test suite health | Resolved | August 5, 2026 |
| **TD-002** | P1 | Backend | `server/middleware/mongoSanitize.js` | Express 5 uses read-only property getters on request objects (`req.query`, `req.params`). Standard in-place modifications on these objects fail silently. Refactored `mongoSanitize.js` using `Object.defineProperty` with `writable: true` and `configurable: true` on deep-cloned sanitized query/params to allow clean Express 5 middleware execution and downstream property reassignment without errors. | Resolved | August 9, 2026 |
| **TD-003** | P2 | Cache | `server/src/services/clanScope.service.js` | Clan chief lookups use a simple local in-memory cache variable (`chiefClanCache`). Refactored to use an asynchronous, extensible `ChiefClanCacheProvider` with native support for negative caching, making it Redis-ready and preventing NoSQL stampedes. | Resolved | August 6, 2026 |

## Open Technical Debt Backlog
| ID | Priority | Layer | Component / Route | Description of Debt | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TD-004** | P2 | Backend | `server/src/controllers/` | Inconsistent patterns for direct manual collection queries vs. abstract service wrapper usage. Standardizing on a repository or dedicated service layer would improve maintainability. | Open |
