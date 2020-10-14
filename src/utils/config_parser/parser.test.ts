import { parseOwnershipRules } from "./parser";

/**
 * TODO(tianhaoz95): add a test for verifying that the parsed rules are correct.
 */
describe("Configuration parser tests", () => {
  const basicConfig: Record<string, unknown> = {
    "ownership_rules": {
      "allow_dot_github": "true",
      "directory_matching_rules": [
        {
          "name": "test_rule_0",
          "path": "test_0/{{username}}/*",
        },
        {
          "name": "test_rule_1",
          "path": "test_1/{{username}}/*",
        },
      ],
      "global_blacklisted_users": ["bad_user_1", "bad_user_2"],
    },
  };

  test("parse basic config no crash", () => {
    expect(() => {
      parseOwnershipRules(basicConfig, null);
    }).not.toThrow();
  });

  test("parse basic config has output", () => {
    expect(parseOwnershipRules(basicConfig, null)).toBeDefined();
  });

  test("parse basic config to correct allow dot github content", () => {
    const config = parseOwnershipRules(basicConfig, null);
    expect(config.allowDotGitHub).toBeTruthy();
  });

  test("parse basic config to correct global blacklist", () => {
    const config = parseOwnershipRules(basicConfig, null);
    const correctBlacklistedUserCount = 2;
    expect(config.globalBlacklistedUsers.length).toEqual(
      correctBlacklistedUserCount,
    );
    expect(config.globalBlacklistedUsers).toContain("bad_user_1");
    expect(config.globalBlacklistedUsers).toContain("bad_user_2");
  });
});
