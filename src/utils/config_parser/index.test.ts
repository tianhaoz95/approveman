import { getOwnershipRules, parseOwnershipRules } from ".";
import { setConfigNotFound } from "../../../test/utils/config";

describe("config parser tests", () => {
  test("returns default config if no context", async () => {
    setConfigNotFound();
    const config = await getOwnershipRules(null);
    expect(config).toBeDefined();
  });

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
