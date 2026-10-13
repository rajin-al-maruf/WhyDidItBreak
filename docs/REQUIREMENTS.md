# WhyDidItBreak — Requirements Specification (Capstone MVP)

## 1. Purpose
Define the agreed MVP scope for an AI-assisted web application error monitoring and debugging SaaS. Requirements are numbered for traceability. “Shall” denotes intended MVP behavior, subject to implementation and testing.

## 2. Functional requirements

### Module 1 — Application & Error Monitoring

**FR-01 — User Authentication and Account Management**  
The system shall allow developers to create accounts, securely log in and log out, and manage their account information through an authenticated user interface.

**FR-02 — Project Management**  
The system shall allow developers to create, configure, view, update, and delete projects representing the applications they want to monitor.

**FR-03 — Project API Key Management**  
The system shall generate a unique project ingestion key or identifier for each project, allowing the developer's application to identify its associated WhyDidItBreak project when submitting error events. The key shall not grant access to private dashboard data or repository credentials.

**FR-04 — Error Monitoring SDK**  
The system shall provide a JavaScript SDK that developers can integrate into their web applications to capture runtime errors, stack traces, timestamps, URLs, environments, and relevant browser information, subject to data-minimization and privacy controls.


### Module 2 — Error Investigation & Development Context

**FR-05 — Error Ingestion and Storage**  
The system shall receive error events from integrated applications through a validated, rate-limited API and store the collected error information for further processing and analysis.

**FR-06 — Error Grouping and Fingerprinting**  
The system shall identify and group recurring instances of the same underlying error so that multiple occurrences are represented as a single issue with an associated occurrence count.

**FR-07 — Error Details and Context**  
The system shall provide a detailed view of each identified issue, including its error message, stack trace, occurrence history, execution environment, browser information, affected URL, and available relevant context.

**FR-08 — GitHub Repository Integration**  
The system shall allow developers to connect an authorized GitHub repository to a project and retrieve relevant source code, commits, and changed files associated with reported errors, within the permissions granted.


### Module 3 — AI-Assisted Debugging & Developer Dashboard

**FR-09 — Deployment and Release Context**  
The system shall associate reported errors with available application releases or deployment identifiers and display relevant recent deployment information that may help explain when an error appeared.

**FR-10 — AI-Based Root-Cause Analysis**  
The system shall use an LLM to analyze reported errors, stack traces, relevant source code, GitHub changes, and deployment context, when available, and explain the most likely cause while indicating uncertainty and missing evidence.

**FR-11 — AI-Generated Fix Suggestions**  
The system shall provide AI-generated suggestions for resolving identified errors, including explanations and relevant code-change examples where appropriate. Suggestions shall require developer review and shall not be applied automatically.

**FR-12 — Developer Dashboard and Analytics**  
The system shall provide a centralized dashboard where developers can monitor application errors, view error statistics and trends, search and filter issues, and access AI-assisted debugging information.

## 3. Non-functional requirements

**NFR-01 — Security**  
The system shall hash passwords, use secure authentication, enforce project-level authorization, validate input, protect credentials and secrets, and apply appropriate protections against abuse of public ingestion endpoints.

**NFR-02 — Privacy**  
The system shall minimize collection of personal/sensitive data, redact secrets where feasible, restrict access to captured context, and avoid sending unnecessary data to third-party AI providers.

## 4. Suggested acceptance scenarios
1. A new developer signs up, logs in, and creates a project.
2. The project provides an SDK ingestion key; the developer configures a sample React app.
3. A test runtime error is captured and appears in the correct project.
4. Repeated instances of the same error increase an issue's occurrence count.
5. The developer views an issue's stack trace and occurrence history.
6. An authorized GitHub repository is linked and relevant commits/files are shown when retrievable.
7. Available release/commit metadata is associated with an issue.
8. The developer requests AI analysis and receives a probable explanation and a proposed fix.
9. The dashboard shows project-level error trends and supports search/filtering.
10. When the AI API is unavailable, existing issues and dashboard data remain usable.
11. A user cannot view or change another user's project or error records.
12. The SDK fails safely if the ingestion endpoint is unreachable.

## 5. Future development (excluded from capstone MVP)
- Notifications via email, Slack, or Discord.
- Team collaboration and fine-grained team roles.
- Public status pages.
- GitHub issue creation.
- AI-generated pull requests.
- Performance monitoring and tracing.
- SDKs for additional languages/platforms.
- Multiple deployment-provider integrations.

## 6. Scope notes
- A root-cause analysis is an evidence-based suggestion, not a guaranteed diagnosis.
- GitHub and deployment context depend on permissions and the metadata available.
- SDK ingestion credentials used in a browser are public identifiers and must not authorize private reads.
- Exact performance targets, event-retention policy, model choice, and deployment integration will be finalized during design.
