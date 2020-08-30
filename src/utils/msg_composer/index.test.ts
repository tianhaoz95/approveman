import {
  composeStatusCheckTitle,
  composeStatusCheckDetails,
  composeStatusCheckSummary,
  composeReviewDismissalMsg,
} from ".";

describe("message composer tests", () => {
  test("dismissal message composer works", () => {
    const msg = composeReviewDismissalMsg();
    expect(msg).toBeDefined();
  });

  test("status check title composer works", () => {
    const title = composeStatusCheckTitle();
    expect(title).toBeDefined();
  });

  test("status check summary composer works", () => {
    const summary = composeStatusCheckSummary();
    expect(summary).toBeDefined();
  });

  test("status check detials composer works", () => {
    const detials = composeStatusCheckDetails();
    expect(detials).toBeDefined();
  });
});
