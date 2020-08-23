/// <reference types="jest" />
export declare function checkApproved(done: jest.DoneCallback, pullNumber?: Number): void;
export declare function setPreviousReviews(reviews: any[]): void;
export declare function setSinglePreviousReview(): void;
export declare function verifyReviewDismissed(done: jest.DoneCallback, reviewId?: Number, pullNumber?: Number): void;
