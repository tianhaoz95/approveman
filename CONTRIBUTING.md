# For Developers

Hi there! We're thrilled that you'd like to contribute to this project. Your help is essential for keeping it great.

Please note that this project is released with a Contributor Code of Conduct (`CODE_OF_CONDUCT.md`). By participating in this project you agree to abide by its terms.

## Development

### Quick links

-   [The API documentation](https://approveman-api-docs.vercel.app/)

### Testing

Order of preference: unit tests (strongly recommended) > integration tests (necessary evil) > manual tests (strongly not recommended).

For rare cases where you need to manually test the app behavior, please only install the testing app on [this repository](https://github.com/tianhaoz95/approveman-test).

### Tools

#### Prerequisites

-   It is recommended to develop ApproveMan on a Linux or Mac OS since there are some utility bash scripts that help save you time. Powershell scripts are available but they are less maintained compared with bash scripts. If you happen to have a windows machine, you can use WSL2.

#### Editor

The recommended editor for development is Visual Studio Code since the project has a corresponding configuration file that should work out-of-box.

#### Recommended VS Code extensions

-   [Run on save](https://marketplace.visualstudio.com/items?itemName=emeraldwalk.RunOnSave)
-   [Jest](https://marketplace.visualstudio.com/items?itemName=Orta.vscode-jest)
-   [GitHub issues (Optional)](https://marketplace.visualstudio.com/items?itemName=ms-vscode.github-issues-prs)

## Workflow

The workflow is pretty much taken straight from the Probot project.

### Issues and PRs

If you have suggestions for how this project could be improved, or want to report a bug, open an issue! We'd love all and any contributions. If you have questions, too, we'd love to hear them.

We'd also love PRs. If you're thinking of a large PR, we advise opening up an issue first to talk about it, though! Look at the links below if you're not sure how to open a PR.

### Submitting a pull request

1.  Fork and clone the repository.
2.  Configure and install the dependencies: `npm install`.
3.  Make sure the tests pass on your machine: `npm test`, note: these tests also apply the linter, so there's no need to lint separately.
4.  Create a new branch: `git checkout -b my-branch-name`.
5.  Make your change, add tests, and make sure the tests still pass.
6.  Push to your fork and submit a pull request.
7.  Pat your self on the back and wait for your pull request to be reviewed and merged.

Here are a few things you can do that will increase the likelihood of your pull request being accepted:

-   Follow the style guide which is using standard. Any linting errors should be shown when running `npm test`.
-   Write and update tests.
-   Keep your changes as focused as possible. If there are multiple changes you would like to make that are not dependent upon each other, consider submitting them as separate pull requests.
-   Write a [good commit message](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html).

Work in Progress pull requests are also welcome to get feedback early on, or if there is something blocked you.

### Resources

-   [How to Contribute to Open Source](https://opensource.guide/how-to-contribute/)
-   [Using Pull Requests](https://help.github.com/articles/about-pull-requests/)
-   [GitHub Help](https://help.github.com)
