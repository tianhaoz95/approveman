/* eslint-disable @typescript-eslint/no-unused-vars */
import { OwnershipRules } from "../types";
/* eslint-enable @typescript-eslint/no-unused-vars */

/**
 * Checks if a user with [username] is allowed by the
 * repository owner.
 *
 * @param username The username that triggers the run.
 * @param rules The ownership rules defined by the repository owner.
 */
export const isUserAllowed = (
  username: string,
  rules: OwnershipRules,
): boolean => {
  const isAllowed: boolean = (
    !rules.globalAllowedUsers.length
  ) || rules.globalAllowedUsers.some(
    (allowedUsername) => allowedUsername === username,
  );
  return isAllowed;
};
