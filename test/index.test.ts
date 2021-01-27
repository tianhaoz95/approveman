import { Probot, ProbotOctokit } from "probot";
import {
  checkApproved,
  setSinglePreviousReview,
  verifyReviewDismissed,
} from "./utils/review";
import {
  checkCrashStatus,
  checkNeutralStatus,
  checkStartedStatus,
  checkSuccessStatus,
} from "./utils/status";
import {
  prFromBlacklistedUserOpenedPayload,
  prFromBlacklistedUserReopenedPayload,
  prFromBlacklistedUserSynchronizePayload,
} from "./fixtures/payloads/blacklist_user";
import {
  prOpenedPayload,
  prReopenedPayload,
  prSynchronizePayload,
} from "./fixtures/payloads/basic";
import { setConfigNotFound, setConfigToBasic } from "./utils/config";
import { TEST_TIMEOUT } from "./utils/jest";
import approvemanApp from "../src";
import fs from "fs";
import nock from "nock";
import path from "path";
import { setPullRequestFiles } from "./utils/files";

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
    
    // Temporarily comment this out because it is resetting some internal
    // states of Probot that are needed between test runs.
    //
    // TODO(tianhaoz95): investigate where can this be added back to make
    // the tests more reliable.
    // 
    // jest.resetModules();

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
      logLevel: "trace",
      privateKey: mockCert,
    });
    approvemanApp(probot);
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
    setPullRequestFiles(["playground/tianhaoz95/test.md"]);
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
    setPullRequestFiles(["playground/tianhaoz95/test.md"]);
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
    setPullRequestFiles(["playground/tianhaoz95/test.md"]);
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
    setPullRequestFiles(["docs/personal/tianhaoz95/test.md"]);
    await probot.receive({
      id: "test_id",
      name: "pull_request",
      payload: prOpenedPayload,
    });
  });

  test("rules not satisfied", async () => {
    setConfigToBasic("basic");
    checkNeutralStatus();
    setPullRequestFiles(["some/random/file.md"]);
    setSinglePreviousReview();
    verifyReviewDismissed();
    await probot.receive({
      id: "test_id",
      name: "pull_request",
      payload: prOpenedPayload,
    });
  });

  test("contains not satisfied files", async () => {
    setConfigToBasic("basic");
    checkNeutralStatus();
    setPullRequestFiles([
      "some/random/file.md",
      "playground/tianhaoz95/README.md",
      "playground/tianhaoz95/development.md",
    ]);
    setSinglePreviousReview();
    verifyReviewDismissed();
    await probot.receive({
      id: "test_id",
      name: "pull_request",
      payload: prOpenedPayload,
    });
  });

  test("blocks pr opened by globally blacklisted user", async () => {
    setConfigToBasic("basic");
    checkNeutralStatus();
    setPullRequestFiles([
      "some/random/file.md",
      "playground/tianhaoz95/README.md",
      "playground/tianhaoz95/development.md",
    ]);
    setSinglePreviousReview();
    verifyReviewDismissed();
    await probot.receive({
      id: "test_id",
      name: "pull_request",
      payload: prFromBlacklistedUserOpenedPayload,
    });
  });

  test("blocks pr reopened by globally blacklisted user", async () => {
    setConfigToBasic("basic");
    checkNeutralStatus();
    setPullRequestFiles([
      "some/random/file.md",
      "playground/tianhaoz95/README.md",
      "playground/tianhaoz95/development.md",
    ]);
    setSinglePreviousReview();
    verifyReviewDismissed();
    await probot.receive({
      id: "test_id",
      name: "pull_request",
      payload: prFromBlacklistedUserReopenedPayload,
    });
  });

  test("blocks pr sync by globally blacklisted user", async () => {
    setConfigToBasic("basic");
    checkNeutralStatus();
    setPullRequestFiles([
      "some/random/file.md",
      "playground/tianhaoz95/README.md",
      "playground/tianhaoz95/development.md",
    ]);
    setSinglePreviousReview();
    verifyReviewDismissed();
    await probot.receive({
      id: "test_id",
      name: "pull_request",
      payload: prFromBlacklistedUserSynchronizePayload,
    });
  });

  test("contains files in under other username", async () => {
    setConfigToBasic("basic");
    checkNeutralStatus();
    setPullRequestFiles([
      "playground/tianhaoz95/README.md",
      "playground/tianhaoz95/development.md",
      "playground/otherid/README.md",
    ]);
    setSinglePreviousReview();
    verifyReviewDismissed();
    await probot.receive({
      id: "test_id",
      name: "pull_request",
      payload: prOpenedPayload,
    });
  });

  test("block not allowed files", async () => {
    setConfigToBasic("basic");
    checkNeutralStatus();
    setPullRequestFiles([".github/config.yml"]);
    setSinglePreviousReview();
    verifyReviewDismissed();
    await probot.receive({
      id: "test_id",
      name: "pull_request",
      payload: prOpenedPayload,
    });
  });

  test("block partially not allowed files", async () => {
    setConfigToBasic("basic");
    checkNeutralStatus();
    setPullRequestFiles([
      ".github/config.yml",
      "playground/tianhaoz95/README.md",
    ]);
    setSinglePreviousReview();
    verifyReviewDismissed();
    await probot.receive({
      id: "test_id",
      name: "pull_request",
      payload: prOpenedPayload,
    });
  });

  test("approve empty file set", async () => {
    setConfigToBasic("basic");
    checkSuccessStatus();
    setPullRequestFiles([]);
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
