import {
  composeStatusCheckTitle,
  composeStatusCheckDetails,
  composeStatusCheckSummary,
  composeReviewDismissalMsg,
  composeCrashReportDetails,
  composeCrashReportSummary,
  composeCrashReportTitle,
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

  test("crash report title composer works", () => {
    const title = composeCrashReportTitle();
    expect(title).toBeDefined();
  });

  test("crash report summary composer works", () => {
    const summary = composeCrashReportSummary();
    expect(summary).toBeDefined();
  });

  test("crash report detials composer works", () => {
    const detials = composeCrashReportDetails(Error());
    expect(detials).toBeDefined();
  });
});
