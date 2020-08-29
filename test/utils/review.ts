import nock from "nock";
import { composeReviewDismissalMsg } from "../../src/utils/msg_composer";
import { StatusCodes } from "http-status-codes";

export const checkApproved = (pullNumber = 1): void => {
  nock("https://api.github.com")
    .post(
      `/repos/tianhaoz95/approveman-test/pulls/${pullNumber}/reviews`,
      (body: Record<string, unknown>) => {
        expect(body).toMatchObject({
          event: "APPROVE",
        });
        return true;
      },
    )
    .reply(StatusCodes.OK);
};

/**
 * Populates a pull request with fake previous reviews.
 * 
 * @param reviews A list of review that should exist on the pull request
 */
export const setPreviousReviews = (
  reviews: Record<string, unknown>[],
): void => {
  nock("https://api.github.com")
    .get("/repos/tianhaoz95/approveman-test/pulls/1/reviews")
    .reply(StatusCodes.OK, reviews);
};

/**
 * Populates a pull request with a single fake review
 * with {@linkcode setPreviousReviews}.
 */
export const setSinglePreviousReview = (): void => {
  setPreviousReviews([
    {
      id: 1,
      state: "APPROVED",
      user: {
        login: "approveman[bot]",
      },
    },
  ]);
};

export const verifyReviewDismissed = (reviewId = 1, pullNumber = 1): void => {
  nock("https://api.github.com")
    .put(
      `/repos/tianhaoz95/approveman-test/pulls/${pullNumber}/reviews/${reviewId}/dismissals`,
      (body: Record<string, unknown>) => {
        expect(body).toMatchObject({
          message: composeReviewDismissalMsg(),
        });
        return true;
      },
    )
    .reply(StatusCodes.OK);
};
