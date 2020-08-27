import { Context, Octokit } from 'probot' // eslint-disable-line no-unused-vars
import Webhooks from 'probot/node_modules/@octokit/webhooks' // eslint-disable-line no-unused-vars
import { UserInfo, ReviewLookupResult } from '../types' // eslint-disable-line no-unused-vars
import { getOwnershipRules } from '../config_parser'
import { ownsAllFiles } from '../rule_matcher'
import { composeReviewDismissalMsg } from '../msg_composer'
import { APP_CHECK_NAME } from '../config'

function getPullAuthor(context: Context<Webhooks.WebhookPayloadPullRequest>): string {
  return context.payload.pull_request.user.login
}

function getUserInfo(context: Context<Webhooks.WebhookPayloadPullRequest>): UserInfo {
  const info: UserInfo = {
    username: getPullAuthor(context)
  }
  return info
}

function initPullRelatedRequest(context: Context<Webhooks.WebhookPayloadPullRequest>): any {
  const pullNumber = context.payload.pull_request.number
  const repo = context.payload.repository.name
  const owner = context.payload.repository.owner.login
  context.log.info(`Initializing pull related request with ${owner}/${repo} #${pullNumber}`)
  return { pull_number: pullNumber, owner, repo }
}

async function approveChange(context: Context<Webhooks.WebhookPayloadPullRequest>): Promise<void> {
  const req = initPullRelatedRequest(context)
  req.event = 'APPROVE'
  context.log.info(`Reviewing PR with request ${JSON.stringify(req)}`)
  try {
    const res = await context.github.pulls.createReview(req)
    if (res.status === 200) {
      context.log.info('Approve changes succeeded.')
    } else {
      context.log.error(`Approve change rejected with: ${JSON.stringify(res.data)}`)
    }
  } catch (err) {
    context.log.error(`Approve change failed with: ${JSON.stringify(err)}`)
  }
}

async function createPassingStatus(context: Context<Webhooks.WebhookPayloadPullRequest>, startTime: string, endTime: string): Promise<void> {
  const statusOptions: (Octokit.RequestOptions & Octokit.ChecksCreateParams) = context.repo({
    name: APP_CHECK_NAME,
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
  })
  const response = await context.github.checks.create(statusOptions);
  context.log.info(`Create passing status finished with status ${response.status}`);
  if (response.status !== 200) {
    context.log.error(`Create passing status failed with status ${response.status} and error: ${JSON.stringify(response.data)}`)
  }
}

async function getChangedFiles(context: Context<Webhooks.WebhookPayloadPullRequest>) {
  const changedFilesResponse = await context.github.pulls.listFiles(initPullRelatedRequest(context))
  const changedFiles: string[] = []
  for (const changedFileData of changedFilesResponse.data) {
    changedFiles.push(changedFileData.filename)
  }
  context.log.info(`Changed files are: ${JSON.stringify(changedFiles)}`)
  return changedFiles
}

async function getPreviousReviewIds(context: Context<Webhooks.WebhookPayloadPullRequest>): Promise<ReviewLookupResult> {
  const reviewsResponse = await context.github.pulls.listReviews(initPullRelatedRequest(context))
  let hasReview: boolean = false
  const reviewIds: Number[] = []
  context.log.info(`Found ${reviewsResponse.data.length} reviews`)
  reviewsResponse.data.forEach((review) => {
    context.log.info(review.user.login)
    if (review.user.login === 'approveman[bot]' && review.state !== 'DISMISSED') {
      hasReview = true
      reviewIds.push(review.id)
    }
  })
  return { hasReview, reviewIds }
}

async function dismissApproval(context: Context<Webhooks.WebhookPayloadPullRequest>, reviewId: Number): Promise<void> {
  const req = initPullRelatedRequest(context)
  req.review_id = reviewId
  req.message = composeReviewDismissalMsg()
  context.log.info('Try to dismiss the review')
  const dismissResponse = await context.github.pulls.dismissReview(req)
  context.log.info(`Dissmiss review #${reviewId} in PR #${req.pull_number} with status ${dismissResponse.status} and review state ${dismissResponse.data.state}`)
}

export async function dismissAllApprovals(context: Context<Webhooks.WebhookPayloadPullRequest>): Promise<void> {
  const reviewLookupResult = await getPreviousReviewIds(context)
  for (const reviewId of reviewLookupResult.reviewIds) {
    await dismissApproval(context, reviewId)
  }
  context.log.info(`Dismissed ${reviewLookupResult.reviewIds.length} reviews`)
}

export async function maybeApproveChange(context: Context<Webhooks.WebhookPayloadPullRequest>): Promise<void> {
  const startTime = new Date().toISOString()
  const changedFiles = await getChangedFiles(context)
  context.log.info(`Files changed in the pull request are ${JSON.stringify(changedFiles)}`)
  const rules = await getOwnershipRules(context)
  context.log.info(`Matching against rules: ${JSON.stringify(rules)}`)
  if (ownsAllFiles(rules.directoryMatchingRules, changedFiles, getUserInfo(context), context)) {
    context.log.info('The user owns all modified files, approve PR.')
    await approveChange(context)
    const endTime = new Date().toISOString()
    await createPassingStatus(context, startTime, endTime)
  } else {
    context.log.info('The user does not own all modified files. Undo previous approvals if any.')
    await dismissAllApprovals(context)
    context.log.info('All previous approvals dismissed')
  }
}
