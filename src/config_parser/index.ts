import { Context } from "probot"; // eslint-disable-line no-unused-vars
import Webhooks from "probot/node_modules/@octokit/webhooks"; // eslint-disable-line no-unused-vars
import { OwnershipRules, DirectoryMatchingRule } from "../types"; // eslint-disable-line no-unused-vars

export function parseOwnershipRules(
  rules: any,
  context: Context<Webhooks.WebhookPayloadPullRequest>
): OwnershipRules {
  const ownershipRules: OwnershipRules = {
    directoryMatchingRules: [],
  };
  if ("ownership_rules" in rules) {
    context.log.info("Found ownership_rules in the config");
    const ownershipRulesData = rules.ownership_rules;
    if ("directory_matching_rules" in ownershipRulesData) {
      context.log.info("Found directory_matching_rules in the config");
      for (const rule of ownershipRulesData.directory_matching_rules) {
        const directoryMatchingRule: DirectoryMatchingRule = {
          name: "Default directory matching rule name",
          path: "Undefined",
        };
        if ("name" in rule) {
          directoryMatchingRule.name = rule.name;
        }
        if ("path" in rule) {
          directoryMatchingRule.path = rule.path;
        }
        ownershipRules.directoryMatchingRules.push(directoryMatchingRule);
      }
    }
  }
  return ownershipRules;
}

function getDefaultOwnershipRules(): OwnershipRules {
  const ownershipRules: OwnershipRules = {
    directoryMatchingRules: [
      {
        name: "Default experimental matching rule",
        path: "experimental/{{username}}/**/*",
      },
    ],
  };
  return ownershipRules;
}

export async function getOwnershipRules(
  context: Context<Webhooks.WebhookPayloadPullRequest>
): Promise<OwnershipRules> {
  const config = await context.config("approveman.yml");
  context.log.info(`Found config: ${JSON.stringify(config)}`);
  if (config !== null) {
    return parseOwnershipRules(config, context);
  } else {
    return getDefaultOwnershipRules();
  }
}
