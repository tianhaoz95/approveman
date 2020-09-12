import { StatusCodes } from "http-status-codes";
import { getGitHubAPIEndpoint } from "./endpoint";
import nock from "nock";

export const returnGitHubToken = (): void => {
  nock(getGitHubAPIEndpoint())
    .post("/app/installations/1/access_tokens")
    .reply(StatusCodes.OK, { token: "test" });
};
