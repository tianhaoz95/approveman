import {
  containsNotAllowedFile,
  getBlacklistedPatterns,
  isAllowedFile,
} from "./blacklist_patterns";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { OwnershipRules } from "../types";
/* eslint-enable @typescript-eslint/no-unused-vars */
import { getDefaultOwnershipRules } from "../config_parser/default";

describe("Blacklist pattern tests", () => {
  const rules: OwnershipRules = getDefaultOwnershipRules(true);
  const blacklistedPatterns: string[] = getBlacklistedPatterns(rules);
  test("block github config accordingly", () => {
    const rules = getDefaultOwnershipRules(false);
    rules.allowDotGitHub = false;
    expect(getBlacklistedPatterns(rules)).toContain("**/.github/**/*");
  });

  test("allow github config accordingly", () => {
    const rules = getDefaultOwnershipRules(false);
    rules.allowDotGitHub = true;
    expect(getBlacklistedPatterns(rules)).not.toContain("**/.github/**/*");
  });

  test("block github config by default", () => {
    const rules = getDefaultOwnershipRules(false);
    expect(getBlacklistedPatterns(rules)).toContain("**/.github/**/*");
  });

  test("identify single GitHub workflow", () => {
    expect(
      isAllowedFile(".github/workflows/test.yml", blacklistedPatterns),
    ).toBe(false);
  });

  test("identify single GitHub config", () => {
    expect(isAllowedFile(".github/config.yml", blacklistedPatterns)).toBe(
      false,
    );
  });

  test("identify third party GitHub workflow", () => {
    expect(
      isAllowedFile(
        "third_party/subproject/.github/workflows/test.yml",
        blacklistedPatterns,
      ),
    ).toBe(false);
  });

  test("identify third party GitHub config", () => {
    expect(
      isAllowedFile(
        "third_party/subproject/.github/config.yml",
        blacklistedPatterns,
      ),
    ).toBe(false);
  });

  test("identify normal files", () => {
    expect(isAllowedFile("src/app/config.yml", blacklistedPatterns)).toBe(true);
  });

  test("identify GitHub config from file list", () => {
    const fileList = [
      ".github/config.yml",
      "src/index.ts",
      "package.json",
      "src/tools/octokit.ts",
    ];
    expect(containsNotAllowedFile(fileList, rules)).toBe(true);
  });

  test("allow file list with only normal files", () => {
    const fileList = ["src/index.ts", "package.json", "src/tools/octokit.ts"];
    expect(containsNotAllowedFile(fileList, rules)).toBe(false);
  });
});
