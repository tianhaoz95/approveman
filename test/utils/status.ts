import { APP_CHECK_NAME } from "../../src/utils/config";
import { StatusCodes } from "http-status-codes";
import { getGitHubAPIEndpoint } from "./endpoint";
import nock from "nock";

export const checkSuccessStatus = (): void => {
  nock(getGitHubAPIEndpoint())
    .post(
      "/repos/tianhaoz95/approveman-test/check-runs",
      (body: Record<string, unknown>) => {
        expect(body).toMatchObject({
          conclusion: "success",
          name: APP_CHECK_NAME,
          status: "completed",
        });
        expect(body["started_at"]).not.toBeDefined();
        expect(body["completed_at"]).toBeDefined();
        return true;
      },
    )
    .reply(StatusCodes.CREATED);
};

export const checkStartedStatus = (): void => {
  nock(getGitHubAPIEndpoint())
    .post(
      "/repos/tianhaoz95/approveman-test/check-runs",
      (body: Record<string, unknown>) => {
        expect(body).toMatchObject({
          name: APP_CHECK_NAME,
          status: "in_progress",
        });
        expect(body["started_at"]).toBeDefined();
        expect(body["completed_at"]).not.toBeDefined();
        return true;
      },
    )
    .reply(StatusCodes.CREATED);
};

export const checkCrashStatus = (): void => {
  nock(getGitHubAPIEndpoint())
    .post(
      "/repos/tianhaoz95/approveman-test/check-runs",
      (body: Record<string, unknown>) => {
        expect(body).toMatchObject({
          conclusion: "failure",
          name: APP_CHECK_NAME,
          status: "completed",
        });
        expect(body["started_at"]).not.toBeDefined();
        expect(body["completed_at"]).toBeDefined();
        return true;
      },
    )
    .reply(StatusCodes.CREATED);
};
