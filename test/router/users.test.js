const request = require('supertest')
const jwt = require('jsonwebtoken')
const app = require('../../src/app')
const secret = 'aslkdjlkaj10830912039jlkoaiuwerasdjflkasd'
const { uuid } = require('uuidv4');

let user

beforeAll(async ()=> {
    const uniqueId = uuid()
    const result = await app.services.user.create({ username: `${Date.now()}`, email: `${Date.now()}@ipca.pt`, location: 'amares', password: '123456' })
    user = { ...result[0] }
    user.token = jwt.sign({ user, uniqueId }, secret)
})

test('Test #1 - List users', () => {
    return request(app).get('/v1/users')
        .set('authorization', `bearer ${user.token}`)
        .then((res) => {
            expect(res.status).toBe(200);
        })
})

test('Test #2 - Inseriri utilizadores', ()=> {
    return request(app).post('/v1/users')
        .set('authorization', `bearer ${user.token}`)
        .send({ username: `${Date.now()}`, email: `${Date.now()}@ipca.pt`, location: 'amares', password: '123456' })
        .then((res) => {
            expect(res.status).toBe(201);
            expect(res.body).not.toHaveProperty('password');
        })
})

test('Test #2.1 - Inseriri utilizadores sem username', ()=> {
    return request(app).post('/v1/users')
        .set('authorization', `bearer ${user.token}`)
        .send({ email: `${Date.now()}@ipca.pt`, location: 'amares', password: '123456' })
        .then((res) => {
            expect(res.status).toBe(400)
            expect(res.body.error).toBe('Name is a required attribute')
        })
})

test('Test #2.2 - Inseriri utilizadores sem email', ()=> {
    return request(app).post('/v1/users')
        .set('authorization', `bearer ${user.token}`)
        .send({ username: `${Date.now()}`, location: 'amares', password: '123456' })
        .then((res) => {
            expect(res.status).toBe(400)
            expect(res.body.error).toBe('Email is a required attribute')
        })
})

test('Test #2.3 - Inseriri utilizadores sem localizaçao', ()=> {
    return request(app).post('/v1/users')
        .set('authorization', `bearer ${user.token}`)
        .send({ username: `${Date.now()}`, email: `${Date.now()}@ipca.pt`, password: '123456' })
        .then((res) => {
            expect(res.status).toBe(400)
            expect(res.body.error).toBe('Location is a required attribute')
        })
})

test('Test #2.4 - Inseriri utilizadores sem password', ()=> {
    return request(app).post('/v1/users')
        .set('authorization', `bearer ${user.token}`)
        .send({ username: `${Date.now()}`, email: `${Date.now()}@ipca.pt`, location: 'amares' })
        .then((res) => {
            expect(res.status).toBe(400)
            expect(res.body.error).toBe('Password is a required attribute')
        })
})

test('Test #2.5 - inserir utilizadores com o mesmo email', ()=> {
    const sameemail = `${Date.now()}@ipca.pt`

    return app.db('users')
        .insert({ username: `${Date.now()}`, email: sameemail, location: 'amares', password: '123456', appid: '1', status: false })
        .then(() => request(app).post('/v1/users')
            .set('authorization', `bearer ${user.token}`)
            .send({ username: `${Date.now()}`, email: sameemail, location: 'a', password: 'a' }))
            .then((res) => {
                expect(res.status).toBe(400);
                expect(res.body.error).toBe('This email already exists');
            });
})

test('Test #3 - Remove new user', () => {
    return app.db('users')
        .insert({ username: `${Date.now()}`, email: `${Date.now()}@ipca.pt`, location: 'amares', password: '123456', appid: '1', status: false }, ['email'])
        .then((acc) => request(app).delete(`/v1/users/${acc[0].email}`)
            .set('authorization', `bearer ${user.token}`))
            .then((res) => {
                expect(res.status).toBe(204);
            });
})

test('Test #3 - Update new user', () => {
    return app.db('users')
        .insert({ username: `${Date.now()}`, email: `${Date.now()}@ipca.pt`, location: 'amares', password: '123456', appid: '1', status: false }, ['email'])
        .then((acc) => request(app).put(`/v1/users/${acc[0].email}`)
            .set('authorization', `bearer ${user.token}`)
            .send({ location: 'BA' }))
            .then((res) => {
                expect(res.status).toBe(200);
            });
})

test('Test #4 - Get user by token', ()=> {
    return request(app).get('/v1/users/get')
        .set('authorization', `bearer ${user.token}`)
        .then((res) => {
            expect(res.status).toBe(200)
        })
})

test('test #5 - Reset password', ()=> {
    return app.db('users')
        .insert({ username: `${Date.now()}`, email: `${Date.now()}@ipca.pt`, location: 'amares', password: '123456', appid: '1', status: false }, ['email'])
        .then((acc) => request(app).put(`/v1/users/${acc[0].email}`)
            .set('authorization', `bearer ${user.token}`)
            .send({ password: '12321' }))
            .then((res) => {
                expect(res.status).toBe(200);
            });
})