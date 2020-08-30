import nock from "nock";
import approvemanApp from "../src";
import { Probot } from "probot";
import { prReopenedPayload, prSynchronizePayload, prOpenedPayload } from "./fixtures/payloads/basic";
import { setConfigToBasic, setConfigNotFound } from "./utils/config";
import { checkSuccessStatus } from "./utils/status";
import {
  checkApproved,
  setSinglePreviousReview,
  verifyReviewDismissed
} from "./utils/review";
import fs from "fs";
import path from "path";
import { StatusCodes } from "http-status-codes";
import { TEST_TIMEOUT } from "./utils/jest";

/* eslint-disable */
jest.setTimeout(TEST_TIMEOUT);
/* eslint-enable */

describe("Approveman tests", () => {
  let probot: Probot;
  let mockCert: string;

  beforeAll((done: jest.DoneCallback,) => {
    const mockCertLocation = path.join(__dirname, "fixtures/mock-cert.pem",);
    /* eslint-disable security/detect-non-literal-fs-filename */
    fs.readFile(
      mockCertLocation,
      (err: NodeJS.ErrnoException | null, cert: Buffer,) => {
        if (err) {
          return done(err,);
        }
        mockCert = cert.toString();
        done();
      },
    );
    /* eslint-enable security/detect-non-literal-fs-filename */
  },);

  beforeEach(() => {
    nock.disableNetConnect();
    probot = new Probot({ id: 123, cert: mockCert, },);
    probot.load(approvemanApp,);
  },);

  test("receive PR reopened", async () => {
    setConfigNotFound();
    checkApproved();
    checkSuccessStatus();
    nock("https://api.github.com",)
      .get("/repos/tianhaoz95/approveman-test/pulls/1/files",)
      .reply(StatusCodes.OK, [{ filename: "playground/tianhaoz95/test.md", }],);
    await probot.receive({
      id: "test_id",
      name: "pull_request",
      payload: prReopenedPayload,
    },);
  },);

  test("receive PR synchronize", async () => {
    setConfigNotFound();
    checkApproved();
    checkSuccessStatus();
    nock("https://api.github.com",)
      .get("/repos/tianhaoz95/approveman-test/pulls/1/files",)
      .reply(StatusCodes.OK, [{ filename: "playground/tianhaoz95/test.md", }],);
    await probot.receive({
      id: "test_id",
      name: "pull_request",
      payload: prSynchronizePayload,
    },);
  },);

  test("receive PR opened", async () => {
    setConfigNotFound();
    checkApproved();
    checkSuccessStatus();
    nock("https://api.github.com",)
      .get("/repos/tianhaoz95/approveman-test/pulls/1/files",)
      .reply(StatusCodes.OK, [{ filename: "playground/tianhaoz95/test.md", }],);
    await probot.receive({
      id: "test_id",
      name: "pull_request",
      payload: prOpenedPayload,
    },);
  },);

  test("read config", async () => {
    setConfigToBasic("basic",);
    checkApproved();
    checkSuccessStatus();
    nock("https://api.github.com",)
      .get("/repos/tianhaoz95/approveman-test/pulls/1/files",)
      .reply(StatusCodes.OK, [
        { filename: "docs/personal/tianhaoz95/test.md", },
      ],);
    await probot.receive({
      id: "test_id",
      name: "pull_request",
      payload: prOpenedPayload,
    },);
  },);

  test("rules not satisfied", async () => {
    setConfigToBasic("basic",);
    checkSuccessStatus();
    nock("https://api.github.com",)
      .get("/repos/tianhaoz95/approveman-test/pulls/1/files",)
      .reply(StatusCodes.OK, [{ filename: "some/random/file.md", }],);
    setSinglePreviousReview();
    verifyReviewDismissed();
    await probot.receive({
      id: "test_id",
      name: "pull_request",
      payload: prOpenedPayload,
    },);
  },);

  test("block not allowed files", async () => {
    checkSuccessStatus();
    nock("https://api.github.com",)
      .get("/repos/tianhaoz95/approveman-test/pulls/1/files",)
      .reply(StatusCodes.OK, [{ filename: ".github/config.yml", }],);
    setSinglePreviousReview();
    verifyReviewDismissed();
    await probot.receive({
      id: "test_id",
      name: "pull_request",
      payload: prOpenedPayload,
    },);
  },);

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  },);
},);
