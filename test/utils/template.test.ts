import { toSubmoduleFiles } from "./template";

describe("Templating test utility tests", () => {
    test("To submodule outputs correct content", () => {
        expect(toSubmoduleFiles(["test.md"])).toContain("third_party/submodule/test.md");
    });
});