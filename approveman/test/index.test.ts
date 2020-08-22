import nock from 'nock'
import approvemanApp from '../src'
import { Probot } from 'probot'
import prOpenedPayload from './fixtures/pr.opened.json'
import prReopenedPayload from './fixtures/pr.reopened.json'
import prSynchronizePayload from './fixtures/pr.synchronize.json'
const fs = require('fs')
const path = require('path')

jest.setTimeout(30000)

function setConfigNotFound (): void {
  nock('https://api.github.com')
    .get('/repos/tianhaoz95/.github/contents/.github/approveman.yml')
    .reply(404)
  nock('https://api.github.com')
    .get('/repos/tianhaoz95/approveman-test/contents/.github/approveman.yml')
    .reply(404)
}

function setConfigToBasic (configId: string): void {
  const rawContent = fs.readFileSync(path.join(__dirname, 'fixtures', `${configId}-config.yml`))
  const contentBuf = Buffer.from(rawContent)
  const encodedContent = contentBuf.toString('base64')
  nock('https://api.github.com')
    .get('/repos/tianhaoz95/.github/contents/.github/approveman.yml')
    .reply(200, {
      type: 'file',
      encoding: 'base64',
      size: encodedContent.length,
      name: 'approveman.yml',
      path: '.github/contents/.github/approveman.yml',
      content: encodedContent
    })
  nock('https://api.github.com')
    .get('/repos/tianhaoz95/approveman-test/contents/.github/approveman.yml')
    .reply(404)
}

function checkApproved (done: jest.DoneCallback): void {
  nock('https://api.github.com')
    .post('/repos/tianhaoz95/approveman-test/pulls/1/reviews', (body: any) => {
      done(expect(body).toMatchObject({
        event: 'APPROVE'
      }))
      return true
    })
    .reply(200)
}

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
    nock('https://api.github.com')
      .post('/repos/tianhaoz95/approveman-test/pulls/1/reviews', (body: any) => {
        done(expect(body).toMatchObject({
          event: 'APPROVE'
        }))
        return true
      })
      .reply(200)
    nock('https://api.github.com')
      .get('/repos/tianhaoz95/approveman-test/pulls/1/files')
      .reply(200, [
        { filename: 'experimental/tianhaoz95/test.md' }
      ])
    await probot.receive({ name: 'pull_request', payload: prSynchronizePayload })
  })

  test('receive PR opened', async (done) => {
    setConfigNotFound()
    nock('https://api.github.com')
      .post('/repos/tianhaoz95/approveman-test/pulls/1/reviews', (body: any) => {
        done(expect(body).toMatchObject({
          event: 'APPROVE'
        }))
        return true
      })
      .reply(200)
    nock('https://api.github.com')
      .get('/repos/tianhaoz95/approveman-test/pulls/1/files')
      .reply(200, [
        { filename: 'experimental/tianhaoz95/test.md' }
      ])
    await probot.receive({ name: 'pull_request', payload: prOpenedPayload })
  })

  test('read config', async (done) => {
    setConfigToBasic('basic')
    nock('https://api.github.com')
      .post('/repos/tianhaoz95/approveman-test/pulls/1/reviews', (body: any) => {
        done(expect(body).toMatchObject({
          event: 'APPROVE'
        }))
        return true
      })
      .reply(200)
    nock('https://api.github.com')
      .get('/repos/tianhaoz95/approveman-test/pulls/1/files')
      .reply(200, [
        { filename: 'docs/personal/tianhaoz95/test.md' }
      ])
    await probot.receive({ name: 'pull_request', payload: prOpenedPayload })
  })

  afterEach(() => {
    nock.cleanAll()
    nock.enableNetConnect()
  })
})
