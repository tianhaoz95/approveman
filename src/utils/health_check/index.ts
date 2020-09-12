import {
  GITHUB_ENTERPRISE_APP_ACTOR_NOT_FOUND,
  GITHUB_ENTERPRISE_APP_ACTOR_NOT_FOUND_DETAILS,
} from "../config/err_msg";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Application } from "probot";
/* eslint-enable @typescript-eslint/no-unused-vars */

/**
 * Checks if the environment is OK for the app to boot up.
 *
 * This is not used because there is nothing to get called
 * synchronously by Probot to check the health status. I've
 * opened a issue to request this feature in the Probot
 * repository. For details and progresses, see:
 * https://github.com/probot/probot/issues/1340
 *
 * @param app The Probot app.
 * @returns Nothing, but errors out if health check
 * does not pass.
 */
export const healthCheck = (app: Application): void => {
  app.log.info("Start health check");
  if (process.env.GHE_HOST) {
    if (process.env.APP_ACTOR_NAME_OVERRIDE) {
      app.log.error(GITHUB_ENTERPRISE_APP_ACTOR_NOT_FOUND_DETAILS);
      throw Error(GITHUB_ENTERPRISE_APP_ACTOR_NOT_FOUND);
    }
  }
};
