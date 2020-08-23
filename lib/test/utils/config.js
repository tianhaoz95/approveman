"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setConfigNotFound = exports.setConfigToBasic = void 0;
var nock_1 = __importDefault(require("nock"));
var fs = require('fs');
var path = require('path');
function setConfigToBasic(configId) {
    var rawContent = fs.readFileSync(path.join(__dirname, '..', 'fixtures', 'config', configId + ".yml"));
    var contentBuf = Buffer.from(rawContent);
    var encodedContent = contentBuf.toString('base64');
    nock_1.default('https://api.github.com')
        .get('/repos/tianhaoz95/.github/contents/.github/approveman.yml')
        .reply(200, {
        type: 'file',
        encoding: 'base64',
        size: encodedContent.length,
        name: 'approveman.yml',
        path: '.github/contents/.github/approveman.yml',
        content: encodedContent
    });
    nock_1.default('https://api.github.com')
        .get('/repos/tianhaoz95/approveman-test/contents/.github/approveman.yml')
        .reply(404);
}
exports.setConfigToBasic = setConfigToBasic;
function setConfigNotFound() {
    nock_1.default('https://api.github.com')
        .get('/repos/tianhaoz95/.github/contents/.github/approveman.yml')
        .reply(404);
    nock_1.default('https://api.github.com')
        .get('/repos/tianhaoz95/approveman-test/contents/.github/approveman.yml')
        .reply(404);
}
exports.setConfigNotFound = setConfigNotFound;
//# sourceMappingURL=config.js.map