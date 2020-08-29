import { isAllowedFile, containsNotAllowedFile } from ".";

describe("Rule matcher tests", () => {
  test("identify single GitHub workflow", () => {
    expect(isAllowedFile(".github/workflows/test.yml")).toBe(false);
  });

  test("identify single GitHub config", () => {
    expect(isAllowedFile(".github/config.yml")).toBe(false);
  });

  test("identify third party GitHub workflow", () => {
    expect(isAllowedFile("third_party/subproject/.github/workflows/test.yml")).toBe(false);
  });

  test("identify third party GitHub config", () => {
    expect(isAllowedFile("third_party/subproject/.github/config.yml")).toBe(false);
  });

  test("identify normal files", () => {
    expect(isAllowedFile("src/app/config.yml")).toBe(true);
  });

  test("identify GitHub config from file list", () => {
    const fileList = [
      ".github/config.yml",
      "src/index.ts",
      "package.json",
      "src/tools/octokit.ts"
    ];
    expect(containsNotAllowedFile(fileList)).toBe(true);
  });

  test("allow file list with only normal files", () => {
    const fileList = [
      "src/index.ts",
      "package.json",
      "src/tools/octokit.ts"
    ];
    expect(containsNotAllowedFile(fileList)).toBe(false);
  });
});
