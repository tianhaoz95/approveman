/* eslint-disable @typescript-eslint/no-unused-vars */
import { Context } from "probot";
/* eslint-enable  @typescript-eslint/no-unused-vars*/

/**
 * Get all the files a pull request modifies.
 *
 * @param context The Probot context
 */
export const getChangedFiles = async (context: Context): Promise<string[]> => {
  const req = context.repo({
    "pull_number": context.payload.pull_request.number,
  });
  const changedFilesResponse = await context.octokit.pulls.listFiles(req);
  const changedFiles: string[] = [];
  for (const changedFileData of changedFilesResponse.data) {
    changedFiles.push(changedFileData.filename);
  }
  context.log.info(`Changed files are: ${JSON.stringify(changedFiles)}`);
  return changedFiles;
};
