import {
  composeCrashReportDetails,
  composeCrashReportSummary,
  composeCrashReportTitle,
  composeStatusCheckDetails,
  composeStatusCheckSummary,
  composeStatusCheckTitle,
} from "../utils/msg_composer";
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
  context.log.trace(`Create ${status} status with conclusion ${conclusion}.`);
  context.log.trace(
    `title: ${title}, summary: ${summary}, details: ${details}`,
  );
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
  const response = await context.octokit.checks.create(statusOptions);
  context.log.trace(`Posting status finished with status ${response.status}`);
  if (response.status !== StatusCodes.CREATED) {
    context.log.error(
      `Create passing status failed with status ${
        response.status
      } and error: ${JSON.stringify(response.data)}`,
    );
  }
};

/**
 * Create a status in pull requets indicating that the run
 * has started.
 *
 * @param context The request context from Probot core.
 * @param startTime The string time that the run started.
 */
export const createStartStatus = async (
  context: Context,
  startTime: string,
): Promise<void> => {
  await createStatus(
    context,
    /* eslint-disable */
    undefined,
    /* eslint-enable */
    "in_progress",
    composeStatusCheckTitle(),
    composeStatusCheckSummary(),
    composeStatusCheckDetails(),
    startTime,
  );
};

/**
 * Create a check in the pull request to indicate that the app
 * has received and processed the pull request event.
 *
 * Note:
 *
 * - It can only be passing or not exist at all.
 * - It is for indicating that the event is handled.
 * - It indicates nothing about whether the PR is approved.
 *
 * @param context The request context created by Probot core.
 * @param startTime The timestamp that this run started.
 */
export const createPassingStatus = async (
  context: Context,
  startTime: string,
): Promise<void> => {
  await createStatus(
    context,
    "success",
    "completed",
    composeStatusCheckTitle(),
    composeStatusCheckSummary(),
    composeStatusCheckDetails(),
    startTime,
  );
};

/**
 * Create a check to let the user know that something
 * is wrong during the run.
 *
 * @param context The Probot context.
 * @param startTime The timestamp that the check started.
 * @param error The error that caused the status.
 */
export const createCrashStatus = async (
  context: Context,
  startTime: string,
  error: Error,
): Promise<void> => {
  await createStatus(
    context,
    "failure",
    "completed",
    composeCrashReportTitle(),
    composeCrashReportSummary(),
    composeCrashReportDetails(error),
    startTime,
  );
};

/**
 * Post a neutral check indicating that the app
 * decide to act as noop for this pull request.
 *
 * @param context The Probot context.
 * @param startTime The timestamp that the checks started at.
 */
export const createNeutralStatus = async (
  context: Context,
  startTime: string,
): Promise<void> => {
  await createStatus(
    context,
    "neutral",
    "completed",
    composeStatusCheckTitle(),
    composeStatusCheckSummary(),
    composeStatusCheckDetails(),
    startTime,
  );
};
