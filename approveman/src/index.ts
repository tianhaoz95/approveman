import { Application } from 'probot' // eslint-disable-line no-unused-vars
import { maybeApproveChange } from './octokit_utils'

export = (app: Application) => {
  app.log.info('Starting ApproveMan server ...')

  app.on('pull_request.opened', async (context) => {
    app.log.info('Pull request open event detected')
    await maybeApproveChange(context)
  })

  app.on('pull_request.reopened', async (context) => {
    context.log.info('Pull request reopen event detected')
    await maybeApproveChange(context)
  })
}
