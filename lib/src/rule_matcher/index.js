"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ownsAllFiles = void 0;
var mustache_1 = __importDefault(require("mustache"));
var minimatch_1 = __importDefault(require("minimatch"));
function matchRule(rule, filename, info, context) {
    var renderedRule = mustache_1.default.render(rule.path, info);
    context.log.info("Rendered rules to " + renderedRule);
    var isMatch = minimatch_1.default(filename, renderedRule);
    context.log.info("File " + filename + " and rule " + renderedRule + " matching result is " + isMatch);
    return isMatch;
}
function matchOneOfRules(rules, filename, info, context) {
    var matchOneOf = false;
    for (var _i = 0, rules_1 = rules; _i < rules_1.length; _i++) {
        var rule = rules_1[_i];
        if (matchRule(rule, filename, info, context)) {
            matchOneOf = true;
        }
    }
    return matchOneOf;
}
function ownsAllFiles(rules, filenames, info, context) {
    var ownsAll = true;
    for (var _i = 0, filenames_1 = filenames; _i < filenames_1.length; _i++) {
        var filename = filenames_1[_i];
        if (!matchOneOfRules(rules, filename, info, context)) {
            ownsAll = false;
        }
    }
    return ownsAll;
}
exports.ownsAllFiles = ownsAllFiles;
//# sourceMappingURL=index.js.map