/* eslint-disable @typescript-eslint/no-unused-vars */
import { DirectoryMatchingRule, UserInfo } from "../types";
/* eslint-enable @typescript-eslint/no-unused-vars */
import { MATCH_OPTIONS } from "../config";
import Mustache from "mustache";
import minimatch from "minimatch";

/**
 * Matches a single file against a single rule to check for ownership.
 *
 * @param rule The user defined rule to identify file ownership.
 * @param filename The file in the pull request that should be checked.
 * @param info The user information that can be used in rules.
 * @param context The request context from Probot core.
 */
export const matchRule = (
  rule: DirectoryMatchingRule,
  filename: string,
  info: UserInfo,
  log_msg: (msg: string) => void,
): boolean => {
  const renderedRule = Mustache.render(rule.path, info);
  log_msg(`Rendered rules to ${renderedRule}`);
  const isMatch = minimatch(filename, renderedRule, MATCH_OPTIONS);
  log_msg(
    `File ${filename} and rule ${renderedRule} matching result is ${isMatch}`,
  );
  return isMatch;
};

const matchOneOfRules = (
  rules: DirectoryMatchingRule[],
  filename: string,
  info: UserInfo,
  log_msg: (msg: string) => void,
): boolean => {
  let matchOneOf = false;
  for (const rule of rules) {
    if (matchRule(rule, filename, info, log_msg)) {
      matchOneOf = true;
    }
  }
  return matchOneOf;
};

export const ownsAllFiles = (
  rules: DirectoryMatchingRule[],
  filenames: string[],
  info: UserInfo,
  log_msg: (msg: string) => void,
): boolean => {
  let ownsAll = true;
  for (const filename of filenames) {
    if (!matchOneOfRules(rules, filename, info, log_msg)) {
      ownsAll = false;
    }
  }
  return ownsAll;
};
