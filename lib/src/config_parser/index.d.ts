import { Context } from 'probot';
import Webhooks from 'probot/node_modules/@octokit/webhooks';
import { OwnershipRules } from '../types';
export declare function parseOwnershipRules(rules: any, context: Context<Webhooks.WebhookPayloadPullRequest>): OwnershipRules;
export declare function getOwnershipRules(context: Context<Webhooks.WebhookPayloadPullRequest>): Promise<OwnershipRules>;
