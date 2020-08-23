"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var nock_1 = __importDefault(require("nock"));
var src_1 = __importDefault(require("../src"));
var probot_1 = require("probot");
var pr_opened_json_1 = __importDefault(require("./fixtures/basic/pr.opened.json"));
var pr_reopened_json_1 = __importDefault(require("./fixtures/basic/pr.reopened.json"));
var pr_synchronize_json_1 = __importDefault(require("./fixtures/basic/pr.synchronize.json"));
var config_1 = require("./utils/config");
var review_1 = require("./utils/review");
var fs = require('fs');
var path = require('path');
jest.setTimeout(30000);
describe('Approveman tests', function () {
    var probot;
    var mockCert;
    beforeAll(function (done) {
        fs.readFile(path.join(__dirname, 'fixtures/mock-cert.pem'), function (err, cert) {
            if (err)
                return done(err);
            mockCert = cert;
            done();
        });
    });
    beforeEach(function () {
        nock_1.default.disableNetConnect();
        probot = new probot_1.Probot({ id: 123, cert: mockCert });
        probot.load(src_1.default);
    });
    test('receive PR reopened', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    config_1.setConfigNotFound();
                    review_1.checkApproved(done);
                    nock_1.default('https://api.github.com')
                        .get('/repos/tianhaoz95/approveman-test/pulls/1/files')
                        .reply(200, [
                        { filename: 'experimental/tianhaoz95/test.md' }
                    ]);
                    return [4 /*yield*/, probot.receive({ name: 'pull_request', payload: pr_reopened_json_1.default })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    test('receive PR synchronize', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    config_1.setConfigNotFound();
                    review_1.checkApproved(done);
                    nock_1.default('https://api.github.com')
                        .get('/repos/tianhaoz95/approveman-test/pulls/1/files')
                        .reply(200, [
                        { filename: 'experimental/tianhaoz95/test.md' }
                    ]);
                    return [4 /*yield*/, probot.receive({ name: 'pull_request', payload: pr_synchronize_json_1.default })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    test('receive PR opened', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    config_1.setConfigNotFound();
                    review_1.checkApproved(done);
                    nock_1.default('https://api.github.com')
                        .get('/repos/tianhaoz95/approveman-test/pulls/1/files')
                        .reply(200, [
                        { filename: 'experimental/tianhaoz95/test.md' }
                    ]);
                    return [4 /*yield*/, probot.receive({ name: 'pull_request', payload: pr_opened_json_1.default })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    test('read config', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    config_1.setConfigToBasic('basic');
                    review_1.checkApproved(done);
                    nock_1.default('https://api.github.com')
                        .get('/repos/tianhaoz95/approveman-test/pulls/1/files')
                        .reply(200, [
                        { filename: 'docs/personal/tianhaoz95/test.md' }
                    ]);
                    return [4 /*yield*/, probot.receive({ name: 'pull_request', payload: pr_opened_json_1.default })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    test('rules not satisfied', function (done) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    config_1.setConfigToBasic('basic');
                    nock_1.default('https://api.github.com')
                        .get('/repos/tianhaoz95/approveman-test/pulls/1/files')
                        .reply(200, [
                        { filename: 'some/random/file.md' }
                    ]);
                    review_1.setSinglePreviousReview();
                    review_1.verifyReviewDismissed(done);
                    return [4 /*yield*/, probot.receive({ name: 'pull_request', payload: pr_opened_json_1.default })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterEach(function () {
        nock_1.default.cleanAll();
        nock_1.default.enableNetConnect();
    });
});
//# sourceMappingURL=index.test.js.map