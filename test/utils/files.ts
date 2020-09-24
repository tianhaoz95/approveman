import { StatusCodes } from "http-status-codes";
import { getGitHubAPIEndpoint } from "./endpoint";
import nock from "nock";

export const setPullRequestFiles = (filenames: string[]): void => {
  const filesResponse: Record<string, string>[] = [];
  filenames.forEach((filename) => {
    filesResponse.push({ filename });
  });
  nock(getGitHubAPIEndpoint())
    .get("/repos/tianhaoz95/approveman-test/pulls/1/files")
    .reply(StatusCodes.OK, filesResponse);
};
