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
Object.defineProperty(exports, "__esModule", { value: true });
exports.maybeApproveChange = exports.dismissAllApprovals = void 0;
var config_parser_1 = require("../config_parser");
var rule_matcher_1 = require("../rule_matcher");
var msg_composer_1 = require("../msg_composer");
var config_1 = require("../config");
function getPullAuthor(context) {
    return context.payload.pull_request.user.login;
}
function getUserInfo(context) {
    var info = {
        username: getPullAuthor(context)
    };
    return info;
}
function initPullRelatedRequest(context) {
    var pullNumber = context.payload.pull_request.number;
    var repo = context.payload.repository.name;
    var owner = context.payload.repository.owner.login;
    context.log.info("Initializing pull related request with " + owner + "/" + repo + " #" + pullNumber);
    return { pull_number: pullNumber, owner: owner, repo: repo };
}
function approveChange(context) {
    return __awaiter(this, void 0, void 0, function () {
        var req, res, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    req = initPullRelatedRequest(context);
                    req.event = 'APPROVE';
                    context.log.info("Reviewing PR with request " + JSON.stringify(req));
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, context.github.pulls.createReview(req)];
                case 2:
                    res = _a.sent();
                    if (res.status === 200) {
                        context.log.info('Approve changes succeeded.');
                    }
                    else {
                        context.log.error("Approve change rejected with: " + JSON.stringify(res.data));
                    }
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    context.log.error("Approve change failed with: " + JSON.stringify(err_1));
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function createPassingStatus(context, startTime, endTime) {
    return __awaiter(this, void 0, void 0, function () {
        var statusOptions, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    statusOptions = context.repo({
                        name: config_1.APP_CHECK_NAME,
                        head_sha: context.payload.pull_request.head.sha,
                        status: 'completed',
                        started_at: startTime,
                        completed_at: endTime,
                        conclusion: 'success',
                        output: {
                            title: 'test',
                            summary: 'test',
                            text: 'test',
                        },
                        request: {
                            retries: 3,
                            retryAfter: 3,
                        },
                    });
                    return [4 /*yield*/, context.github.checks.create(statusOptions)];
                case 1:
                    response = _a.sent();
                    context.log.info("Create passing status finished with status " + response.status);
                    if (response.status !== 200) {
                        context.log.error("Create passing status failed with status " + response.status + " and error: " + JSON.stringify(response.data));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function getChangedFiles(context) {
    return __awaiter(this, void 0, void 0, function () {
        var changedFilesResponse, changedFiles, _i, _a, changedFileData;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, context.github.pulls.listFiles(initPullRelatedRequest(context))];
                case 1:
                    changedFilesResponse = _b.sent();
                    changedFiles = [];
                    for (_i = 0, _a = changedFilesResponse.data; _i < _a.length; _i++) {
                        changedFileData = _a[_i];
                        changedFiles.push(changedFileData.filename);
                    }
                    context.log.info("Changed files are: " + JSON.stringify(changedFiles));
                    return [2 /*return*/, changedFiles];
            }
        });
    });
}
function getPreviousReviewIds(context) {
    return __awaiter(this, void 0, void 0, function () {
        var reviewsResponse, hasReview, reviewIds;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, context.github.pulls.listReviews(initPullRelatedRequest(context))];
                case 1:
                    reviewsResponse = _a.sent();
                    hasReview = false;
                    reviewIds = [];
                    context.log.info("Found " + reviewsResponse.data.length + " reviews");
                    reviewsResponse.data.forEach(function (review) {
                        context.log.info(review.user.login);
                        if (review.user.login === 'approveman[bot]' && review.state !== 'DISMISSED') {
                            hasReview = true;
                            reviewIds.push(review.id);
                        }
                    });
                    return [2 /*return*/, { hasReview: hasReview, reviewIds: reviewIds }];
            }
        });
    });
}
function dismissApproval(context, reviewId) {
    return __awaiter(this, void 0, void 0, function () {
        var req, dismissResponse;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    req = initPullRelatedRequest(context);
                    req.review_id = reviewId;
                    req.message = msg_composer_1.composeReviewDismissalMsg();
                    context.log.info('Try to dismiss the review');
                    return [4 /*yield*/, context.github.pulls.dismissReview(req)];
                case 1:
                    dismissResponse = _a.sent();
                    context.log.info("Dissmiss review #" + reviewId + " in PR #" + req.pull_number + " with status " + dismissResponse.status + " and review state " + dismissResponse.data.state);
                    return [2 /*return*/];
            }
        });
    });
}
function dismissAllApprovals(context) {
    return __awaiter(this, void 0, void 0, function () {
        var reviewLookupResult, _i, _a, reviewId;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getPreviousReviewIds(context)];
                case 1:
                    reviewLookupResult = _b.sent();
                    _i = 0, _a = reviewLookupResult.reviewIds;
                    _b.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                    reviewId = _a[_i];
                    return [4 /*yield*/, dismissApproval(context, reviewId)];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    context.log.info("Dismissed " + reviewLookupResult.reviewIds.length + " reviews");
                    return [2 /*return*/];
            }
        });
    });
}
exports.dismissAllApprovals = dismissAllApprovals;
function maybeApproveChange(context) {
    return __awaiter(this, void 0, void 0, function () {
        var startTime, changedFiles, rules, endTime;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    startTime = new Date().toISOString();
                    return [4 /*yield*/, getChangedFiles(context)];
                case 1:
                    changedFiles = _a.sent();
                    context.log.info("Files changed in the pull request are " + JSON.stringify(changedFiles));
                    return [4 /*yield*/, config_parser_1.getOwnershipRules(context)];
                case 2:
                    rules = _a.sent();
                    context.log.info("Matching against rules: " + JSON.stringify(rules));
                    if (!rule_matcher_1.ownsAllFiles(rules.directoryMatchingRules, changedFiles, getUserInfo(context), context)) return [3 /*break*/, 5];
                    context.log.info('The user owns all modified files, approve PR.');
                    return [4 /*yield*/, approveChange(context)];
                case 3:
                    _a.sent();
                    endTime = new Date().toISOString();
                    return [4 /*yield*/, createPassingStatus(context, startTime, endTime)];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 5:
                    context.log.info('The user does not own all modified files. Undo previous approvals if any.');
                    return [4 /*yield*/, dismissAllApprovals(context)];
                case 6:
                    _a.sent();
                    context.log.info('All previous approvals dismissed');
                    _a.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.maybeApproveChange = maybeApproveChange;
//# sourceMappingURL=index.js.map