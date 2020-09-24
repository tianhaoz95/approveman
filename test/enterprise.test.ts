import { Probot, ProbotOctokit } from "probot";
import {
  checkApproved,
  setSinglePreviousReview,
  verifyReviewDismissed,
} from "./utils/review";
import {
  checkNeutralStatus,
  checkStartedStatus,
  checkSuccessStatus,
} from "./utils/status";
import { prOpenedPayload, prReopenedPayload } from "./fixtures/payloads/basic";
import { setConfigNotFound, setConfigToBasic } from "./utils/config";
import { StatusCodes } from "http-status-codes";
import { TEST_TIMEOUT } from "./utils/jest";
import approvemanApp from "../src";
import fs from "fs";
import { getAppActorName } from "../src/utils/config";
import { getGitHubAPIEndpoint } from "./utils/endpoint";
import nock from "nock";
import path from "path";

/* eslint-disable */
jest.setTimeout(TEST_TIMEOUT);
/* eslint-enable */

describe("Approveman tests", () => {
  let probot: Probot;
  let mockCert: string;
  const defaultEnv = process.env;

  beforeAll((done: jest.DoneCallback) => {
    const mockCertLocation = path.join(__dirname, "fixtures/mock-cert.pem");
    /* eslint-disable security/detect-non-literal-fs-filename */
    fs.readFile(
      mockCertLocation,
      (err: NodeJS.ErrnoException | null, cert: Buffer) => {
        if (err) {
          return done(err);
        }
        mockCert = cert.toString();
        done();
      },
    );
    /* eslint-enable security/detect-non-literal-fs-filename */
  });

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
    nock.disableNetConnect();
  });

  afterEach(() => {
    // Restore the default environment variables
    // stored in beforeEach.
    process.env = defaultEnv;
    nock.cleanAll();
    nock.enableNetConnect();
  });

  test("enterprise without actor name should fail early", async () => {
    process.env["GHE_HOST"] = "github.example.com";
    expect(() => {
      probot = new Probot({
        Octokit: ProbotOctokit.defaults({
          retry: { enabled: false },
          throttle: { enabled: false },
        }),
        githubToken: "test",
        id: 1,
        privateKey: mockCert,
      });
      probot.load(approvemanApp);
    }).toThrow();
  });

  test("enterprise functions properly after actor name set", async () => {
    process.env["GHE_HOST"] = "github.example.com";
    process.env["APP_ACTOR_NAME_OVERRIDE"] = "test_actor_name";
    probot = new Probot({
      Octokit: ProbotOctokit.defaults({
        retry: { enabled: false },
        throttle: { enabled: false },
      }),
      githubToken: "test",
      id: 1,
      privateKey: mockCert,
    });
    probot.load(approvemanApp);
    checkStartedStatus();
    setConfigNotFound();
    checkApproved();
    checkSuccessStatus();
    nock(getGitHubAPIEndpoint())
      .get("/repos/tianhaoz95/approveman-test/pulls/1/files")
      .reply(StatusCodes.OK, [{ filename: "playground/tianhaoz95/test.md" }]);
    await probot.receive({
      id: "test_id",
      name: "pull_request",
      payload: prReopenedPayload,
    });
  });

  test("enterprise dismisses approvals properly after actor name set", async () => {
    process.env["GHE_HOST"] = "github.example.com";
    process.env["APP_ACTOR_NAME_OVERRIDE"] = "test_actor_name";
    probot = new Probot({
      Octokit: ProbotOctokit.defaults({
        retry: { enabled: false },
        throttle: { enabled: false },
      }),
      githubToken: "test",
      id: 1,
      privateKey: mockCert,
    });
    probot.load(approvemanApp);
    checkStartedStatus();
    setConfigToBasic("basic");
    checkNeutralStatus();
    nock(getGitHubAPIEndpoint())
      .get("/repos/tianhaoz95/approveman-test/pulls/1/files")
      .reply(StatusCodes.OK, [{ filename: "some/random/file.md" }]);
    setSinglePreviousReview();
    verifyReviewDismissed();
    expect(getAppActorName()).not.toMatch("approveman[bot]");
    await probot.receive({
      id: "test_id",
      name: "pull_request",
      payload: prOpenedPayload,
    });
  });
});
