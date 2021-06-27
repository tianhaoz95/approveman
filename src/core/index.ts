import {
  containsNotAllowedFile,
  isUserBlacklisted,
  ownsAllFiles,
} from "../utils/matchers";
import {
  createCrashStatus,
  createNeutralStatus,
  createPassingStatus,
  createStartStatus,
} from "./check_status";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Context } from "probot";
/* eslint-enable  @typescript-eslint/no-unused-vars*/
import { approveChange } from "./review";
import { dismissAllApprovals } from "./dismiss_approval";
import { getChangedFiles } from "./get_files";
import { getOwnershipRules } from "../utils/config_parser";
import { getUserInfo } from "./get_info";

/**
 * Approves a pull request if all the files it contains are owned by the user that
 * opens the pull request.
 *
 * @param context The context for the webhook request constructed by Probot core.
 * @param failOnPurpose Make the run fail on purpose. For testing purposes only.
 */
export const maybeApproveChange = async (context: Context<"pull_request.opened" | "pull_request.reopened" | "pull_request.synchronize">): Promise<void> => {
  const startTime = new Date().toISOString();
  try {
    await createStartStatus(context, startTime);
    const changedFiles = await getChangedFiles(context);
    context.log.trace(
      `Files changed in the pull request are ${JSON.stringify(changedFiles)}`,
    );
    const rules = await getOwnershipRules(context);
    context.log.trace(`Matching against rules: ${JSON.stringify(rules)}`);
    const userInfo = getUserInfo(context);
    // TODO(tianhaoz95): consolidate there precondition checks into
    // a separate file with name check_prerequisites.ts to make it
    // more readable.
    if (isUserBlacklisted(userInfo.username, rules)) {
      context.log.trace("The user is blacklisted.");
      await dismissAllApprovals(context);
      context.log.trace("All previous approvals dismissed");
      // TODO(tianhaoz95): consider making this a failing check
      // if that makes more sense.
      await createNeutralStatus(context, startTime);
      return;
    }
    if (containsNotAllowedFile(changedFiles, rules)) {
      context.log.trace(
        "The user does not own all modified files. " +
          "Undo previous approvals if any.",
      );
      await dismissAllApprovals(context);
      context.log.trace("All previous approvals dismissed");
      await createNeutralStatus(context, startTime);
      return;
    }
    if (
      ownsAllFiles(
        rules.directoryMatchingRules,
        changedFiles,
        userInfo,
        (msg: string) => {
          context.log.trace(msg);
        },
      )
    ) {
      context.log.trace("The user owns all modified files, approve PR.");
      await approveChange(context);
      await createPassingStatus(context, startTime);
    } else {
      context.log.trace(
        "The user does not own all modified files. " +
          "Undo previous approvals if any.",
      );
      await dismissAllApprovals(context);
      context.log.trace("All previous approvals dismissed");
      await createNeutralStatus(context, startTime);
    }
  } catch (err) {
    context.log.trace(`Unknown error occurred: ${JSON.stringify(err)}`);
    await createCrashStatus(context, startTime, err);
  }
};
