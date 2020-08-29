import prGeneric from "./pr.json";

const prOpenedPayload: Record<string, unknown> = prGeneric;
prOpenedPayload["action"] = "opened";

const prReopenedPayload: Record<string, unknown> = prGeneric;
prOpenedPayload["action"] = "reopened";

const prSynchronizePayload: Record<string, unknown> = prGeneric;
prOpenedPayload["action"] = "synchronize";

export { prOpenedPayload, prReopenedPayload, prSynchronizePayload};

