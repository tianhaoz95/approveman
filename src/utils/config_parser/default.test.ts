import { getDefaultOwnershipRules } from "./default";

describe("Rule matcher tests", () => {
  test("Default rules have correct content", () => {
    const defaultRuleIndex = 0;
    /* eslint-disable */
    expect(
      getDefaultOwnershipRules().directoryMatchingRules[defaultRuleIndex].path,
    ).toMatch("playground/{{username}}/**/*");
    /* eslint-enable */
  });
});
