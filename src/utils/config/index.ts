import { GITHUB_ENTERPRISE_APP_ACTOR_NOT_FOUND } from "./err_msg";

export const APP_CHECK_NAME = "ApproveMan";

export const NOT_ALLOWED_FILES = ["**/.github/**/*"];

/**
 * The configuration file for ApproveMan. Detect this to do automatic
 * configuration validation.
 */
export const APPROVEMAN_CONFIG_FILENAME = ".github/approveman.yml";

export const DEFAULT_APP_ACTOR_NAME = "approveman[bot]";

/**
 * Resolve the app actor name that should be used.
 *
 * The app installed on GitHub, no matter with personal or
 * orgranization account will have the app actor name as
 * {@link DEFAULT_APP_ACTOR_NAME}, but GitHub enterprise
 * will have a different name since the app is running in
 * a enterprise defined environment.
 *
 * TODO(tianhaoz95): try to see if the actor name can be
 * detected automatically to some degree.
 *
 * @returns The resolved app actor name.
 */
export const getAppActorName = (): string => {
  if (process.env.GHE_HOST) {
    if (process.env.APP_ACTOR_NAME_OVERRIDE) {
      // eslint-disable-next-line no-magic-numbers
      if (process.env.APP_ACTOR_NAME_OVERRIDE.length === 0) {
        throw Error("Cannot set override app actor name to an empty string");
      }
      return process.env.APP_ACTOR_NAME_OVERRIDE;
    } else {
      throw Error(GITHUB_ENTERPRISE_APP_ACTOR_NOT_FOUND);
    }
  }
  return DEFAULT_APP_ACTOR_NAME;
};
