# Contributing to Centsible

First off — thank you for taking the time to contribute! 🎉

Whether you're fixing a bug, improving the UI, adding a feature, or improving the docs — all contributions are welcome.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Getting Started](#getting-started)
- [Branch Naming](#branch-naming)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

---

## 🤝 Code of Conduct

Be kind, be respectful, be constructive. We're all here to build something great together.

---

## 💡 How Can I Contribute?

### 🐛 Bug Fixes
Found something broken? Open an issue first to describe the bug, then submit a PR with the fix.

### ✨ New Features
Have an idea? Open a **Feature Request** issue first and describe what you'd like to see. This avoids duplicate work and lets us discuss the best approach before you spend time coding.

### 🎨 UI/UX Improvements
Design tweaks, better responsiveness, accessibility improvements — all welcome. Include screenshots or a short recording if you can.

### 📝 Documentation
Spotted something unclear in the README or setup guide? Fix it! Docs contributions are just as valuable as code.

---

## 🚀 Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/ItsUgesh/centsible.git
   cd centsible
   ```
3. Set up the project following the [README](./README.md#getting-started)
4. Create a new branch for your work (see [Branch Naming](#branch-naming))
5. Make your changes
6. Test thoroughly
7. Submit a Pull Request

---

## 🌿 Branch Naming

Use a descriptive branch name that reflects the work:

```
feat/add-budget-goals
fix/transaction-month-filter
ui/improve-mobile-nav
docs/update-setup-guide
```

---

## 💬 Commit Messages

Follow this format for commit messages:

```
type: short description

- bullet point for what changed
- another bullet point
```

**Types:**
| Type | When to use |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `ui` | Visual/style change |
| `refactor` | Code restructure, no behaviour change |
| `docs` | Documentation only |
| `security` | Security improvement |
| `chore` | Tooling, config, dependencies |

**Example:**
```
feat: add budget goals with progress tracking

- Add BudgetGoal model to Prisma schema
- Add GET/POST /api/budget-goals endpoints
- Add budget goals card to Dashboard
- Show progress bar per category
```

---

## 🔁 Pull Request Process

1. Make sure your branch is up to date with `main`
2. Write a clear PR title and description — explain **what** and **why**
3. Include screenshots for any UI changes
4. Make sure the backend still starts without errors
5. Make sure the frontend compiles without errors
6. A maintainer will review and merge or request changes

---

## 🐛 Reporting Bugs

Open a [GitHub Issue](https://github.com/ItsUgesh/centsible/issues/new) and include:

- **What you expected** to happen
- **What actually happened**
- **Steps to reproduce**
- Browser / OS / Node version
- Screenshots if relevant

---

## 💭 Suggesting Features

Open a [GitHub Issue](https://github.com/ItsUgesh/centsible/issues/new) with the label `enhancement` and describe:

- **The problem** you're trying to solve
- **Your proposed solution**
- Any alternatives you considered

---

## 🙏 Thank You

Every contribution — big or small — makes Centsible better. We appreciate your time and effort.

**Author:** [Ugesh Simkhada](https://www.ugeshsimkhada.com.np/)
