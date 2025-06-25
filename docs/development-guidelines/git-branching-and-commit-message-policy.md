# 📊 Git Branching and Commit Message Policy

This document establishes the **Git usage guidelines** for our team, ensuring clarity, organization, and consistency throughout development. These rules are based on best practices for branching, commit structuring, and workflow management.

## Branching Policy 🔄

There are **three primary branches** that are always active:

- **main**: Aligned with the production version.
- **staging**: Aligned with the staging version (when introduced).
- **develop**: Aligned with the development version, receiving pull requests from feature branches.

All **other branches** are feature-specific and must be **deleted** after the feature is completed and merged. GitHub allows for branch restoration in case the PR is reopened.

#### Branch Naming Convention

Branches must follow the syntax:

```
<type>/<issue-name>[/additional-keyword]
```

Where:

- **type**: Describes the purpose of the branch.
- **issue-name**: Matches the **JIRA issue code**.
- **additional keyword** (optional): Allows further specification (see example below).

**Valid branch types:**

- **feat**: For new features.
- **fix**: For bug fixes.
- **ci**: For pipeline and CI/CD configurations
- **hotfix**: For urgent production fixes.
- **docs**: For documentation changes
- **style**: For code formatting or style changes.
- **refactor**: Code restructuring without changing functionality.
- **chore**: For repository maintenance (e.g., dependency upgrades).
- **build**: For build process changes.
- **perf**: For performance optimizations.
- **test**: For test-specific changes.

**Examples:**

```
feat/EAS-123
fix/EAS-456
feat/EAS-123/part-1
test/EAS-333/generate-mock
```

#### Branch Workflow

- Developers can **split work** into multiple branches if needed.
- Developers **working on the same files** (even if they are developing different features) can easily work on the same branch to minimize conflicts
- Commits can be added to a **PR after it is opened**, enabling collaborative work.
- Developers should regularly **rebase** or **merge** `develop` (or other branches) into their current feature branch to avoid merge conflicts.

**PR Merging:**

- When a feature is complete, developers must **request a review**.
- After review and approval, the PR should be **squash-merged** into the `develop` branch unless there is a specific need to retain all commits.
- The **squash commit message** must follow the commit message guidelines below, as it will become the final commit in the `develop` branch.

## How to Structure Commit Messages 📏

We follow the **Conventional Commits** format to ensure clarity, consistency, and compatibility with tools.

**Commit message format:**

```
<type>[optional scope]: <description>

[optional body]
```

#### Rules:

1. **type**: Similarly to the branch types, indicates the purpose of the commit:
  - **feat**: For new features.
  - **fix**: For bug fixes.
  - **ci**: For pipeline and CI/CD configurations
  - **hotfix**: For urgent production fixes.
  - **docs**: For documentation changes
  - **style**: For code formatting or style changes.
  - **refactor**: Code restructuring without changing functionality.
  - **chore**: For repository maintenance (e.g., dependency upgrades).
  - **build**: For build process changes.
  - **perf**: For performance optimizations.
  - **test**: For test-specific changes.
2. **scope**: Optional. Specifies the affected area (e.g., `webapp`, `api`).
3. **description**: Must start with **one or more JIRA issue codes** and provide a brief, descriptive message.
4. **body** (optional): Used for detailed explanations if necessary.

**Examples:**

- Without scope:
```
feat: EAS-123 added dark mode feature
```
- With scope:
```
feat(webapp): EAS-123 added dark mode feature
```

- With scope and referencing multiple issues:
```
feat(api): EAS-234 EAS-564 added dark mode feature with layout
```

**Important Notes:**

- Commits **on feature branches** do not need to strictly follow this convention since they will be squashed.
- Any commit that lands on the `develop` branch (e.g., Pull request titles) **must follow this format**.

### ❓ What do I do if my commit introduces tests, fixes, docs, features, etc., all together?

If your commit includes multiple types of changes (e.g., tests, fixes, and new features), you should use the **most important type** depending on the overall goal of your work.

For example:

- If you fixed a few things to **add a feature**, the type should be `feat` rather than `fix`.
- If you introduced tests together with a new feature, the type should still be `feat`.
- If you only introduced tests, the type can be `test`

It is also **important to keep commits and PRs focused** on their related work. If you notice something that needs fixing but it does not impact the current feature you are developing, **continue working on the feature** and perform the fix in a **separate branch** later, opening a different PR.

This approach ensures:

1. A clean and focused commit history.
2. Easier code reviews.
3. Better separation of concerns.

## Workflow Example 📐

**Scenario:**

- Nicola is assigned to implement **EAS-123** for the webapp.
- Giovanni is assigned to implement **EAS-456** for the API.

#### Workflow Steps:

1. **Branch Creation**:
  - Nicola creates a branch: `feat/EAS-123`.
  - Giovanni creates a branch: `feat/EAS-456`.
2. **Development**:
  - Nicola works on his branch and produces the following commits (*notice they don't follow the formatting guidelines since they are feature-branch-specific commits*):
    - `changing menu layout`
    - `adding dark mode`
    - `unit testing dark mode switch`
3. **PR Submission**:
  - Nicola opens a **PR to** `develop`
    - PR title: `feat(webapp): EAS-123 added dark mode feature`
  - The PR is reviewed, approved, and **squash-merged**.
4. **Syncing Work**:
  - Giovanni requires Nicola's changes.
  - Giovanni runs:
```
git merge develop
```
or
```
git rebase develop
```
  - Giovanni's branch is now up to date.
5. **Second PR**:
  - Giovanni completes his work and opens a PR:
    - PR title: `feat(api): EAS-456 added API endpoint`
  - The PR is reviewed, approved, and **squash-merged**.
  - The issue **EAS-456** can be marked as DONE on JIRA.
6. **Testing and Fixes**:
  - Nicola's issue on JIRA hasn't been marked as DONE yet because he needs to add some tests
  - Nicola creates a new branch for unit tests: test/EAS-123.
  - Nicola produces commits:
    - `unit test dark mode switch`
    - `unit test layout shifter`
  - Nicola opens a PR:
    - PR title: `test(webapp): EAS-123 added unit tests`
  - The PR is reviewed, approved, and **squash-merged**.
  - The issue **EAS-123** can be marked as DONE on JIRA.
7. **And so on**:
  - Matteo can now start working on another ticket by checking out from develop with the updated code
  - ...

By following this **Git Usage Policy**, the team ensures:

1. A structured and clean branching model.
2. Consistent and clear commit history.
3. Efficient collaboration and minimal merge conflicts.
4. The ability to work independently of JIRA automations while still maintaining visibility of related commits and branches directly from JIRA issues

