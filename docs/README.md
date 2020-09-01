# Approveman

[![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/tianhaoz95/approveman)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/28428cd8486b4ac998d7a2a83fe0c3ff)](https://www.codacy.com/manual/tianhaoz/approveman?utm_source=github.com&utm_medium=referral&utm_content=tianhaoz95/approveman&utm_campaign=Badge_Grade)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/tianhaoz95/approveman.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/tianhaoz95/approveman/alerts/)
![Run Tests](https://github.com/tianhaoz95/approveman/workflows/Run%20Tests/badge.svg?branch=master)
[![codecov](https://codecov.io/gh/tianhaoz95/approveman/branch/master/graph/badge.svg)](https://codecov.io/gh/tianhaoz95/approveman)
![CodeQL](https://github.com/tianhaoz95/approveman/workflows/CodeQL/badge.svg?branch=master)
![Release Drafter](https://github.com/tianhaoz95/approveman/workflows/Release%20Drafter/badge.svg?branch=master)

ApproveMan is a GitHub app that helps approve pull requests with safe changes.

## Motivation

To maintain the health of repositories, it's important to set up review policies to make sure every pull request is good.

GitHub provides "protected branches" as a way to enforce code review policies on incoming pull requests.

However, not all pull requests require human attention.

For example, it's reasonable for a repository to set up a location with a user's GitHub ID like `[project_root]/playground/${username}` to allow developers add quick experiments that they want to keep a record and share with the team.

In this case, if I want to add some notes in `[project_root]/playground/${username}/my-note.md`, there is no reason to ask another developer to review the change.

## Usage

You can configure the behavior by adding rules into `.github/approveman.yml`.

Here is an example that, given that my GitHub ID is `tianhaoz95`, approves all my changes that go into `playground/tianhaoz95` and `docs/personal/tianhaoz95`:

```yml
ownership_rules:
  directory_matching_rules:
    - name: personal projects in experimental
      path: playground/{{username}}/**/*
    - name: personal documentation
      path: docs/personal/{{username}}/**/*
```

Note:

-   The default config contains `playground/{{username}}/**/*` if no config file is provided in the repository.
-   All pull requests that modify files within `.github` the directory is denied regardless of the rules in the configuration for safety.

Here is an example of how it works:

![approval demo](https://raw.githubusercontent.com/tianhaoz95/approveman/master/docs/asset/screenshots/approval.png)

![check status demo](https://raw.githubusercontent.com/tianhaoz95/approveman/master/docs/asset/screenshots/check_status.png)
