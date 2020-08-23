import nock from 'nock'
import approvemanApp from '../src'
import { Probot } from 'probot'
import prOpenedPayload from './fixtures/basic/pr.opened.json'
import prReopenedPayload from './fixtures/basic/pr.reopened.json'
import prSynchronizePayload from './fixtures/basic/pr.synchronize.json'
import { setConfigToBasic, setConfigNotFound } from './utils/config'
import { checkApproved, setSinglePreviousReview, verifyReviewDismissed } from './utils/review'
const fs = require('fs')
const path = require('path')

jest.setTimeout(30000)

describe('Approveman tests', () => {
  let probot: any
  let mockCert: string

  beforeAll((done: Function) => {
    fs.readFile(path.join(__dirname, 'fixtures/mock-cert.pem'), (err: Error, cert: string) => {
      if (err) return done(err)
      mockCert = cert
      done()
    })
  })

  beforeEach(() => {
    nock.disableNetConnect()
    probot = new Probot({ id: 123, cert: mockCert })
    probot.load(approvemanApp)
  })

  test('receive PR reopened', async (done) => {
    setConfigNotFound()
    checkApproved(done)
    nock('https://api.github.com')
      .get('/repos/tianhaoz95/approveman-test/pulls/1/files')
      .reply(200, [
        { filename: 'experimental/tianhaoz95/test.md' }
      ])
    await probot.receive({ name: 'pull_request', payload: prReopenedPayload })
  })

  test('receive PR synchronize', async (done) => {
    setConfigNotFound()
    checkApproved(done)
    nock('https://api.github.com')
      .get('/repos/tianhaoz95/approveman-test/pulls/1/files')
      .reply(200, [
        { filename: 'experimental/tianhaoz95/test.md' }
      ])
    await probot.receive({ name: 'pull_request', payload: prSynchronizePayload })
  })

  test('receive PR opened', async (done) => {
    setConfigNotFound()
    checkApproved(done)
    nock('https://api.github.com')
      .get('/repos/tianhaoz95/approveman-test/pulls/1/files')
      .reply(200, [
        { filename: 'experimental/tianhaoz95/test.md' }
      ])
    await probot.receive({ name: 'pull_request', payload: prOpenedPayload })
  })

  test('read config', async (done) => {
    setConfigToBasic('basic')
    checkApproved(done)
    nock('https://api.github.com')
      .get('/repos/tianhaoz95/approveman-test/pulls/1/files')
      .reply(200, [
        { filename: 'docs/personal/tianhaoz95/test.md' }
      ])
    await probot.receive({ name: 'pull_request', payload: prOpenedPayload })
  })

  test('rules not satisfied', async (done) => {
    setConfigToBasic('basic')
    nock('https://api.github.com')
      .get('/repos/tianhaoz95/approveman-test/pulls/1/files')
      .reply(200, [
        { filename: 'some/random/file.md' }
      ])
    setSinglePreviousReview()
    verifyReviewDismissed(done)
    await probot.receive({ name: 'pull_request', payload: prOpenedPayload })
  })

  afterEach(() => {
    nock.cleanAll()
    nock.enableNetConnect()
  })
})
