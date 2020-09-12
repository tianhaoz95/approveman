/**
 * Get the GitHub API endpoint the nock should mimic
 * for testing since the endpoint for GitHub and GitHub
 * Enterprise are different, but other things works the
 * same.
 *
 * @returns The endpoint in string form.
 */
export const getGitHubAPIEndpoint = (): string => {
  if (process.env.GHE_HOST) {
    if (!RegExp("^github\\..*\\.com$").test(process.env.GHE_HOST)) {
      throw Error(
        `${process.env.GHE_HOST} is of wrong format, should be github.xxx.com`,
      );
    }
    return `https://${process.env.GHE_HOST}/api/v3`;
  }
  return "https://api.github.com";
};
