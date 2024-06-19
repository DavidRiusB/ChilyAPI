## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# ChilyAPI: Branching and Workflow Guide

Welcome to the **ChilyAPI** repository! This guide outlines the best practices for using branches and workflows effectively in our project. Following these guidelines will help us maintain a clean and stable codebase.

## Branching Strategy

### Main Branch

The `main` branch represents our production-ready code. Changes merged into `main` should be thoroughly reviewed, tested, and approved.

- **Purpose**: Only stable and tested code should be merged into `main`.
- **Protection**: Branch protections are enabled to enforce code review and passing status checks before merging.

### Develop Branch

The `develop` branch serves as our integration branch where new features and bug fixes are tested together before being merged into `main`.

- **Purpose**: Integration of new features and bug fixes for testing.
- **Workflow**: Pull requests are created from feature branches into `develop`.
- **Testing**: Changes should be tested locally and pass CI checks before merging into `develop`.

## Feature Branches

For each new feature or issue, create a dedicated feature branch off `develop`.

- **Naming Convention**: Use descriptive names (`feature/feature-name`) to easily identify the purpose of the branch.
- **Scope**: Each branch should focus on a single feature or fix.
- **Collaboration**: Collaborate and review changes through pull requests.

### Example: Creating and Pushing a Feature Branch

Create a new feature branch and push it to the remote repository:

```bash
# Create a new branch locally
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Implemented new feature"

# Push the branch to remote repository
git push origin feature/new-feature
```

## Pull Requests

### Creating a Pull Request

1. **Base Branch**: Select `develop` as the base branch for feature branches.
2. **Description**: Provide a clear description of the changes and reference any related issues.
3. **Reviewers**: Assign appropriate team members as reviewers.
4. **CI Checks**: Ensure all status checks pass before merging.

### Example: Creating a Pull Request

Create a pull request to merge `feature/new-feature` into `develop`:

```bash
# Ensure you are on the feature branch
git checkout feature/new-feature

# Push changes to remote repository
git push origin feature/new-feature

# Open a pull request on GitHub's UI or via command line
gh pr create --base develop --head feature/new-feature --title "Feature: New Feature Implementation"
```

### Reviewing and Approving Pull Requests

- **Code Reviews**: Review code changes, provide feedback, and ensure adherence to coding standards.
- **Approvals**: At least one approving review is required before a pull request can be merged.

### Merging Pull Requests

- **Squash and Merge**: Prefer squash merging to keep commit history clean and meaningful.
- **Delete Branch**: Delete feature branches after merging to keep the repository tidy.

## Resolving Conflicts

If conflicts arise during a merge, resolve them promptly by collaborating with team members involved in the conflicting changes.

## Workflow Example
 feature/Scaffolding

1. **Start**: Create a feature branch (`feature/new-feature`) from `develop`.
2. **Develop**: Implement and test the new feature locally.
3. **Pull Request**: Create a pull request to merge `feature/new-feature` into `develop`.
4. **Review**: Receive feedback, address comments, and wait for approvals.
5. **Merge**: After approvals and passing CI checks, merge into `develop`.
6. **Testing**: Ensure changes in `develop` work as expected in a combined environment.
7. **Release**: When ready, merge `develop` into `main` for deployment.

=======

1. **Start**: Create a feature branch (`feature/new-feature`) from `develop`.
2. **Develop**: Implement and test the new feature locally.
3. **Pull Request**: Create a pull request to merge `feature/new-feature` into `develop`.
4. **Review**: Receive feedback, address comments, and wait for approvals.
5. **Merge**: After approvals and passing CI checks, merge into `develop`.
6. **Testing**: Ensure changes in `develop` work as expected in a combined environment.
7. **Release**: When ready, merge `develop` into `main` for deployment.

## Additional Resources

- **CI/CD Pipelines**: Check CI/CD workflows (`ci.yml`) for automated testing and deployment processes.
- **Branch Protections**: Understand branch protection rules set for `main` and `develop`.

## Feedback and Contributions

Your feedback and contributions to improving our branching strategy and workflows are highly appreciated. Feel free to suggest improvements or ask questions in our team discussions.

---

## Additional Resources

- **CI/CD Pipelines**: Check CI/CD workflows (`ci.yml`) for automated testing and deployment processes.
- **Branch Protections**: Understand branch protection rules set for `main` and `develop`.

feature/Scaffolding
## Feedback and Contributions

Your feedback and contributions to improving our branching strategy and workflows are highly appreciated. Feel free to suggest improvements or ask questions in our team discussions.
=======


