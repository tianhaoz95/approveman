# Privacy Policy

Tianhao Zhou ("Me", "Myself", and "I") built ApproveMan (the "app") as an Open Source GitHub App. This service is provided by myself and is intended for use as is.

This page is used to inform users ("you") regarding my policies with the collection, use, and disclosure of personal information if anyone decided to use this service.

If you choose to use the app, then you agree to the collection and use of information in relation to this policy. The collected information is required for the service to work. It is neither stored nor shared with 3rd parties.

## Information collection and use

When installing the the app you grant it access to the following three scopes

-   Read & write access to [pull requests](https://developer.github.com/v3/apps/permissions/#permission-on-pull-requests): the app needs read access to check the files changed in the pull requests and write access to approve the changes when necessary.

-   Read & write access to [contents](https://developer.github.com/v3/apps/permissions/#permission-on-contents)

Although the app ask for read & write access to the contents, the app will never read or write to the contents. The read & write access to contents is required for the reviews that the app sends out to take effect on protected branches. For more details, see ["About required reviews for pull requests"](https://docs.github.com/en/github/administering-a-repository/about-required-reviews-for-pull-requests).

-   Read access to [single file](https://developer.github.com/v3/apps/permissions/#permission-on-single-file): `.github/approveman.yml`

The app can be configured by created a `.github/approveman.yml` file. The app will not access any other files in your repository.

## Sharing of data with 3rd party services

The app is hosted on [Heroku](https://www.heroku.com/) ([Privacy policy](https://www.salesforce.com/company/privacy/)). No user data is persisted besides a temporary storage of log files for less than 30 days.

For the purpose of error tracking, error stacks are shared with [Sentry](https://sentry.io/) ([Privacy notice](https://sentry.io/privacy/)).

## Security

I value your trust in providing your personal information, thus I am striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and I cannot guarantee its absolute security.

## Changes to this privacy policy

I may update this privacy policy from time to time. Thus, you are advised to review this page periodically for any changes. Once the application is public, I will notify you of any changes by creating a pull request on this repository and leaving it open for at least 14 days to give time for you to raise any concerns. These changes are effective immediately after they are merged into the main branch.

## Contact me

If you have any questions or suggestions about my Privacy Policy, do not hesitate to contact me at `jacksonzhou666@gmail.com`.
