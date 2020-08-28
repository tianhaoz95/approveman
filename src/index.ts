import { Application } from "probot"; // eslint-disable-line no-unused-vars
import { maybeApproveChange } from "./octokit_utils";

export = (app: Application): void => {
  app.log.info("Starting ApproveMan server ...");

  app.on(
    [
      "pull_request.opened",
      "pull_request.reopened",
      "pull_request.synchronize",
    ],
    async (context) => {
      context.log.info("Pull request creation event detected");
      await maybeApproveChange(context);
    },
  );
};
