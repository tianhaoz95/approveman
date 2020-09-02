import { SUBMODULE_PREFIX } from "../fixtures/files";
import path from "path";

export const toSubmoduleFiles = (files: string[]): string[] => {
  const submoduleFiles: string[] = [];
  files.forEach((file) => {
    submoduleFiles.push(path.join(SUBMODULE_PREFIX, file));
  });
  return submoduleFiles;
};
