# JangaRoo Codebase Guide

**Project**: JangaRoo (Initialization Phase)
**Status**: Early-stage project - only LICENSE present, awaiting project definition
**Current Branch**: `claude/claude-md-docs-8ep5ke`
**License**: Apache 2.0

---

## Project Overview

JangaRoo is currently in the initialization phase. This document serves as a framework for future development and establishes baseline conventions for the project as it grows.

**What we know**:
- Licensed under Apache 2.0 (permissive open-source)
- Repository created: May 23, 2026
- Original author: AmResthtx (ellishuntersmith@gmail.com)

**What needs to be defined**:
- Project purpose and scope
- Technology stack
- Architecture and directory structure
- Development team and workflows

---

## Baseline Development Conventions

Use these conventions as the project develops. Treat them as the default unless project-specific requirements override them.

### Git Workflow

**Branch Naming**:
```
main                          - Production/release branch
develop                       - Integration branch
feature/<feature-name>        - New features
fix/<bug-description>         - Bug fixes
docs/<documentation-topic>    - Documentation
refactor/<scope>              - Code refactoring
security/<issue-description>  - Security fixes
test/<test-scope>             - Tests and test infrastructure
```

**Commit Message Format** (Conventional Commits):
```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring without feature changes
- `perf`: Performance improvements
- `test`: Test additions or changes
- `chore`: Build process, dependencies, tooling
- `ci`: CI/CD configuration changes
- `security`: Security fixes or hardening

Example:
```
feat(auth): add two-factor authentication

Implement 2FA via TOTP for user accounts.
Adds QR code generation and verification endpoints.

Closes #42
```

### Code Style & Formatting

**General Principles**:
- Use consistent indentation (2 spaces preferred, or configure per project)
- Use language-appropriate linting tools (ESLint for JS, Pylint for Python, rustfmt for Rust, etc.)
- Add meaningful variable and function names - self-documenting code is preferred over comments
- Keep functions focused and small
- Follow DRY (Don't Repeat Yourself) principle

**Comments**:
- Only comment WHY, not WHAT (code should show what it does)
- Avoid obvious comments
- Keep comments up-to-date with code changes
- Use TODO/FIXME comments sparingly, linking to issues when possible

**Imports/Dependencies**:
- Keep imports organized (stdlib, third-party, local)
- Remove unused imports before committing
- Pin dependency versions appropriately

### Documentation

**Required Documents**:
- `README.md` - Project overview, installation, quick start
- `CLAUDE.md` - This file (updated as project evolves)
- `CONTRIBUTING.md` - Contribution guidelines (when accepting external contributors)

**Optional Documents**:
- `ARCHITECTURE.md` - System design and component interaction
- `SECURITY.md` - Security policy and reporting process
- `CHANGELOG.md` - Release notes and version history
- `.github/ISSUE_TEMPLATE/` - Issue templates for consistency

**Code Comments**:
- Prefer self-documenting code over inline comments
- Document public APIs with docstrings
- Keep examples up-to-date

### Testing

**Baseline Expectations**:
- Create tests alongside features (test-driven development preferred)
- Maintain >80% code coverage for critical paths
- Run tests before committing
- Include integration tests for external dependencies
- Document how to run test suite in README

**Test Organization**:
```
tests/
├── unit/           - Single unit tests
├── integration/    - Multi-component tests
├── fixtures/       - Test data and mocks
└── README.md       - Test documentation
```

### Pull Requests

**Before Creating a PR**:
- [ ] Code follows project conventions
- [ ] Tests pass locally
- [ ] New features have test coverage
- [ ] Documentation updated
- [ ] No merge conflicts
- [ ] Commit history is clean

**PR Title Format**:
`<type>: <description>` (e.g., `feat: add user registration`, `fix: resolve memory leak`)

**PR Description**:
```markdown
## What
Brief description of changes

## Why
Motivation for this change

## How
Technical approach taken

## Testing
How to verify this works

## Closes
#<issue-number>
```

### Environment Management

**Configuration Files**:
- `.env.example` - Template for environment variables (committed)
- `.env` - Actual environment variables (never committed - add to .gitignore)
- `config/` - Configuration files for different environments

**Secrets Management**:
- Never commit `.env` files with real credentials
- Use environment variables or secrets management service
- Document all required environment variables in `.env.example`
- Rotate credentials if accidentally exposed

### Dependencies & Versioning

**Best Practices**:
- Use semantic versioning (MAJOR.MINOR.PATCH)
- Lock dependency versions in production
- Document minimum required versions (Node 18+, Python 3.9+, etc.)
- Regularly audit dependencies for security issues
- Keep dependencies updated

**Package Management**:
- JavaScript: `package.json` with npm/yarn/pnpm
- Python: `requirements.txt` or `pyproject.toml`
- Rust: `Cargo.toml`
- Go: `go.mod`
- etc. (use the ecosystem standard)

---

## Project Setup Checklist

When project scope is defined, complete this checklist:

- [ ] **Technology Stack Defined**
  - [ ] Primary language(s)
  - [ ] Key frameworks/libraries
  - [ ] Database/storage system
  - [ ] Deployment target

- [ ] **Initial Structure Created**
  - [ ] `README.md` with project overview
  - [ ] `package.json` (or language equivalent) with dependencies
  - [ ] `CONTRIBUTING.md` with guidelines
  - [ ] `.gitignore` with language-appropriate entries
  - [ ] `src/` (or equivalent) directory structure

- [ ] **Development Environment**
  - [ ] Local development documented
  - [ ] Build process documented
  - [ ] Test framework configured
  - [ ] Linting/formatting tools configured

- [ ] **CI/CD Pipeline**
  - [ ] GitHub Actions workflows (or alternative)
  - [ ] Test automation
  - [ ] Linting automation
  - [ ] Build automation
  - [ ] Security scanning

- [ ] **Documentation**
  - [ ] Architecture documentation (if complex)
  - [ ] API documentation (if applicable)
  - [ ] Development setup guide
  - [ ] Deployment guide

---

## Essential Files to Create

### `.gitignore`
```
# Dependencies
node_modules/
venv/
__pycache__/
*.egg-info/
target/

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Build
dist/
build/
.tsc-out/

# Logs
logs/
*.log
npm-debug.log*

# OS
.DS_Store
Thumbs.db
```

### `README.md` Template
```markdown
# JangaRoo

[Brief project description]

## Features
- Feature 1
- Feature 2

## Installation
[Setup instructions]

## Usage
[Usage examples]

## Development
[How to set up dev environment]

## Testing
[How to run tests]

## Contributing
See CONTRIBUTING.md

## License
Apache 2.0
```

### `CONTRIBUTING.md` Template
```markdown
# Contributing to JangaRoo

## Getting Started
1. Fork the repository
2. Clone your fork
3. Create a feature branch
4. Make changes and commit
5. Push to your fork
6. Open a Pull Request

## Guidelines
- Follow our [code style conventions](#code-style--formatting)
- Write tests for new features
- Update documentation
- Use conventional commit messages

## Pull Request Process
1. Update README.md with any new features
2. Ensure tests pass
3. Request review from maintainers
4. Address feedback
5. Squash commits if requested
```

---

## Current State

**Files Present**:
- `LICENSE` (Apache 2.0)

**Files Needed**:
- `README.md` - Project overview
- `.gitignore` - Git ignore rules
- Source code structure (TBD based on project type)
- `package.json` or equivalent (language-dependent)

---

## Common Development Patterns to Follow

### Error Handling
- Use descriptive error messages
- Include context in error logs
- Distinguish between expected and unexpected errors
- Return meaningful HTTP status codes (if applicable)

### Logging
- Use a logging framework (winston, pino, logging module, etc.)
- Avoid console.log in production code
- Include request IDs for tracing
- Log at appropriate levels (debug, info, warn, error)

### Security Best Practices
- Validate all user input
- Use parameterized queries for databases (prevent SQL injection)
- Implement rate limiting for APIs
- Use HTTPS/TLS for all communications
- Keep dependencies updated for security patches
- Add SECURITY.md with responsible disclosure process

### Performance Considerations
- Profile code to identify bottlenecks
- Cache appropriately (avoid cache invalidation issues)
- Use pagination for large data sets
- Implement request timeouts
- Monitor memory and CPU usage

---

## Transition from Initialization Phase

Once the project type and scope are defined:

1. **Update this CLAUDE.md** with specific technology details
2. **Create `.github/` workflows** for CI/CD
3. **Add project-specific conventions** to this document
4. **Update README.md** with accurate project description
5. **Establish team communication** norms (meetings, PR review SLA, etc.)

---

## Questions to Answer When Starting

When this project moves beyond initialization, answer these to customize the guidelines:

1. **What is the primary purpose?** (Web app, CLI tool, library, etc.)
2. **What languages/frameworks?** (Use appropriate tooling and patterns)
3. **What's the deployment model?** (SaaS, self-hosted, package distribution, etc.)
4. **Who are the maintainers?** (Establish review process)
5. **Is there external contribution?** (Community or internal only?)
6. **What's the scale?** (Side project, startup, enterprise?)
7. **Performance requirements?** (Real-time, batch, resource-constrained?)
8. **Security requirements?** (Public data, user data, compliance needs?)

---

## Resources for Team Members

- **Git**: https://git-scm.com/book/en/v2
- **Conventional Commits**: https://www.conventionalcommits.org/
- **Keep a Changelog**: https://keepachangelog.com/
- **Semantic Versioning**: https://semver.org/

---

## Document Maintenance

This CLAUDE.md should be updated when:
- Technology stack changes
- New development tools are adopted
- Conventions are refined based on experience
- New team members ask clarifying questions
- Project structure significantly changes

Assign a reviewer for CLAUDE.md changes to ensure conventions stay current and clear.
