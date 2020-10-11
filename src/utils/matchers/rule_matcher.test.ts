import { Logger } from "tslog";
import { matchRule } from "./rule_matchers";

describe("Rule matcher tests", () => {
  const log: Logger = new Logger({ minLevel: "error" });
  const log_msg = (msg: string): void => {
    log.info(msg);
  };

  test("should allow nested files to match", () => {
    expect(
      matchRule(
        { name: "test rule", path: "playground/{{username}}/**/*.md" },
        "playground/tianhaoz95/projects/project/test.md",
        { username: "tianhaoz95" },
        log_msg,
      ),
    ).toBe(true);
  });

  test("should allow nested dot directory to match", () => {
    expect(
      matchRule(
        { name: "test rule", path: "playground/{{username}}/**/*" },
        "playground/tianhaoz95/projects/.project/main.cc",
        { username: "tianhaoz95" },
        log_msg,
      ),
    ).toBe(true);
  });

  test("should allow nested dot file to match", () => {
    expect(
      matchRule(
        { name: "test rule", path: "playground/{{username}}/**/*" },
        "playground/tianhaoz95/projects/project/.gitignore",
        { username: "tianhaoz95" },
        log_msg,
      ),
    ).toBe(true);
  });

  test("should allow shallow files to match nested rule", () => {
    expect(
      matchRule(
        { name: "test rule", path: "playground/{{username}}/**/*.md" },
        "playground/tianhaoz95/test.md",
        { username: "tianhaoz95" },
        log_msg,
      ),
    ).toBe(true);
  });

  test("match rule filters correct filenames", () => {
    expect(
      matchRule(
        { name: "test rule", path: "playground/{{username}}/**/*.md" },
        "playground/tianhaoz95/test.md",
        { username: "tianhaoz95" },
        log_msg,
      ),
    ).toBe(true);
    expect(
      matchRule(
        { name: "test rule", path: "playground/{{username}}/**/*.md" },
        "other_location/tianhaoz95/test.md",
        { username: "tianhaoz95" },
        log_msg,
      ),
    ).toBe(false);
  });
});
