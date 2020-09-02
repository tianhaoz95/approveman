/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ReviewEvent, ReviewLookupResult, UserInfo } from "../utils/types";
/* eslint-enable  @typescript-eslint/no-unused-vars*/
import {
  composeCrashReportDetails,
  composeCrashReportSummary,
  composeCrashReportTitle,
  composeReviewDismissalMsg,
  composeStatusCheckDetails,
  composeStatusCheckSummary,
  composeStatusCheckTitle,
} from "../utils/msg_composer";
import { containsNotAllowedFile, ownsAllFiles } from "../utils/rule_matcher";
import { APP_CHECK_NAME } from "../utils/config";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Context } from "probot";
/* eslint-enable  @typescript-eslint/no-unused-vars*/
import { StatusCodes } from "http-status-codes";
import { getOwnershipRules } from "../utils/config_parser";

const getPullAuthor = (context: Context): string => {
  return context.payload.pull_request.user.login;
};

const getUserInfo = (context: Context): UserInfo => {
  const info: UserInfo = {
    username: getPullAuthor(context),
  };
  return info;
};

const approveChange = async (context: Context): Promise<void> => {
  const req = context.repo({
    "event": "APPROVE" as ReviewEvent,
    "pull_number": context.payload.pull_request.number,
  });
  context.log.info(`Reviewing PR with request ${JSON.stringify(req)}`);
  try {
    const res = await context.github.pulls.createReview(req);
    if (res.status === StatusCodes.OK) {
      context.log.info("Approve changes succeeded.");
    } else {
      context.log.error(
        `Approve change rejected with: ${JSON.stringify(res.data)}`,
      );
    }
  } catch (err) {
    context.log.error(`Approve change failed with: ${JSON.stringify(err)}`);
  }
};

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
    "started_at": startTime,
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

export const getChangedFiles = async (context: Context): Promise<string[]> => {
  const req = context.repo({
    "pull_number": context.payload.pull_request.number,
  });
  const changedFilesResponse = await context.github.pulls.listFiles(req);
  const changedFiles: string[] = [];
  for (const changedFileData of changedFilesResponse.data) {
    changedFiles.push(changedFileData.filename);
  }
  context.log.info(`Changed files are: ${JSON.stringify(changedFiles)}`);
  return changedFiles;
};

const getPreviousReviewIds = async (
  context: Context,
): Promise<ReviewLookupResult> => {
  const req = context.repo({
    "pull_number": context.payload.pull_request.number,
  });
  const reviewsResponse = await context.github.pulls.listReviews(req);
  let hasReview = false;
  const reviewIds: number[] = [];
  context.log.info(`Found ${reviewsResponse.data.length} reviews`);
  reviewsResponse.data.forEach((review: Record<string, unknown>) => {
    if ("user" in review) {
      const user = review["user"] as Record<string, unknown>;
      if ("login" in user) {
        const username = user["login"] as string;
        context.log.info(`Found review left by ${username}`);
        if (
          username === "approveman[bot]" &&
          (review["state"] as string) !== "DISMISSED"
        ) {
          hasReview = true;
          reviewIds.push(review["id"] as number);
        }
      }
    }
  });
  return { hasReview, reviewIds };
};

const dismissApproval = async (
  context: Context,
  reviewId: number,
): Promise<void> => {
  const req = context.repo({
    "message": composeReviewDismissalMsg(),
    "pull_number": context.payload.pull_request.number,
    "review_id": reviewId,
  });
  context.log.info("Try to dismiss the review");
  const dismissResponse = await context.github.pulls.dismissReview(req);
  context.log.info(
    `Dissmiss review #${reviewId} in PR #${req["pull_number"]} ` +
      `with status ${dismissResponse.status} ` +
      `and review state ${dismissResponse.data.state}`,
  );
};

export const dismissAllApprovals = async (context: Context): Promise<void> => {
  const reviewLookupResult = await getPreviousReviewIds(context);
  for (const reviewId of reviewLookupResult.reviewIds) {
    await dismissApproval(context, reviewId);
  }
  context.log.info(`Dismissed ${reviewLookupResult.reviewIds.length} reviews`);
};

/**
 * Approves a pull request if all the files it contains are owned by the user that
 * opens the pull request.
 *
 * @param context The context for the webhook request constructed by Probot core.
 * @param failOnPurpose Make the run fail on purpose. For testing purposes only.
 */
export const maybeApproveChange = async (context: Context): Promise<void> => {
  const startTime = new Date().toISOString();
  try {
    await createStartStatus(context, startTime);
    const changedFiles = await getChangedFiles(context);
    context.log.info(
      `Files changed in the pull request are ${JSON.stringify(changedFiles)}`,
    );
    if (containsNotAllowedFile(changedFiles)) {
      context.log.info(
        "The user does not own all modified files. " +
          "Undo previous approvals if any.",
      );
      await dismissAllApprovals(context);
      context.log.info("All previous approvals dismissed");
      await createPassingStatus(context, startTime);
      return;
    }
    const rules = await getOwnershipRules(context);
    context.log.info(`Matching against rules: ${JSON.stringify(rules)}`);
    if (
      ownsAllFiles(
        rules.directoryMatchingRules,
        changedFiles,
        getUserInfo(context),
        context,
      )
    ) {
      context.log.info("The user owns all modified files, approve PR.");
      await approveChange(context);
      await createPassingStatus(context, startTime);
    } else {
      context.log.info(
        "The user does not own all modified files. " +
          "Undo previous approvals if any.",
      );
      await dismissAllApprovals(context);
      context.log.info("All previous approvals dismissed");
    }
  } catch (err) {
    context.log.info(`Unknown error occured: ${JSON.stringify(err)}`);
    await createCrashStatus(context, startTime, err);
  }
};
