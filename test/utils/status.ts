import { APP_CHECK_NAME } from "../../src/utils/config";
import { StatusCodes } from "http-status-codes";
import nock from "nock";

export const checkSuccessStatus = (): void => {
  nock("https://api.github.com")
    .post(
      "/repos/tianhaoz95/approveman-test/check-runs",
      (body: Record<string, unknown>) => {
        expect(body).toMatchObject({
          conclusion: "success",
          name: APP_CHECK_NAME,
          status: "completed",
        });
        return true;
      },
    )
    .reply(StatusCodes.CREATED);
};

export const checkStartedStatus = (): void => {
  nock("https://api.github.com")
    .post(
      "/repos/tianhaoz95/approveman-test/check-runs",
      (body: Record<string, unknown>) => {
        expect(body).toMatchObject({
          name: APP_CHECK_NAME,
          status: "in_progress",
        });
        return true;
      },
    )
    .reply(StatusCodes.CREATED);
};

export const checkCrashStatus = (): void => {
  nock("https://api.github.com")
    .post(
      "/repos/tianhaoz95/approveman-test/check-runs",
      (body: Record<string, unknown>) => {
        expect(body).toMatchObject({
          conclusion: "failure",
          name: APP_CHECK_NAME,
          status: "completed",
        });
        return true;
      },
    )
    .reply(StatusCodes.CREATED);
};
