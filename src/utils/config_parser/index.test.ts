import { getOwnershipRules } from ".";
import { setConfigNotFound } from "../../../test/utils/config";

describe("config parser tests", () => {
  test("returns default config if no context", async () => {
    setConfigNotFound();
    const config = await getOwnershipRules(null);
    expect(config).toBeDefined();
  });
});
