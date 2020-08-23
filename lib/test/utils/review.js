"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyReviewDismissed = exports.setSinglePreviousReview = exports.setPreviousReviews = exports.checkApproved = void 0;
var nock_1 = __importDefault(require("nock"));
var msg_composer_1 = require("../../src/msg_composer");
function checkApproved(done, pullNumber) {
    if (pullNumber === void 0) { pullNumber = 1; }
    nock_1.default('https://api.github.com')
        .post("/repos/tianhaoz95/approveman-test/pulls/" + pullNumber + "/reviews", function (body) {
        done(expect(body).toMatchObject({
            event: 'APPROVE'
        }));
        return true;
    })
        .reply(200);
}
exports.checkApproved = checkApproved;
function setPreviousReviews(reviews) {
    nock_1.default('https://api.github.com')
        .get('/repos/tianhaoz95/approveman-test/pulls/1/reviews')
        .reply(200, reviews);
}
exports.setPreviousReviews = setPreviousReviews;
function setSinglePreviousReview() {
    setPreviousReviews([
        {
            id: 1,
            user: {
                login: 'approveman[bot]'
            },
            state: 'APPROVED'
        }
    ]);
}
exports.setSinglePreviousReview = setSinglePreviousReview;
function verifyReviewDismissed(done, reviewId, pullNumber) {
    if (reviewId === void 0) { reviewId = 1; }
    if (pullNumber === void 0) { pullNumber = 1; }
    nock_1.default('https://api.github.com')
        .put("/repos/tianhaoz95/approveman-test/pulls/" + pullNumber + "/reviews/" + reviewId + "/dismissals", function (body) {
        done(expect(body).toMatchObject({
            message: msg_composer_1.composeReviewDismissalMsg()
        }));
        return true;
    })
        .reply(200);
}
exports.verifyReviewDismissed = verifyReviewDismissed;
//# sourceMappingURL=review.js.map