import { parseOwnershipRules } from "./parser";

describe("Configuration parser tests", () => {
  test("parse basic config", () => {
    expect(
      parseOwnershipRules(
        {
          "ownership_rules": {
            "directory_matching_rules": [
              {
                "name": "test_rule_0",
                "path": "playground/{{username}}/*",
              },
            ],
          },
        },
        null,
      ),
    ).toBeDefined();
  });
});
