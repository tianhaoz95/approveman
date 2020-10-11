import {
  GITHUB_REPOSITORY_CONFIG_FILE_PATTERN,
  MATCH_OPTIONS,
} from "../config";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { OwnershipRules } from "../types";
/* eslint-enable @typescript-eslint/no-unused-vars */
import minimatch from "minimatch";

/**
 * Get a list of filename patterns that are not allowed
 * reguardless of what is in the ownership rules.
 *
 * @param rules The rules from the config file.
 */
export const getBlacklistedPatterns = (rules: OwnershipRules): string[] => {
  const blacklistedPatterns: string[] = [];
  if (!rules.allowDotGitHub) {
    blacklistedPatterns.push(GITHUB_REPOSITORY_CONFIG_FILE_PATTERN);
  }
  return blacklistedPatterns;
};

export const isAllowedFile = (
  filename: string,
  blacklistedPatterns: string[],
): boolean => {
  let isAllowed = true;
  blacklistedPatterns.forEach((notAllowedFile) => {
    if (minimatch(filename, notAllowedFile, MATCH_OPTIONS)) {
      isAllowed = false;
    }
  });
  return isAllowed;
};

export const containsNotAllowedFile = (
  filenames: string[],
  rules: OwnershipRules,
): boolean => {
  let contains = false;
  const blacklistedPatterns = getBlacklistedPatterns(rules);
  filenames.forEach((filename) => {
    if (!isAllowedFile(filename, blacklistedPatterns)) {
      contains = true;
    }
  });
  return contains;
};
