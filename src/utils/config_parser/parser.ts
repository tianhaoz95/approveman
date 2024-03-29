/* eslint-disable @typescript-eslint/no-unused-vars */
import { DirectoryMatchingRule, OwnershipRules } from "../types";
/* eslint-enable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Context } from "probot";
/* eslint-enable @typescript-eslint/no-unused-vars */
import { getDefaultOwnershipRules } from "./default";

export const parseOwnershipRules = (
  rules: Record<string, unknown>,
  context: Context<"pull_request.opened" | "pull_request.reopened" | "pull_request.synchronize"> | null,
): OwnershipRules => {
  const ownershipRules: OwnershipRules = getDefaultOwnershipRules(false);
  if ("ownership_rules" in rules) {
    context?.log.trace("Found ownership_rules in the config");
    const ownershipRulesData = rules["ownership_rules"] as Record<
      string,
      unknown
    >;
    if ("allow_dot_github" in ownershipRulesData) {
      ownershipRules.allowDotGitHub = ownershipRulesData[
        "allow_dot_github"
      ] as boolean;
    }
    if ("global_allowed_users" in ownershipRulesData) {
      const allowedUsernames: string[] = ownershipRulesData[
        "global_allowed_users"
      ] as string[];
      allowedUsernames.forEach((allowedUsername) => {
        ownershipRules.globalAllowedUsers.push(allowedUsername);
      });
    }
    if ("global_blacklisted_users" in ownershipRulesData) {
      const blacklistedUsernames: string[] = ownershipRulesData[
        "global_blacklisted_users"
      ] as string[];
      blacklistedUsernames.forEach((blacklistedUsername) => {
        ownershipRules.globalBlacklistedUsers.push(blacklistedUsername);
      });
    }
    if ("directory_matching_rules" in ownershipRulesData) {
      context?.log.trace("Found directory_matching_rules in the config");
      for (const rule of ownershipRulesData[
        "directory_matching_rules"
      ] as Record<string, string>[]) {
        const directoryMatchingRule: DirectoryMatchingRule = {
          name: "Default directory matching rule name",
          path: "Undefined",
        };
        if ("name" in rule) {
          directoryMatchingRule.name = rule["name"];
        }
        if ("path" in rule) {
          directoryMatchingRule.path = rule["path"];
        }
        ownershipRules.directoryMatchingRules.push(directoryMatchingRule);
      }
    }
  }
  return ownershipRules;
};
