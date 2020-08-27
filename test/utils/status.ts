import nock from "nock";
import { APP_CHECK_NAME } from "../../src/config";

export function checkSuccessStatus(): void {
  nock("https://api.github.com")
    .post("/repos/tianhaoz95/approveman-test/check-runs", (body: any) => {
      expect(body).toMatchObject({
        name: APP_CHECK_NAME,
        status: "completed",
        conclusion: "success",
      });
      return true;
    })
    .reply(201);
}
