![logo](https://raw.githubusercontent.com/tianhaoz95/approveman/master/docs/asset/logo/title_rounded.png)

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-3-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

## Repository status

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

### For GitHub

The app can be installed from the [GitHub Marketplace](https://github.com/marketplace/approveman).

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
-   The globstar matches only the directories. More specifically, if you want all Markdown files in a directory, please use `playground/{{username}}/**/*.md` instead of `playground/{{username}}/**.md` which might work with some of the matching package variances.

Here is an example of how it works:

![approval demo](https://raw.githubusercontent.com/tianhaoz95/approveman/master/docs/asset/screenshots/approval.png)

![check status demo](https://raw.githubusercontent.com/tianhaoz95/approveman/master/docs/asset/screenshots/check_status.png)

### For GitHub Enterprise

#### Run with container

After setting `GHE_HOST`, `APP_ID`, `WEBHOOK_PROXY_URL`, `WEBHOOK_SECRET`, use the following command to start the server:

```bash
sudo docker run \
    --env GHE_HOST \
    --env APP_ID \
    --env WEBHOOK_PROXY_URL \
    --env WEBHOOK_SECRET \
    ghcr.io/tianhaoz95/approveman-server:v1.1.2 
```

For more details, see [GitHub Container Registry](https://github.com/users/tianhaoz95/packages/container/package/approveman-server).

#### Run locally

To run a server for GitHub Enterprise, please also set `GHE_HOST` and `APP_ACTOR_NAME_OVERRIDE` before running the server:

```bash
# This will be the custom domain for your GitHub Enterprise
export GHE_HOST="github.example.com"

# The following is just an example, you will need to set it to
# the app's actor name that you assign it with in GitHub Enterprise
# integration.
export APP_ACTOR_NAME_OVERRIDE="project-name__approveman[bot]"

npm run build # Build the TypeScript source
npm start # Start the server
```

After the server is up and running, the rest should be the same as the [GitHub setup](#for-github).

## Available config

The following is a full configuration with default values:

```yml
ownership_rules:
  # If files inside .github directory should be allowed.
  # When it is set of true, rules like .github/workflows/playground__{{username}}-*.yml
  # can be enable with certain rules.
  # When it is set of false (default value), a pull request will not be approved
  # reguardless of rules if any files inside the .github folder is touched.
  allow_dot_github: false
  # A list of usernames that should not get their pull requests approved even
  # validated by rules. This can be used when some users are spotted to abuse
  # the auto approval and checks in unwanted content that violates the code of
  # conduct or other policies set by the owner.
  global_blacklisted_users: []
  # An optional list of usernames that should get their pull requests approved if
  # validated by rules. This can be used when only some users are trusted "commit
  # directly to the default branch", but you still want repository checks to be run for
  # their changes.  If not specified or empty, all users are considered to be "allowed".
  # This is also useful for automation usecases, automatically approving PRs created by
  # specific machine users.
  # N.B. Where a user is both "allowed" and "blacklisted", blacklisting takes precedence.
  global_allowed_users: []
  # The rules for matching directory ownership. A pull request is determined to be safe
  # when all the files modified satisfy at least one of the rules.
  directory_matching_rules:
      # The name of the rules that is used mainly for logging.
    - name: "Default playground rule for prototyping."
      # The directory that certain user with {{username}} owns.
      path: "playground/{{username}}/**/*"
```

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://tianhaoz.com"><img src="https://avatars3.githubusercontent.com/u/16887772?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Tianhao Zhou</b></sub></a><br /><a href="https://github.com/tianhaoz95/approveman/commits?author=tianhaoz95" title="Code">💻</a> <a href="https://github.com/tianhaoz95/approveman/commits?author=tianhaoz95" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/epDHowwD"><img src="https://avatars1.githubusercontent.com/u/37585964?v=4?s=100" width="100px;" alt=""/><br /><sub><b>gnod</b></sub></a><br /><a href="https://github.com/tianhaoz95/approveman/issues?q=author%3AepDHowwD" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/scalen"><img src="https://avatars.githubusercontent.com/u/3024226?v=4?s=100" width="100px;" alt=""/><br /><sub><b>David Monks</b></sub></a><br /><a href="https://github.com/tianhaoz95/approveman/commits?author=scalen" title="Code">💻</a> <a href="https://github.com/tianhaoz95/approveman/commits?author=scalen" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
