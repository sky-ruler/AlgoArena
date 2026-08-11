# Backend Team Constraints
- Node v22, Express.js, Mongoose.
- Uses Firebase Google token verification alongside a custom JWT/refresh-token session structure.
- Never modify the Keepalive `/ping` endpoint.
- Protect all admin operations with `AuditLog` hooks.
