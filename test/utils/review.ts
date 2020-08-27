import nock from "nock";
import { composeReviewDismissalMsg } from "../../src/msg_composer";

export const checkApproved = function (pullNumber: Number = 1): void {
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
    .reply(200);
};

export const setPreviousReviews = function (reviews: any[]): void {
  nock("https://api.github.com")
    .get("/repos/tianhaoz95/approveman-test/pulls/1/reviews")
    .reply(200, reviews);
};

export const setSinglePreviousReview = function (): void {
  setPreviousReviews([
    {
      id: 1,
      user: {
        login: "approveman[bot]",
      },
      state: "APPROVED",
    },
  ]);
};

export const verifyReviewDismissed = function (
  reviewId: Number = 1,
  pullNumber: Number = 1,
): void {
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
    .reply(200);
};
