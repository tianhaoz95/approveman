import { Application } from 'probot' // eslint-disable-line no-unused-vars

export = (app: Application) => {
  app.log.info('Starting ApproveMan server ...');

  app.on('pull_request.opened', async (context) => {
    app.log(`Pull request detected with ${context}`);
  });

  app.on('pull_request.closed', async (context) => {
    app.log(`Pull request detected with ${context}`);
  });

  app.on('pull_request.reopened', async (context) => {
    app.log(`Pull request detected with ${context}`);
  });
}
