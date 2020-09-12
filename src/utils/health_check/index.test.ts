import { Logger } from "tslog";
import { healthCheck } from ".";

describe("health check tests", () => {
  const defaultEnv = process.env;
  const log: Logger = new Logger();

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
      healthCheck(
        (msg) => {
          log.info(msg);
        },
        (msg) => {
          log.error(msg);
        },
      );
    }).not.toThrow();
  });

  test("fails GitHub Enterprise without actor name", () => {
    process.env["GHE_HOST"] = "github.example.com";
    expect(() => {
      healthCheck(
        (msg) => {
          log.info(msg);
        },
        (msg) => {
          log.error(msg);
        },
      );
    }).toThrow();
  });

  test("allows GitHub Enterprise with actor name", () => {
    process.env["GHE_HOST"] = "github.example.com";
    process.env["APP_ACTOR_NAME_OVERRIDE"] = "testapp";
    expect(() => {
      healthCheck(
        (msg) => {
          log.info(msg);
        },
        (msg) => {
          log.error(msg);
        },
      );
    }).not.toThrow();
  });
});
