const request = require('supertest')

const app = require('../../src/app')
const TOKEN_USERS = '/users-token'
const mail = `${Date.now()}@ipca.pt`

test('Test #1 - Listar token users', ()=> {
    return request(app).get(TOKEN_USERS)
        .then((snapshot) => {
            expect(snapshot.status).toBe(200)
        })
})

test('Test #2 - Criar novos usuarios', () => {
    return request(app).post(TOKEN_USERS)
        .send({ name:'leandro', email: mail, password: '12345'})
        .then((snapshot) => {
            expect(snapshot.status).toBe(201)
        })
})