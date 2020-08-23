import { Context } from 'probot';
import Webhooks from 'probot/node_modules/@octokit/webhooks';
import { DirectoryMatchingRule, UserInfo } from '../types';
export declare function ownsAllFiles(rules: DirectoryMatchingRule[], filenames: string[], info: UserInfo, context: Context<Webhooks.WebhookPayloadPullRequest>): boolean;
