import { Context } from 'probot';
import Webhooks from 'probot/node_modules/@octokit/webhooks';
export declare function dismissAllApprovals(context: Context<Webhooks.WebhookPayloadPullRequest>): Promise<void>;
export declare function maybeApproveChange(context: Context<Webhooks.WebhookPayloadPullRequest>): Promise<void>;
