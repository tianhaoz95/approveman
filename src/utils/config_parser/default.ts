/* eslint-disable @typescript-eslint/no-unused-vars */
import { OwnershipRules } from "../types";
/* eslint-enable @typescript-eslint/no-unused-vars */

export const getDefaultOwnershipRules = (
  addPlayground: boolean,
): OwnershipRules => {
  const ownershipRules: OwnershipRules = {
    allowDotGitHub: false,
    directoryMatchingRules: [],
    globalAllowedUsers: [],
    globalBlacklistedUsers: [],
  };
  if (addPlayground) {
    ownershipRules.directoryMatchingRules.push({
      name: "Default playground rule for prototyping.",
      path: "playground/{{username}}/**/*",
    });
  }
  return ownershipRules;
};
