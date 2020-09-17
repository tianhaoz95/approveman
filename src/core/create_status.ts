import { APP_CHECK_NAME } from "../utils/config";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Context } from "probot";
/* eslint-enable  @typescript-eslint/no-unused-vars*/
import { StatusCodes } from "http-status-codes";

/**
 * Creates a check in the pull request.
 *
 * @param context The request context from Probot core.
 * @param conclusion The conclusion of the run.
 * @param status The status of the run.
 * @param title The title that shows up when user clicks on the check.
 * @param summary The summary that shows up under the title.
 * @param details The details that shows up under the summary.
 * @param startTime The string time that the run started.
 */
export const createStatus = async (
  context: Context,
  conclusion:
    | "success"
    | "failure"
    | "neutral"
    | "cancelled"
    | "timed_out"
    | "action_required"
    | undefined,
  status: "in_progress" | "completed" | "queued",
  title: string,
  summary: string,
  details: string,
  startTime: string,
): Promise<void> => {
  /* eslint-disable */
  const completedAt: string | undefined = conclusion
    ? new Date().toISOString()
    : undefined;
  const startedAt: string | undefined =
    status === "in_progress" ? startTime : undefined;
  /* eslint-enable */
  const statusOptions = context.repo({
    "completed_at": completedAt,
    conclusion,
    "head_sha": context.payload.pull_request.head.sha,
    "name": APP_CHECK_NAME,
    "output": {
      summary,
      "text": details,
      title,
    },
    "request": {
      "retries": 3,
      "retryAfter": 3,
    },
    "started_at": startedAt,
    status,
  });
  const response = await context.github.checks.create(statusOptions);
  context.log.info(
    `Create passing status finished with status ${response.status}`,
  );
  if (response.status !== StatusCodes.CREATED) {
    context.log.error(
      `Create passing status failed with status ${
        response.status
      } and error: ${JSON.stringify(response.data)}`,
    );
  }
};
