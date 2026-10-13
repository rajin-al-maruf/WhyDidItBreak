# WhyDidItBreak — Master Project Context

## 1. Project overview
WhyDidItBreak is an AI-powered error monitoring and debugging SaaS for web applications. Developers register an application, install a lightweight JavaScript SDK, and receive grouped error reports. The system adds relevant GitHub source/commit information and deployment context, then uses an LLM to explain probable root causes and suggest fixes. A dashboard helps developers investigate issues and track error trends.

## 2. Why it matters
Debugging often involves searching logs, reconstructing stack traces, locating source code, reviewing commits, and correlating deployments. The MVP aims to collect this evidence in one place and make investigation faster. Its differentiator is **context-aware analysis**, not simply sending a raw error message to an LLM.

## 3. Stakeholders
- Developers (primary users)
- Development teams
- Project administrators/owners
- Platform administrators
- Academic supervisor and evaluators

## 4. Accepted stack
| Layer | Technology |
| --- | --- |
| Language | JavaScript |
| Frontend | React + Vite |
| Styling | Tailwind CSS |
| Backend | Node.js + Express |
| Database | MongoDB |
| ODM | Mongoose |
| Dashboard authentication | JWT (password hashing required) |
| APIs | REST |
| Monitoring | Custom JavaScript SDK |
| Repository context | GitHub REST API |
| AI | LLM API, provider/model to be chosen later |
| Analytics | Recharts |
| Tools | VS Code, Git, GitHub, Postman, Codex |
| Deployment target | Vercel frontend; Render or Railway backend (final choice TBD) |

**Constraints:** No TypeScript or Next.js for the initial capstone. Avoid premature infrastructure complexity. The ChatGPT/Codex subscription for development is separate from any usage-based LLM API costs for the product.

## 5. Scope: 12 accepted functionalities
### Module 1 — Application & Error Monitoring
1. User Authentication and Account Management
2. Project Management
3. Project API Key Management
4. Error Monitoring JavaScript SDK

### Module 2 — Error Investigation
5. Error Ingestion and Storage
6. Error Grouping and Fingerprinting
7. Error Details and Context
8. GitHub Repository Integration

### Module 3 — AI-Assisted Debugging & Developer Dashboard
9. Deployment and Release Context
10. AI-Based Root-Cause Analysis
11. AI-Generated Fix Suggestions
12. Developer Dashboard and Analytics

See `docs/REQUIREMENTS.md` for formal wording and quality requirements.

## 6. Conceptual architecture
```text
Developer's Web App
       |
       |  Custom JS SDK captures sanitized runtime errors
       v
WhyDidItBreak Express Ingestion API
       |  Authenticate project ingestion key, validate and limit payload
       v
MongoDB: error events + grouped issues
       |
       +--> Issue details / trends --> React dashboard (JWT-protected)
       |
       +--> Context builder <-- GitHub API (selected source/commits)
                  ^
                  |
             Release/deployment metadata
                  |
                  v
             LLM API (server-side)
                  |
                  v
       Probable cause + suggested fix --> Dashboard
```

Two separate applications must be distinguished: (A) the developer's app that installs the SDK, and (B) the WhyDidItBreak SaaS. The browser-facing SDK's project key is an ingestion identifier, **not a secret authorization token for private data**. Protect ingestion with rate limiting, payload limits and project-scoped validation. Keep private GitHub and LLM tokens only on the server.

## 7. Proposed repository structure
```text
WhyDidItBreak/
├── client/              # React dashboard
├── server/              # Express API
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── services/
│       ├── utils/
│       ├── app.js
│       └── server.js
├── sdk/                 # JavaScript monitoring SDK
├── docs/
│   ├── AI_CONTEXT.md
│   └── REQUIREMENTS.md
├── AGENTS.md
├── .gitignore
└── README.md
```
This is a **target structure**, not proof that all files already exist.

## 8. Data concepts (provisional, design before coding)
- **User:** identity, password hash, account metadata.
- **Project:** owner, name, settings, linked repository and deployment configuration.
- **Project key:** public ingestion identifier, rotation/revocation metadata as appropriate.
- **ErrorEvent:** project, message/type, sanitized stack, timestamp, URL, environment, release and limited device/browser context.
- **Issue:** project, fingerprint, title, first/last seen, occurrence count and status.
- **Analysis:** issue, evidence summary, AI probable cause, suggested fix, model/version, generated time.
- **Deployment:** project, release identifier, commit SHA and deployed time when available.
These are design candidates, not finalized Mongoose schemas.

## 9. Feature implementation order
**Phase 0 — Foundation:** Git, React/Vite/Tailwind, Express health route, MongoDB connection, environment configuration, docs.

**Module 1:** Authentication → Projects → SDK ingestion key → SDK capture → ingestion/storage → grouping.

**Module 2:** Issue detail page → GitHub repository connection and relevant file lookup → deployment/release correlation.

**Module 3:** AI context builder and root-cause analysis → fix suggestions → complete analytics dashboard.

Build simple navigation/dashboard shells when useful, but do not prioritize polished UI before the event pipeline works.

## 10. Working timeline (indicative, not a deadline)
- Weeks 1–2: foundation, auth, projects and ingestion credentials.
- Weeks 3–4: SDK, ingestion, storage and grouping.
- Weeks 5–6: issue views, filters and basic dashboard.
- Weeks 7–8: GitHub and deployment context.
- Week 9: LLM context pipeline, analysis and fix suggestions.
- Weeks 10–12: integration, security, tests, deployment, documentation and demo.
Adjust to course milestones and actual progress.

## 11. Current status — inspected 2026-10-08
- Backend: CommonJS Express application implemented with
  GET /api/health. Startup connects to MongoDB before listening.
- Backend scripts: npm start and npm run dev configured.
  Nodemon automatic restart verified by developer.
- Environment: dotenv loads server/.env with PORT and MONGODB_URI.
  No .env.example created yet.
- MongoDB Atlas: project and cluster created.
  Mongoose connection and API startup confirmed by developer.
- Backend automated tests: not implemented yet;
  test script remains a placeholder.

### Git foundation verification
From the project root, run `git rev-parse --show-toplevel` and `git symbolic-ref --short HEAD`; expect this repository path and `main`.
Use `git check-ignore --no-index -v -- server/.env client/node_modules/example/index.js client/dist/index.html` to inspect ignore matches without creating sample files.
Run `git check-ignore --no-index -- server/.env.example client/package-lock.json server/package-lock.json`; expect no output and exit code 1 because these paths remain eligible for tracking.
Review `git status --short --untracked-files=all`; source, docs and both lockfiles should be visible, while dependencies and generated files should be excluded. Files remain untracked until explicitly staged and committed.

**Important:** Codex must inspect the actual workspace and not assume that unconfirmed setup steps were completed.

## 12. Development workflow
1. Read `AGENTS.md` and this file.
2. Inspect existing code and identify the next smallest feature.
3. Plan/explain first; get approval for substantive changes.
4. Implement a small change, test it, and review the diff.
5. Update progress, document decisions and commit after developer approval.

## 13. Decisions already made
- Build the capstone MVP with MERN/JavaScript.
- Build a custom JavaScript SDK for browser/web-app error monitoring.
- Use GitHub integration and deployment context to improve LLM analysis.
- Limit capstone scope to the 12 functional requirements.
- Treat AI explanations as suggestions, not verified root causes.

## 14. Open decisions
- LLM provider/model and API budget.
- Exact GitHub connection/authentication mechanism and permissions.
- First supported deployment provider and how release metadata will be captured.
- Fingerprinting algorithm, retention period and rate limits.
- Detailed API contracts, database schema, and automated testing framework.

## 15. Out of scope for MVP / future work
Notifications (email/Slack/Discord), team collaboration, public status pages, automatic GitHub issue creation, AI-created pull requests, performance monitoring, additional SDK languages, and multiple deployment integrations.
