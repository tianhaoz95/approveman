import { Context } from "probot"; // eslint-disable-line no-unused-vars
import { DirectoryMatchingRule, UserInfo } from "../types"; // eslint-disable-line no-unused-vars
import Mustache from "mustache";
import minimatch from "minimatch";
import { NOT_ALLOWED_FILES } from "../config";

const matchRule = (
  rule: DirectoryMatchingRule,
  filename: string,
  info: UserInfo,
  context: Context | null
): boolean => {
  const renderedRule = Mustache.render(rule.path, info);
  context?.log.info(`Rendered rules to ${renderedRule}`);
  const isMatch = minimatch(filename, renderedRule);
  context?.log.info(
    `File ${filename} and rule ${renderedRule} matching result is ${isMatch}`,
  );
  return isMatch;
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
  context: Context | null
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
  context: Context | null
): boolean => {
  let ownsAll = true;
  for (const filename of filenames) {
    if (!matchOneOfRules(rules, filename, info, context)) {
      ownsAll = false;
    }
  }
  return ownsAll;
};
