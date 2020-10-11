export interface UserInfo {
  username: string;
}

export interface DirectoryMatchingRule {
  name: string;
  path: string;
}

export interface OwnershipRules {
  /**
   * This field indicates if changes inside the .github directory
   * is allowed. To make sure the shared repository configuration
   * is safe, this is disabled by default.
   */
  allowDotGitHub: boolean;
  directoryMatchingRules: DirectoryMatchingRule[];
}

export interface ReviewLookupResult {
  hasReview: boolean;
  reviewIds: number[];
}

export type ReviewEvent = "APPROVE" | "REQUEST_CHANGES" | "COMMENT" | undefined;
