import { Application, Context } from 'probot' // eslint-disable-line no-unused-vars
import Webhooks from 'probot/node_modules/@octokit/webhooks'
import Mustache from 'mustache'
import minimatch from 'minimatch'

interface UserInfo {
  username: string
}

interface AppConfig {
  rules: string[]
}

function getPullAuthor(context: Context<Webhooks.WebhookPayloadPullRequest>): string {
  return context.payload.pull_request.user.login;
}

function getUserInfo(context: Context<Webhooks.WebhookPayloadPullRequest>): UserInfo {
  const info: UserInfo = {
    username: getPullAuthor(context)
  };
  return info;
}

function initPullRelatedRequest(context: Context<Webhooks.WebhookPayloadPullRequest>) : any {
  const pull_number = context.payload.pull_request.number;
  const repo = context.payload.repository.name;
  const owner = context.payload.repository.owner.login;
  context.log.info(`Initializing pull related request with ${owner}/${repo} #${pull_number}`);
  return {pull_number, owner, repo};
}

async function getChangedFiles(context: Context<Webhooks.WebhookPayloadPullRequest>) {
  const changedFilesResponse = await context.github.pulls.listFiles(initPullRelatedRequest(context));
  let changedFiles: string[] = [];
  for (const changedFileData of changedFilesResponse.data) {
    changedFiles.push(changedFileData.filename);
  }
  context.log.info(`Changed files are: ${JSON.stringify(changedFiles)}`);
  return changedFiles;
}

async function reviewChange(context: Context<Webhooks.WebhookPayloadPullRequest>, action: string): Promise<void> {
  let req = initPullRelatedRequest(context);
  if (action !== 'PENDING') {
    req.event = action;
  }
  context.log.info(`Reviewing PR with request ${JSON.stringify(req)}`);
  const res = await context.github.pulls.createReview(req);
  context.log.info(`Got response from GitHub: ${JSON.stringify(res)}`);
}

function matchRule(rule: string, filename: string, info: UserInfo, context: Context<Webhooks.WebhookPayloadPullRequest>): boolean {
  const renderedRule = Mustache.render(rule, info);
  context.log.info(`Rendered rules to ${renderedRule}`);
  const isMatch = minimatch(filename, renderedRule);
  context.log.info(`File ${filename} and rule ${renderedRule} matching result is ${isMatch}`);
  return isMatch;
}

function matchOneOfRules(rules: string[], filename: string, info: UserInfo, context: Context<Webhooks.WebhookPayloadPullRequest>): boolean {
  let matchOneOf = false;
  for (const rule of rules) {
    if (matchRule(rule, filename, info, context)) {
      matchOneOf = true;
    }
  }
  return matchOneOf;
}

function ownsAllFiles(rules: string[], filenames: string[], info: UserInfo, context: Context<Webhooks.WebhookPayloadPullRequest>): boolean {
  let ownsAll = true;
  for (const filename of filenames) {
    if (matchOneOfRules(rules, filename, info, context)) {
      ownsAll = false;
    }
  }
  return ownsAll;
}

function getDefaultRules() : AppConfig {
  let config: AppConfig = {
    rules: ['experimental/{{username}}/**/*']
  };
  return config;
}

async function getRules(context: Context<Webhooks.WebhookPayloadPullRequest>) {
  const config = await context.config('approveman.yml', getDefaultRules());
  if (config !== null) {
    return config.rules;
  } else {
    throw Error('Cannot get app config');
  }
}

export = (app: Application) => {
  app.log.info('Starting ApproveMan server ...');

  app.on('pull_request.opened', async (context) => {
    app.log.info(`Pull request open event detected`);
    const changedFiles = await getChangedFiles(context)
    app.log.info(`Files changed in the pull request are ${JSON.stringify(changedFiles)}`);
  });

  app.on('pull_request.closed', async (context) => {
    app.log.info(`Pull request close event detected`);
    const changedFiles = await getChangedFiles(context)
    app.log.info(`Files changed in the pull request are ${JSON.stringify(changedFiles)}`);
    await reviewChange(context, 'PENDING');
  });

  app.on('pull_request.reopened', async (context) => {
    context.log.info(`Pull request reopen event detected`);
    const changedFiles = await getChangedFiles(context)
    context.log.info(`Files changed in the pull request are ${JSON.stringify(changedFiles)}`);
    const rules = await getRules(context);
    context.log.info(`Matching against rules: ${JSON.stringify(rules)}`);
    if (ownsAllFiles(rules, changedFiles, getUserInfo(context), context)) {
      context.log.info('The user owns all modified files, approve PR');
      await reviewChange(context, 'APPROVE');
    } else {
      context.log.info('The user does not own all modified files, skip');
    }
  });
} 
