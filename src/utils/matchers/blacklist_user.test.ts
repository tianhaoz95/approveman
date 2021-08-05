/* eslint-disable @typescript-eslint/no-unused-vars */
import { OwnershipRules } from "../types";
/* eslint-enable @typescript-eslint/no-unused-vars */
import { isUserBlacklisted } from "./blacklist_user";

describe("Blacklist user checker tests", () => {
  const rules: OwnershipRules = {
    allowDotGitHub: true,
    directoryMatchingRules: [],
    globalAllowedUsers: [],
    globalBlacklistedUsers: ["bad_user_1", "bad_user_2"],
  };

  test("should not crash", () => {
    expect(() => {
      isUserBlacklisted("good_user", rules);
    }).not.toThrow();
  });

  test("should block bad users", () => {
    expect(isUserBlacklisted("bad_user_1", rules)).toBeTruthy();
  });

  test("should allow good users", () => {
    expect(isUserBlacklisted("good_user", rules)).toBeFalsy();
  });
});
