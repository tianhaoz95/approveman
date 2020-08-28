import { Context } from "probot"; // eslint-disable-line no-unused-vars
import { DirectoryMatchingRule, UserInfo } from "../types"; // eslint-disable-line no-unused-vars
import Mustache from "mustache";
import minimatch from "minimatch";

const matchRule = (
  rule: DirectoryMatchingRule,
  filename: string,
  info: UserInfo,
  context: Context,
): boolean => {
  const renderedRule = Mustache.render(rule.path, info);
  context.log.info(`Rendered rules to ${renderedRule}`);
  const isMatch = minimatch(filename, renderedRule);
  context.log.info(
    `File ${filename} and rule ${renderedRule} matching result is ${isMatch}`,
  );
  return isMatch;
};

const matchOneOfRules = (
  rules: DirectoryMatchingRule[],
  filename: string,
  info: UserInfo,
  context: Context,
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
  context: Context,
): boolean => {
  let ownsAll = true;
  for (const filename of filenames) {
    if (!matchOneOfRules(rules, filename, info, context)) {
      ownsAll = false;
    }
  }
  return ownsAll;
};
