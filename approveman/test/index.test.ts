// For more information about testing with Jest see:
// https://facebook.github.io/jest/

// For more information about using TypeScript in your tests, Jest recommends:
// https://github.com/kulshekhar/ts-jest

// For more information about testing with Nock see:
// https://github.com/nock/nock

import nock from 'nock'
// Requiring the app implementation
import approvemanApp from '../src'
import { Probot } from 'probot'
// Requiring the fixtures
import prReopenedPayload from './fixtures/pr.reopened.json'
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

  test('approve when file matches ownership rules', async (done) => {
    nock('https://api.github.com')
      .post('/app/installations/2/access_tokens')
      .reply(200, { token: 'test' })

    nock('https://api.github.com')
      .get('/repos/tianhaoz95/approveman-test/contents/.github/approveman.yml')
      .reply(404)

    nock('https://api.github.com')
      .get('/repos/tianhaoz95/.github/contents/.github/approveman.yml')
      .reply(404)

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

    await probot.receive({ name: 'pull_request', payload: prReopenedPayload })
  })

  afterEach(() => {
    nock.cleanAll()
    nock.enableNetConnect()
  })
})
