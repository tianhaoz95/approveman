import { Logger } from "tslog";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { OwnershipRules } from "../types";
/* eslint-enable @typescript-eslint/no-unused-vars */
import { getDefaultOwnershipRules } from "../config_parser/default";
import { ownsAllFiles } from ".";

describe("Rule matcher tests with default rules", () => {
  const rules: OwnershipRules = getDefaultOwnershipRules(true);
  const log: Logger = new Logger({ minLevel: "error" });

  const allowedFiles: string[] = [
    "playground/tianhaoz95/README.md",
    "playground/tianhaoz95/projects/project_1/README.md",
    "playground/tianhaoz95/projects/project_1/.gitignore",
    "playground/tianhaoz95/projects/project_1/.some_config.yml",
    "playground/tianhaoz95/projects/project_1/main.cc",
    "playground/tianhaoz95/projects/project_2/main.py",
    "playground/tianhaoz95/projects/project_2/main.dart",
  ];

  const disallowedFiles: string[] = [
    "projects/project_1/main.cc",
    "projects/project_1/.gitignore",
    "projects/project_2/main.py",
    "projects/project_3/main.dart",
  ];

  test("allow empty list", () => {
    expect(
      ownsAllFiles(
        rules.directoryMatchingRules,
        [],
        {
          username: "tianhaoz95",
        },
        (msg: string) => {
          log.trace(msg);
        },
      ),
    ).toBeTruthy();
  });

  test("allowed ok files", () => {
    expect(
      ownsAllFiles(
        rules.directoryMatchingRules,
        allowedFiles,
        {
          username: "tianhaoz95",
        },
        (msg: string) => {
          log.trace(msg);
        },
      ),
    ).toBeTruthy();
  });

  test("reject multiple disallowed files", () => {
    let files: string[] = [...allowedFiles];
    files = files.concat([...disallowedFiles]);
    expect(
      ownsAllFiles(
        rules.directoryMatchingRules,
        files,
        {
          username: "tianhaoz95",
        },
        (msg: string) => {
          log.trace(msg);
        },
      ),
    ).toBeFalsy();
  });

  test("partially disallowed files", () => {
    disallowedFiles.forEach((disallowedFilename: string) => {
      const files: string[] = [...allowedFiles];
      files.push(disallowedFilename);
      expect(
        ownsAllFiles(
          rules.directoryMatchingRules,
          files,
          {
            username: "tianhaoz95",
          },
          (msg: string) => {
            log.trace(msg);
          },
        ),
      ).toBeFalsy();
    });
  });
});
