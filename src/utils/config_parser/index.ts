/* eslint-disable @typescript-eslint/no-unused-vars */
import { Context } from "probot";
/* eslint-enable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { OwnershipRules } from "../types";
/* eslint-enable @typescript-eslint/no-unused-vars */
import { getDefaultOwnershipRules } from "./default";
import { parseOwnershipRules } from "./parser";

export const getOwnershipRules = async (
  context: Context | null,
): Promise<OwnershipRules> => {
  const config = await context?.config("approveman.yml");
  context?.log.info(`Found config: ${JSON.stringify(config)}`);
  /* eslint-disable */
  if (config !== null && config !== undefined) {
    /* eslint-enable */
    return parseOwnershipRules(config as Record<string, unknown>, context);
  } else {
    return getDefaultOwnershipRules(true);
  }
};
