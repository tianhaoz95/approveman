/* eslint-disable @typescript-eslint/no-unused-vars */
import { Context, Probot } from "probot";
/* eslint-enable @typescript-eslint/no-unused-vars */
import { healthCheck } from "./utils/health_check";
import { maybeApproveChange } from "./core";

const approvemanApp = (
  // TODO(tianhaoz95): make it a non-any type when available
  // The latest version of Probot is not
  // exposing the ApplicationOptions type, for more updates
  // check https://github.com/probot/probot/pull/1405.
  /* eslint-disable */
  app: Probot,
  /* eslint-enable */
): void => {
  healthCheck(
    (msg) => {
      app.log.trace(msg);
    },
    (msg) => {
      app.log.error(msg);
    },
  );

  app.on(
    [
      "pull_request.opened",
      "pull_request.reopened",
      "pull_request.synchronize",
    ],
    // TODO(tianhaoz95): change this to strongly typed webhook
    // event to make it safer.
    /* eslint-disable */
    async (context: Context<"pull_request.opened" | "pull_request.reopened" | "pull_request.synchronize">) => {
      /* eslint-enable */
      context.log.trace("Pull request creation event detected");
      await maybeApproveChange(context);
    },
  );
};

export default approvemanApp;
