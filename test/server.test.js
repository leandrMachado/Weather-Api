const supertest = require('supertest')

const request = supertest('http://localhost:3001')

test('Validar servidor respode', () => {
  return request.get('/')
    .then((res) => expect(res.status).toBe(200))
})
