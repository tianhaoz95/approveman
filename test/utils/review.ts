import nock from "nock";
import { composeReviewDismissalMsg } from "../../src/msg_composer";
import { StatusCodes } from "http-status-codes";

export const checkApproved = (pullNumber: Number = 1): void => {
  nock("https://api.github.com")
    .post(
      `/repos/tianhaoz95/approveman-test/pulls/${pullNumber}/reviews`,
      (body: any) => {
        expect(body).toMatchObject({
          event: "APPROVE",
        });
        return true;
      },
    )
    .reply(StatusCodes.OK);
};

export const setPreviousReviews = (reviews: Object[]): void => {
  nock("https://api.github.com")
    .get("/repos/tianhaoz95/approveman-test/pulls/1/reviews")
    .reply(StatusCodes.OK, reviews);
};

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

export const verifyReviewDismissed = (
  reviewId: Number = 1,
  pullNumber: Number = 1,
): void => {
  nock("https://api.github.com")
    .put(
      `/repos/tianhaoz95/approveman-test/pulls/${pullNumber}/reviews/${reviewId}/dismissals`,
      (body: any) => {
        expect(body).toMatchObject({
          message: composeReviewDismissalMsg(),
        });
        return true;
      },
    )
    .reply(StatusCodes.OK);
};
