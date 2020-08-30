import prettyjson from "prettyjson";

/**
 * Composes message for dismissing previous approvals.
 */
export const composeReviewDismissalMsg = (): string => {
  return "The approval is no longer valid.";
};

/**
 * Composes the title that shows on the statuc check.
 */
export const composeStatusCheckTitle = (): string => {
  return "Hooray! ApproveMan has finished checking this pull request!";
};

/**
 * Composes the summary that shows on the statuc check.
 */
export const composeStatusCheckSummary = (): string => {
  return "Everything looks good!";
};

/**
 * Composes the details that shows on the statuc check.
 */
export const composeStatusCheckDetails = (): string => {
  return "Thanks for using ApproveMan!";
};

/**
 * Composes the title for a crash report.
 */
export const composeCrashReportTitle = (): string => {
  return "Whoops! An unknown error occured.";
};

/**
 * Composes the summary for a crash report.
 */
export const composeCrashReportSummary = (): string => {
  return (
    "We are sorry that an unknown error occured.\n" +
    "For more details, please see the following error messages.\n" +
    "To help improve ApproveMan, please file a issue in " +
    "https://github.com/tianhaoz95/approveman/issues. " +
    "Thanks!"
  );
};

/**
 * Composes the details for a crash report.
 */
export const composeCrashReportDetails = (error: Error): string => {
  const prettyErrorMsg = prettyjson.render(error, { noColor: true });
  return prettyErrorMsg;
};
