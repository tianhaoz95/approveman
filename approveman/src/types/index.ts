export interface UserInfo {
  username: string;
}

export interface DirectoryMatchingRule {
  name: string;
  path: string;
}

export interface OwnershipRules {
  directoryMatchingRules: DirectoryMatchingRule[];
}
