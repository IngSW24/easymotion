# Definition Of Done

# **General Requirements for Every Pull Request**

## **Code Completeness & Quality**

1. All requirements from the user story or task are fully implemented.
2. Code follows agreed-upon conventions and style guides (see [🎯 Coding Guidelines](./development-guidelines.md) )
3. All code is thoroughly reviewed and approved by at least one team member.
4. Commit messages are clear and follow our [📊 Git Branching and Commit Message Policy](./development-guidelines/git-branching-and-commit-message-policy.md).

## **Testing Requirements**

- Unit tests cover all new or modified code, with an aim for at least 80% coverage.
- Relevant components have integration or UI tests (e.g., _Jest for React_, integration tests for _Flutter_).
- All tests are passing, and no warnings or errors are present.
- Code has been manually tested to confirm it meets functionality requirements.

## **Documentation**

- Code comments are added where necessary for complex logic.
- API endpoints, data models, and other relevant back-end functionality are documented (e.g., _Swagger_/_Open-API_ for REST API documentation).
- The design of the architecture, components, classes, and modules adheres to the previously defined UML diagrams. Any modifications or extensions to the design are updated in the UML documentation.
- API endpoints, data models, and other relevant back-end functionality are documented, and where possible, UML schemas are included to enhance readability.
- README or other relevant documentation files are updated if new features or setup steps are required.
- Instructions on how to test and deploy changes are included if needed.

## **Security & Compliance**

- Code is free from known vulnerabilities, with dependencies checked (e.g., using _npm audit_ for front-end, or similar tools for back-end).
- Authentication and authorization are correctly implemented where required.
