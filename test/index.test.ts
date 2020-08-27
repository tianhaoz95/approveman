import nock from "nock";
import approvemanApp from "../src";
import { Probot } from "probot";
import prGeneric from "./fixtures/basic/pr.json";
import { setConfigToBasic, setConfigNotFound } from "./utils/config";
import { checkSuccessStatus } from "./utils/status";
import {
  checkApproved,
  setSinglePreviousReview,
  verifyReviewDismissed,
} from "./utils/review";
const fs = require("fs");
const path = require("path");

jest.setTimeout(30000);

const prOpenedPayload: any = prGeneric;
prOpenedPayload.action = "opened";
const prReopenedPayload: any = prGeneric;
prOpenedPayload.action = "reopened";
const prSynchronizePayload: any = prGeneric;
prOpenedPayload.action = "synchronize";

describe("Approveman tests", () => {
  let probot: any;
  let mockCert: string;

  beforeAll((done: Function) => {
    fs.readFile(
      path.join(__dirname, "fixtures/mock-cert.pem"),
      (err: Error, cert: string) => {
        if (err) return done(err);
        mockCert = cert;
        done();
      },
    );
  });

  beforeEach(() => {
    nock.disableNetConnect();
    probot = new Probot({ id: 123, cert: mockCert });
    probot.load(approvemanApp);
  });

  test("receive PR reopened", async () => {
    setConfigNotFound();
    checkApproved();
    checkSuccessStatus();
    nock("https://api.github.com")
      .get("/repos/tianhaoz95/approveman-test/pulls/1/files")
      .reply(200, [{ filename: "experimental/tianhaoz95/test.md" }]);
    await probot.receive({ name: "pull_request", payload: prReopenedPayload });
  });

  test("receive PR synchronize", async () => {
    setConfigNotFound();
    checkApproved();
    checkSuccessStatus();
    nock("https://api.github.com")
      .get("/repos/tianhaoz95/approveman-test/pulls/1/files")
      .reply(200, [{ filename: "experimental/tianhaoz95/test.md" }]);
    await probot.receive({
      name: "pull_request",
      payload: prSynchronizePayload,
    });
  });

  test("receive PR opened", async () => {
    setConfigNotFound();
    checkApproved();
    checkSuccessStatus();
    nock("https://api.github.com")
      .get("/repos/tianhaoz95/approveman-test/pulls/1/files")
      .reply(200, [{ filename: "experimental/tianhaoz95/test.md" }]);
    await probot.receive({ name: "pull_request", payload: prOpenedPayload });
  });

  test("read config", async () => {
    setConfigToBasic("basic");
    checkApproved();
    checkSuccessStatus();
    nock("https://api.github.com")
      .get("/repos/tianhaoz95/approveman-test/pulls/1/files")
      .reply(200, [{ filename: "docs/personal/tianhaoz95/test.md" }]);
    await probot.receive({ name: "pull_request", payload: prOpenedPayload });
  });

  test("rules not satisfied", async () => {
    setConfigToBasic("basic");
    checkApproved();
    checkSuccessStatus();
    nock("https://api.github.com")
      .get("/repos/tianhaoz95/approveman-test/pulls/1/files")
      .reply(200, [{ filename: "some/random/file.md" }]);
    setSinglePreviousReview();
    verifyReviewDismissed();
    await probot.receive({ name: "pull_request", payload: prOpenedPayload });
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });
});
