import nock from "nock";
const fs = require("fs");
const path = require("path");

export function setConfigToBasic(configId: string): void {
  const rawContent = fs.readFileSync(
    path.join(__dirname, "..", "fixtures", "config", `${configId}.yml`),
  );
  const contentBuf = Buffer.from(rawContent);
  const encodedContent = contentBuf.toString("base64");
  nock("https://api.github.com")
    .get("/repos/tianhaoz95/.github/contents/.github/approveman.yml")
    .reply(200, {
      type: "file",
      encoding: "base64",
      size: encodedContent.length,
      name: "approveman.yml",
      path: ".github/contents/.github/approveman.yml",
      content: encodedContent,
    });
  nock("https://api.github.com")
    .get("/repos/tianhaoz95/approveman-test/contents/.github/approveman.yml")
    .reply(404);
}

export function setConfigNotFound(): void {
  nock("https://api.github.com")
    .get("/repos/tianhaoz95/.github/contents/.github/approveman.yml")
    .reply(404);
  nock("https://api.github.com")
    .get("/repos/tianhaoz95/approveman-test/contents/.github/approveman.yml")
    .reply(404);
}
