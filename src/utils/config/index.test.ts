import { getAppActorName } from ".";

describe("config tests", () => {
  const defaultEnv = process.env;

  beforeEach(() => {
    // Clears the jest cache so that the environment will
    // not be contaminated between tests.
    /* eslint-disable */
    jest.resetModules();
    /* eslint-enable */
    // Makes a copy of the current environment variables
    // to keep the environment variables consistent across
    // tests.
    process.env = { ...defaultEnv };
  });

  afterEach(() => {
    // Restore the default environment variables
    // stored in beforeEach.
    process.env = defaultEnv;
  });

  test("sanity check", () => {
    expect(() => {
      getAppActorName();
    }).not.toThrow();
  });

  test("should by default return default name", () => {
    expect(getAppActorName()).toMatch("approveman[bot");
  });

  test("GitHub Enterprise without actor name should error out", () => {
    process.env["GHE_HOST"] = "github.example.com";
    expect(() => {
      getAppActorName();
    }).toThrow();
  });

  test("GitHub Enterprise with actor name should return that actor name", () => {
    process.env["GHE_HOST"] = "github.example.com";
    process.env["APP_ACTOR_NAME_OVERRIDE"] = "testapp";
    expect(getAppActorName()).toMatch("testapp");
  });
});
