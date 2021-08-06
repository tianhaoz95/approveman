/* eslint-disable @typescript-eslint/no-unused-vars */
import { OwnershipRules } from "../types";
/* eslint-enable @typescript-eslint/no-unused-vars */
import { isUserAllowed } from "./allowed_user";

describe("Specified allowed user checker tests", () => {
  const rules: OwnershipRules = {
    allowDotGitHub: true,
    directoryMatchingRules: [],
    globalAllowedUsers: ["good_user_1", "good_user_2", "bad_user_2"],
    globalBlacklistedUsers: [],
  };

  test("should not crash", () => {
    expect(() => {
      isUserAllowed("unknown_user", rules);
    }).not.toThrow();
  });

  test("should block unknown users", () => {
    expect(isUserAllowed("unknown_user", rules)).toBeFalsy();
  });

  test("should allow good users", () => {
    expect(isUserAllowed("good_user_1", rules)).toBeTruthy();
  });
});

describe("No allowed user checker tests", () => {
  const rules: OwnershipRules = {
    allowDotGitHub: true,
    directoryMatchingRules: [],
    globalAllowedUsers: [],
    globalBlacklistedUsers: [],
  };

  test("should not crash", () => {
    expect(() => {
      isUserAllowed("unknown_user", rules);
    }).not.toThrow();
  });

  test("should allow all users", () => {
    expect(isUserAllowed("unknown_user", rules)).toBeTruthy();
  });
});
