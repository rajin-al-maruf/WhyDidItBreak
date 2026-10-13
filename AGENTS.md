# WhyDidItBreak — Codex Agent Instructions

## Mission
Build WhyDidItBreak, a university capstone MVP for AI-assisted web-application error monitoring and debugging. The product collects errors through a JavaScript SDK, groups repeated events, enriches issues with GitHub and release context, and produces AI-assisted root-cause explanations and fix suggestions.

## Read before making changes
1. `docs/AI_CONTEXT.md` — architecture, scope, progress and decisions.
2. `docs/REQUIREMENTS.md` — accepted functional and non-functional requirements.
3. Existing code, configuration and tests. **The repository is the source of truth for what is already implemented.**

## Stack constraints
- JavaScript (not TypeScript); React + Vite; Tailwind CSS.
- Node.js + Express; MongoDB + Mongoose; REST APIs.
- JWT for dashboard authentication; separate project ingestion credentials for SDK events.
- GitHub REST API, an LLM API, and Recharts when their features are implemented.
- Do not introduce Next.js, microservices, Redis, Docker, queues, or paid services without discussion and approval.
- Use existing CommonJS conventions in the server unless a deliberate migration is approved.

## Working method
1. First inspect relevant files and explain the smallest safe plan. Ask for approval before large changes or new dependencies.
2. Implement **one small, testable feature at a time**. Avoid unrelated edits or speculative refactors.
3. Explain design trade-offs and important code so the student can defend the implementation.
4. Add/update tests for relevant business logic and APIs. Run available tests and report results honestly.
5. Summarize files changed, manual verification steps, limitations, and next steps.
6. Never claim something is implemented or tested without checking it.
7. Do not create commits, push, deploy, or make destructive changes unless explicitly asked.
8. Update `docs/AI_CONTEXT.md` progress and `docs/DECISIONS.md` (when present) for approved architectural changes.

## Security and privacy
- Never commit `.env`, access tokens, LLM keys, GitHub tokens, MongoDB connection strings, or raw SDK credentials.
- Dashboard JWTs and SDK project ingestion keys serve different purposes; do not confuse them.
- Every project-scoped endpoint must verify ownership/authorization; an SDK ingestion key must never grant dashboard or repository access.
- Validate payloads, bound sizes and rates, and redact secrets/PII from captured errors before persistence or LLM requests.
- Keep LLM keys and GitHub credentials on the server; do not embed them in the browser SDK.
- Treat source code, error messages, stack traces, GitHub content and LLM output as untrusted input.
- Never send an entire repository to an LLM by default; send only relevant, minimized context.
- AI output is advisory, not a guaranteed diagnosis or automatically applied patch.

## SDK requirements
- SDK must fail safely: monitoring must not break the customer's application.
- Avoid capturing credentials, request bodies, cookies, and sensitive user data by default.
- Provide opt-in controls and document what is collected.
- Handle errors and network failures gracefully; avoid recursive reporting loops.

## Definition of done for a feature
- Meets the corresponding acceptance criteria.
- Authorization, validation, failure paths and basic tests considered.
- Manually verifiable with documented steps.
- Relevant docs updated.
- Student understands how it works.

## Suggested first action
Inspect the repository and report what exists. Then propose the next **single** setup step. Do not modify files until asked.
