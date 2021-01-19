/* eslint-disable @typescript-eslint/no-unused-vars */
import { Context } from "probot";
/* eslint-enable  @typescript-eslint/no-unused-vars*/
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ReviewLookupResult } from "../utils/types";
/* eslint-enable  @typescript-eslint/no-unused-vars*/
import { composeReviewDismissalMsg } from "../utils/msg_composer";
import { getAppActorName } from "../utils/config";

const getPreviousReviewIds = async (
  context: Context,
): Promise<ReviewLookupResult> => {
  const req = context.repo({
    "pull_number": context.payload.pull_request.number,
  });
  const reviewsResponse = await context.octokit.pulls.listReviews(req);
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
          username === getAppActorName() &&
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
  const dismissResponse = await context.octokit.pulls.dismissReview(req);
  context.log.info(
    `Dismiss review #${reviewId} in PR #${req["pull_number"]} ` +
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
