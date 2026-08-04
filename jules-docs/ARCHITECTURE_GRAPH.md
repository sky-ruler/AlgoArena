# Architecture Graph

## 1. Frontend Component Graph
| Route / Page | Components Rendered | Shared / Unique | State Source | API Endpoints Called |
| :--- | :--- | :--- | :--- | :--- |
| `To be populated by Jules` | | | | |

## 2. Backend Route & Logic Graph
| Endpoint | Method | Middleware Chain | Controller / Service | DB Models Touched |
| :--- | :--- | :--- | :--- | :--- |
| `To be populated by Jules` | | | | |

## 3. Database Schema Graph (MongoDB / Mongoose)
| Collection | Key Fields | Indexes | Unbounded Growth Risk | Missing Validations |
| :--- | :--- | :--- | :--- | :--- |
| `To be populated by Jules` | | | | |

## 4. Full-Stack Sync Points
| Data Variable | Frontend Location | Backend Validation | Database Constraint | In Sync? |
| :--- | :--- | :--- | :--- | :--- |
| `To be populated by Jules` | | | | |

```mermaid
graph TD
    A[React Client] -->|API Request| B[Express Router]
    B -->|Auth Check| C[JWT Middleware]
    C -->|Controller| D[Mongoose Model]
    D -->|Query| E[(MongoDB)]