import prFromBlacklistedUser from "./pr.json";

const prFromBlacklistedUserOpenedPayload: Record<
  string,
  unknown
> = Object.assign({}, prFromBlacklistedUser) as Record<string, unknown>;
prFromBlacklistedUserOpenedPayload["action"] = "opened";

const prFromBlacklistedUserReopenedPayload: Record<
  string,
  unknown
> = Object.assign({}, prFromBlacklistedUser) as Record<string, unknown>;
prFromBlacklistedUserReopenedPayload["action"] = "reopened";

const prFromBlacklistedUserSynchronizePayload: Record<
  string,
  unknown
> = Object.assign({}, prFromBlacklistedUser) as Record<string, unknown>;
prFromBlacklistedUserSynchronizePayload["action"] = "synchronize";

export {
  prFromBlacklistedUserOpenedPayload,
  prFromBlacklistedUserReopenedPayload,
  prFromBlacklistedUserSynchronizePayload,
};
