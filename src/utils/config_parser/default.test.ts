import { getDefaultOwnershipRules } from "./default";

describe("Rule matcher tests", () => {
  test("Default rules have correct content", () => {
    expect(getDefaultOwnershipRules().directoryMatchingRules[0].path,).toMatch("playground/{{username}}/**/*",);
  },);
},);
