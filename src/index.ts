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
    /* eslint-disable @typescript-eslint/no-explicit-any */
    async (context: Context<any>) => {
      /* eslint-enable @typescript-eslint/no-explicit-any */
      context.log.info("Pull request creation event detected");
      await maybeApproveChange(context);
    },
  );
};
