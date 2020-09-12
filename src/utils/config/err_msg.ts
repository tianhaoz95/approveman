/**
 * The error message is thrown when the app is running in a GitHub enterprise
 * context but the app actor name is not set.
 */
export const GITHUB_ENTERPRISE_APP_ACTOR_NOT_FOUND =
  "GHE_HOST set but APP_ACTOR_NAME_OVERRIDE is not";

/**
 * This message is displayed when developers want to start the server
 * for GitHub Enterprise but forgot to set proper APP_ACTOR_NAME_OVERRIDE
 * for the app to properly dismiss outdated approvals.
 */
export const GITHUB_ENTERPRISE_APP_ACTOR_NOT_FOUND_DETAILS = `
  To run ApproveMan for GitHub Enterprise (which is indicated by GHE_HOST set
  in the environment), please also set APP_ACTOR_NAME_OVERRIDE to help the app
  properly dismiss outdated approvals since GitHub Enterprise does not name
  applications the same way as GitHub and ApproveMan currently does not have
  a way to get the app actor name used.

  For more details, see https://github.com/tianhaoz95/approveman/issues/64.

  In the longer term, there might be a better way to automate the app actor
  name retrival. For details and progresses, see
  https://github.com/tianhaoz95/approveman/issues/68.
`;
