/* eslint-disable @typescript-eslint/no-unused-vars */
import { DirectoryMatchingRule, OwnershipRules } from "../types";
/* eslint-enable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Context } from "probot";
/* eslint-enable @typescript-eslint/no-unused-vars */
import { getDefaultOwnershipRules } from "./default";

export const parseOwnershipRules = (
  rules: Record<string, unknown>,
  context: Context | null,
): OwnershipRules => {
  const ownershipRules: OwnershipRules = {
    directoryMatchingRules: [],
  };
  if ("ownership_rules" in rules) {
    context?.log.info("Found ownership_rules in the config");
    const ownershipRulesData = rules["ownership_rules"] as Record<
      string,
      unknown
    >;
    if ("directory_matching_rules" in ownershipRulesData) {
      context?.log.info("Found directory_matching_rules in the config");
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

export const getOwnershipRules = async (
  context: Context | null,
): Promise<OwnershipRules> => {
  const config = await context?.config("approveman.yml");
  context?.log.info(`Found config: ${JSON.stringify(config)}`);
  /* eslint-disable */
  if (config !== null && config !== undefined) {
    /* eslint-enable */
    return parseOwnershipRules(config as Record<string, unknown>, context);
  } else {
    return getDefaultOwnershipRules();
  }
};
