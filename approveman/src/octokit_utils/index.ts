import { Context } from 'probot' // eslint-disable-line no-unused-vars
import Webhooks from 'probot/node_modules/@octokit/webhooks' // eslint-disable-line no-unused-vars
import { UserInfo } from '../types' // eslint-disable-line no-unused-vars
import { getOwnershipRules } from '../config_parser'
import { ownsAllFiles } from '../rule_matcher'

function getPullAuthor (context: Context<Webhooks.WebhookPayloadPullRequest>): string {
  return context.payload.pull_request.user.login
}

function getUserInfo (context: Context<Webhooks.WebhookPayloadPullRequest>): UserInfo {
  const info: UserInfo = {
    username: getPullAuthor(context)
  }
  return info
}

function initPullRelatedRequest (context: Context<Webhooks.WebhookPayloadPullRequest>): any {
  const pullNumber = context.payload.pull_request.number
  const repo = context.payload.repository.name
  const owner = context.payload.repository.owner.login
  context.log.info(`Initializing pull related request with ${owner}/${repo} #${pullNumber}`)
  return { pull_number: pullNumber, owner, repo }
}

async function reviewChange (context: Context<Webhooks.WebhookPayloadPullRequest>, action: string): Promise<void> {
  const req = initPullRelatedRequest(context)
  if (action !== 'PENDING') {
    req.event = action
  }
  context.log.info(`Reviewing PR with request ${JSON.stringify(req)}`)
  const res = await context.github.pulls.createReview(req)
  context.log.info(`Got response from GitHub with status: ${JSON.stringify(res.status)}`)
}

async function getChangedFiles (context: Context<Webhooks.WebhookPayloadPullRequest>) {
  const changedFilesResponse = await context.github.pulls.listFiles(initPullRelatedRequest(context))
  const changedFiles: string[] = []
  for (const changedFileData of changedFilesResponse.data) {
    changedFiles.push(changedFileData.filename)
  }
  context.log.info(`Changed files are: ${JSON.stringify(changedFiles)}`)
  return changedFiles
}

export async function maybeApproveChange (context: Context<Webhooks.WebhookPayloadPullRequest>): Promise<void> {
  const changedFiles = await getChangedFiles(context)
  context.log.info(`Files changed in the pull request are ${JSON.stringify(changedFiles)}`)
  const rules = await getOwnershipRules(context)
  context.log.info(`Matching against rules: ${JSON.stringify(rules)}`)
  if (ownsAllFiles(rules.directoryMatchingRules, changedFiles, getUserInfo(context), context)) {
    context.log.info('The user owns all modified files, approve PR')
    await reviewChange(context, 'APPROVE')
  } else {
    context.log.info('The user does not own all modified files, skip')
  }
}
