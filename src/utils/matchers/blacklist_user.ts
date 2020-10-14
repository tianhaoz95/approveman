/* eslint-disable @typescript-eslint/no-unused-vars */
import { OwnershipRules } from "../types";
/* eslint-enable @typescript-eslint/no-unused-vars */

/**
 * Checks if a user with [username] is blacklisted by the
 * repository owner.
 *
 * @param username The username that triggers the run.
 * @param rules The ownership rules defined by the repository owner.
 */
export const isUserBlacklisted = (
  username: string,
  rules: OwnershipRules,
): boolean => {
  const finder: string | undefined = rules.globalBlacklistedUsers.find(
    (blacklistedUsername) => blacklistedUsername === username,
  );
  const isBlacklisted: boolean = finder !== undefined;
  return isBlacklisted;
};
