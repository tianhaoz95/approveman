/* eslint-disable @typescript-eslint/no-unused-vars */
import { Context } from "probot";
/* eslint-enable  @typescript-eslint/no-unused-vars*/
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { UserInfo } from "../utils/types";
/* eslint-enable  @typescript-eslint/no-unused-vars*/

/**
 * Parses the user information from the event payload.
 *
 * @param context The Probot context.
 */
export const getUserInfo = (context: Context<"pull_request.opened" | "pull_request.reopened" | "pull_request.synchronize">): UserInfo => {
  const info: UserInfo = {
    username: context.payload.pull_request.user.login,
  };
  return info;
};
