import nock from "nock";
import { StatusCodes } from "http-status-codes";

export const returnGitHubToken = (): void => {
  nock("https://api.github.com")
    .post("/app/installations/1/access_tokens")
    .reply(StatusCodes.OK, { token: "test" });
};
