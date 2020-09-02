/* eslint-disable @typescript-eslint/no-unused-vars */
import { Context } from "probot";
import { DirectoryMatchingRule, UserInfo } from "../types";
/* eslint-enable @typescript-eslint/no-unused-vars */
import Mustache from "mustache";
import minimatch from "minimatch";
import { NOT_ALLOWED_FILES, APPROVEMAN_CONFIG_FILENAME } from "../config";

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
  context: Context | null,
): boolean => {
  const renderedRule = Mustache.render(rule.path, info);
  context?.log.info(`Rendered rules to ${renderedRule}`);
  const isMatch = minimatch(filename, renderedRule);
  context?.log.info(
    `File ${filename} and rule ${renderedRule} matching result is ${isMatch}`,
  );
  return isMatch;
};

/**
 * Identifies if a pull request modifies the ApproveMan configuration.
 *
 * @param filenames A list of files that were modified in a pull request
 */
export const containsApproveManConfig = (filenames: string[]): boolean => {
  let containsConfig = false;
  filenames.forEach((filename) => {
    if (minimatch(filename, APPROVEMAN_CONFIG_FILENAME)) {
      containsConfig = true;
    }
  });
  return containsConfig;
};

export const isAllowedFile = (filename: string): boolean => {
  let isAllowed = true;
  NOT_ALLOWED_FILES.forEach((notAllowedFile) => {
    if (minimatch(filename, notAllowedFile)) {
      isAllowed = false;
    }
  });
  return isAllowed;
};

export const containsNotAllowedFile = (filenames: string[]): boolean => {
  let contains = false;
  filenames.forEach((filename) => {
    if (!isAllowedFile(filename)) {
      contains = true;
    }
  });
  return contains;
};

const matchOneOfRules = (
  rules: DirectoryMatchingRule[],
  filename: string,
  info: UserInfo,
  context: Context | null,
): boolean => {
  let matchOneOf = false;
  for (const rule of rules) {
    if (matchRule(rule, filename, info, context)) {
      matchOneOf = true;
    }
  }
  return matchOneOf;
};

export const ownsAllFiles = (
  rules: DirectoryMatchingRule[],
  filenames: string[],
  info: UserInfo,
  context: Context | null,
): boolean => {
  let ownsAll = true;
  for (const filename of filenames) {
    if (!matchOneOfRules(rules, filename, info, context)) {
      ownsAll = false;
    }
  }
  return ownsAll;
};
