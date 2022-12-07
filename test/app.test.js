const request = require('supertest')

const app = require('../src/app')

test('app a validar na raiz', async () => {
  const res = await request(app).get('/')
  expect(res.status).toBe(200)
})
