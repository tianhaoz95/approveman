/* eslint-disable @typescript-eslint/no-unused-vars */
import { Application, Context } from "probot";
/* eslint-enable @typescript-eslint/no-unused-vars */
import { healthCheck } from "./utils/health_check";
import { maybeApproveChange } from "./core";

export = (app: Application): void => {
  healthCheck(
    (msg) => {
      app.log.info(msg);
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
    async (context: Context<any>) => {
      /* eslint-enable */
      context.log.info("Pull request creation event detected");
      await maybeApproveChange(context);
    },
  );
};
