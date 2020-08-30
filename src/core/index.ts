import { Context, Octokit } from "probot"; // eslint-disable-line no-unused-vars
import { UserInfo, ReviewLookupResult } from "../utils/types"; // eslint-disable-line no-unused-vars
import { getOwnershipRules } from "../utils/config_parser";
import { ownsAllFiles, containsNotAllowedFile } from "../utils/rule_matcher";
import { composeReviewDismissalMsg } from "../utils/msg_composer";
import { APP_CHECK_NAME } from "../utils/config";
import { StatusCodes } from "http-status-codes";

const getPullAuthor = (
  context: Context,
): string => {
  return context.payload.pull_request.user.login;
};

const getUserInfo = (
  context: Context,
): UserInfo => {
  const info: UserInfo = {
    username: getPullAuthor(context,),
  };
  return info;
};

const initPullRelatedRequest = (
  context: Context,
): Record<string, unknown> => {
  const pullNumber = context.payload.pull_request.number;
  const repo = context.payload.repository.name;
  const owner = context.payload.repository.owner.login;
  context.log.info(
    `Initializing pull related request with ${owner}/${repo} #${pullNumber}`,
  );
  const req: Record<string, unknown> = { owner, repo, };
  req["pull_number"] = pullNumber;
  return req;
};

const approveChange = async (
  context: Context,
): Promise<void> => {
  const req = (initPullRelatedRequest(
    context,
  ) as unknown) as Octokit.RequestOptions &
    Octokit.PullsCreateReviewParamsDeprecatedNumber;
  req.event = "APPROVE";
  context.log.info(`Reviewing PR with request ${JSON.stringify(req,)}`,);
  try {
    const res = await context.github.pulls.createReview(req,);
    if (res.status === StatusCodes.OK) {
      context.log.info("Approve changes succeeded.",);
    } else {
      context.log.error(
        `Approve change rejected with: ${JSON.stringify(res.data,)}`,
      );
    }
  } catch (err) {
    context.log.error(`Approve change failed with: ${JSON.stringify(err,)}`,);
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
const createPassingStatus = async (
  context: Context,
  startTime: string,
): Promise<void> => {
  const statusOptions: Octokit.RequestOptions &
    Octokit.ChecksCreateParams = context.repo({
      "completed_at": new Date().toISOString(),
      "conclusion": "success",
      "head_sha": context.payload.pull_request.head.sha,
      "name": APP_CHECK_NAME,
      "output": {
        "summary": "test",
        "text": "test",
        "title": "test",
      },
      "request": {
        "retries": 3,
        "retryAfter": 3,
      },
      "started_at": startTime,
      "status": "completed",
    },);
  const response = await context.github.checks.create(statusOptions,);
  context.log.info(
    `Create passing status finished with status ${response.status}`,
  );
  if (response.status !== StatusCodes.CREATED) {
    context.log.error(
      `Create passing status failed with status ${
        response.status
      } and error: ${JSON.stringify(response.data,)}`,
    );
  }
};

export const getChangedFiles = async (
  context: Context,
): Promise<string[]> => {
  const req = (initPullRelatedRequest(
    context,
  ) as unknown) as Octokit.RequestOptions &
    Octokit.PullsListFilesParamsDeprecatedNumber;
  const changedFilesResponse = await context.github.pulls.listFiles(req,);
  const changedFiles: string[] = [];
  for (const changedFileData of changedFilesResponse.data) {
    changedFiles.push(changedFileData.filename,);
  }
  context.log.info(`Changed files are: ${JSON.stringify(changedFiles,)}`,);
  return changedFiles;
};

const getPreviousReviewIds = async (
  context: Context,
): Promise<ReviewLookupResult> => {
  const req = (initPullRelatedRequest(
    context,
  ) as unknown) as Octokit.RequestOptions &
    Octokit.PullsListFilesParamsDeprecatedNumber;
  const reviewsResponse = await context.github.pulls.listReviews(req,);
  let hasReview = false;
  const reviewIds: number[] = [];
  context.log.info(`Found ${reviewsResponse.data.length} reviews`,);
  reviewsResponse.data.forEach((review,) => {
    context.log.info(review.user.login,);
    if (
      review.user.login === "approveman[bot]" &&
      review.state !== "DISMISSED"
    ) {
      hasReview = true;
      reviewIds.push(review.id,);
    }
  },);
  return { hasReview, reviewIds, };
};

const dismissApproval = async (
  context: Context,
  reviewId: number,
): Promise<void> => {
  const pullReq = initPullRelatedRequest(context,) as Record<string, string>;
  const req = (pullReq as unknown) as Octokit.RequestOptions &
    Octokit.PullsDismissReviewParamsDeprecatedNumber;
  req["review_id"] = reviewId;
  req.message = composeReviewDismissalMsg();
  context.log.info("Try to dismiss the review",);
  const dismissResponse = await context.github.pulls.dismissReview(req,);
  context.log.info(
    `Dissmiss review #${reviewId} in PR #${pullReq["pull_number"]} ` +
      `with status ${dismissResponse.status} ` +
      `and review state ${dismissResponse.data.state}`,
  );
};

export const dismissAllApprovals = async (
  context: Context,
): Promise<void> => {
  const reviewLookupResult = await getPreviousReviewIds(context,);
  for (const reviewId of reviewLookupResult.reviewIds) {
    await dismissApproval(context, reviewId,);
  }
  context.log.info(`Dismissed ${reviewLookupResult.reviewIds.length} reviews`,);
};

/**
 * Approves a pull request if all the files it contains are owned by the user that
 * opens the pull request.
 * 
 * @param context The context for the webhook request constructed by Probot core.
 */
export const maybeApproveChange = async (
  context: Context,
): Promise<void> => {
  const startTime = new Date().toISOString();
  const changedFiles = await getChangedFiles(context,);
  context.log.info(
    `Files changed in the pull request are ${JSON.stringify(changedFiles,)}`,
  );
  if (containsNotAllowedFile(changedFiles,)) {
    context.log.info(
      "The user does not own all modified files. " + 
      "Undo previous approvals if any.",
    );
    await dismissAllApprovals(context,);
    context.log.info("All previous approvals dismissed",);
    return;
  }
  const rules = await getOwnershipRules(context,);
  context.log.info(`Matching against rules: ${JSON.stringify(rules,)}`,);
  if (
    ownsAllFiles(
      rules.directoryMatchingRules,
      changedFiles,
      getUserInfo(context,),
      context,
    )
  ) {
    context.log.info("The user owns all modified files, approve PR.",);
    await approveChange(context,);
    await createPassingStatus(context, startTime,);
  } else {
    context.log.info(
      "The user does not own all modified files. " + 
      "Undo previous approvals if any.",
    );
    await dismissAllApprovals(context,);
    context.log.info("All previous approvals dismissed",);
  }
};
