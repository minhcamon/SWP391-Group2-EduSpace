# EduSpace system-test workflows

## Workflows supported by the current implementation

1. **User onboarding and authentication**: register, log in, and retrieve the authenticated profile.
2. **Course creation and approval**: a Creator creates a pending course, an Admin sees and approves it, and the course becomes publicly available.
3. **Creator account upgrade**: a Learner submits an upgrade request, an Admin approves it, and the Learner receives the Creator role.

Each implemented workflow has its own test file:

- `AuthenticationSystemTest.java`
- `CourseApprovalSystemTest.java`
- `CreatorUpgradeSystemTest.java`

Shared HTTP, database setup, and test-data helpers are in `SystemTestSupport.java`. Login UI behavior and the Google OAuth redirect remain in `LoginSystemTest.java`.

## Proposed workflows that are not implemented yet

The following should remain in the product roadmap and must not be represented as passing system tests yet:

- Course enrollment and learning progress
- Automatic class and study-group assignment
- Group chat, assignment submission, grading, and learning interaction

The repository contains some domain entities for these ideas, but it does not yet expose the controllers, services, repositories, or complete frontend routes needed for an end-to-end workflow.

## Run against Docker

From the project root:

```powershell
docker compose up -d --build
cd backend
.\mvnw.cmd "-Dtest=*SystemTest" "-Dsystem.test.base-url=http://localhost" test
.\mvnw.cmd "-Dtest=*AuthenticationSystemTest" "-Dsystem.test.base-url=http://localhost" test

.\mvnw.cmd "-Dtest=AuthenticationSystemTest" "-Dsystem.test.base-url=http://localhost" "-Dheadless=true" test
```

Default system-test endpoints are backend `http://localhost:8080/api` and MySQL `localhost:3306/swp`. They can be overridden with `SYSTEM_TEST_API_URL`, `SYSTEM_TEST_DB_URL`, `SYSTEM_TEST_DB_USERNAME`, and `SYSTEM_TEST_DB_PASSWORD`.
