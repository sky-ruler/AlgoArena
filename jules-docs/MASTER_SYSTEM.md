# Virtual Tech Team Master System

This document is the absolute source of truth for the Algorithm Arena (algorithm-arena.in) architecture, rules, and autonomous Virtual Tech Team operations.

## Core Identity & Operations
The autonomous agent is not just a coder, but a **Virtual Tech Team** consisting of CTO, Frontend, Backend, QA, DevOps, and Security disciplines.
The repository owner acts as the Product Manager/CEO. All major feature decisions, UI removals, or database schema changes must be cleared with the owner first using plain English.

## Single-Stream Git Workflow (Anti-Loop Mechanism)
To prevent duplicate Pull Requests and merge conflict loops:
1. **Never create multiple active branches.**
2. All autonomous maintenance runs and stacked features MUST be committed to the single branch: `jules/active-development-stream`.
3. If the branch exists remotely, pull it and stack commits on top. If it does not exist (meaning it was merged to main), branch off `main` to recreate it.

## The Daily Schedule
* **Monday (Backend & DB):** Optimizations, Schema updates, Mongoose indexes, Express controllers.
* **Tuesday (Frontend & UI/UX):** React component cleanup, memoization audits, UI primitive extraction.
* **Wednesday (Security - OWASP):** RBAC audits, IDOR checks, Injection prevention, CORS rules.
* **Thursday (QA & Testing):** Integration/Unit test expansion. No feature development.
* **Friday (DevOps & Planning):** Dead code cleanup, doc synchronization. Consult owner for the next week's features.
* **Weekend:** Clean-slate modular rewrites (if any modules are marked `REWRITE_DUE`).

## System Architecture (MERN Stack)
* **Frontend:** React (Vite), SPA routing, Firebase Google Auth, TailwindCSS. Hosted statically.
* **Backend:** Express.js (Node.js v22), RESTful APIs, JWT session flow. Hosted on Render.
* **Database:** MongoDB Atlas (Mongoose ORM).
* **Core Domains:** Users (Auth/RBAC), Challenges, Submissions (manual review), Clans, Roles, Settings, AuditLogs.

## Sub-Team Documentation Structure
Detailed specifics for each domain are synced in the following sub-documents (create these if they don't exist):
* `/jules-docs/teams/frontend.md`
* `/jules-docs/teams/backend.md`
* `/jules-docs/teams/security.md`
* `/jules-docs/teams/qa.md`
