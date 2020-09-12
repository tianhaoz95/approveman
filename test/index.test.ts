import { Probot, ProbotOctokit } from "probot";
import {
  checkApproved,
  setSinglePreviousReview,
  verifyReviewDismissed,
} from "./utils/review";
import {
  checkCrashStatus,
  checkStartedStatus,
  checkSuccessStatus,
} from "./utils/status";
import {
  prOpenedPayload,
  prReopenedPayload,
  prSynchronizePayload,
} from "./fixtures/payloads/basic";
import { setConfigNotFound, setConfigToBasic } from "./utils/config";
import { StatusCodes } from "http-status-codes";
import { TEST_TIMEOUT } from "./utils/jest";
import approvemanApp from "../src";
import fs from "fs";
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
    probot = new Probot({
      Octokit: ProbotOctokit.defaults({
        retry: { enabled: false },
        throttle: { enabled: false },
      }),
      githubToken: "test",
      id: 1,
      privateKey: mockCert,
    });
    const app = probot.load(approvemanApp);
    app.log.info("Test app constructed");
    checkStartedStatus();
  });

  afterEach(() => {
    // Restore the default environment variables
    // stored in beforeEach.
    process.env = defaultEnv;
    nock.cleanAll();
    nock.enableNetConnect();
  });

  test("receive PR reopened", async () => {
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

  test("receive PR synchronize", async () => {
    setConfigNotFound();
    checkApproved();
    checkSuccessStatus();
    nock(getGitHubAPIEndpoint())
      .get("/repos/tianhaoz95/approveman-test/pulls/1/files")
      .reply(StatusCodes.OK, [{ filename: "playground/tianhaoz95/test.md" }]);
    await probot.receive({
      id: "test_id",
      name: "pull_request",
      payload: prSynchronizePayload,
    });
  });

  test("receive PR opened", async () => {
    setConfigNotFound();
    checkApproved();
    checkSuccessStatus();
    nock(getGitHubAPIEndpoint())
      .get("/repos/tianhaoz95/approveman-test/pulls/1/files")
      .reply(StatusCodes.OK, [{ filename: "playground/tianhaoz95/test.md" }]);
    await probot.receive({
      id: "test_id",
      name: "pull_request",
      payload: prOpenedPayload,
    });
  });

  test("read config", async () => {
    setConfigToBasic("basic");
    checkApproved();
    checkSuccessStatus();
    nock(getGitHubAPIEndpoint())
      .get("/repos/tianhaoz95/approveman-test/pulls/1/files")
      .reply(StatusCodes.OK, [
        { filename: "docs/personal/tianhaoz95/test.md" },
      ]);
    await probot.receive({
      id: "test_id",
      name: "pull_request",
      payload: prOpenedPayload,
    });
  });

  test("rules not satisfied", async () => {
    setConfigToBasic("basic");
    checkSuccessStatus();
    nock(getGitHubAPIEndpoint())
      .get("/repos/tianhaoz95/approveman-test/pulls/1/files")
      .reply(StatusCodes.OK, [{ filename: "some/random/file.md" }]);
    setSinglePreviousReview();
    verifyReviewDismissed();
    await probot.receive({
      id: "test_id",
      name: "pull_request",
      payload: prOpenedPayload,
    });
  });

  test("block not allowed files", async () => {
    checkSuccessStatus();
    nock(getGitHubAPIEndpoint())
      .get("/repos/tianhaoz95/approveman-test/pulls/1/files")
      .reply(StatusCodes.OK, [{ filename: ".github/config.yml" }]);
    setSinglePreviousReview();
    verifyReviewDismissed();
    await probot.receive({
      id: "test_id",
      name: "pull_request",
      payload: prOpenedPayload,
    });
  });

  test("handle unknown error elegantly", async () => {
    checkCrashStatus();
    await probot.receive({
      id: "test_id",
      name: "pull_request",
      payload: "???",
    });
  });
});
