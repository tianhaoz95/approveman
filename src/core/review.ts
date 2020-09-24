/* eslint-disable @typescript-eslint/no-unused-vars */
import { Context } from "probot";
/* eslint-enable  @typescript-eslint/no-unused-vars*/
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ReviewEvent } from "../utils/types";
/* eslint-enable  @typescript-eslint/no-unused-vars*/
import { StatusCodes } from "http-status-codes";

/**
 * Posts a review to approve the pull request.
 *
 * @param context The Probot context.
 */
export const approveChange = async (context: Context): Promise<void> => {
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
