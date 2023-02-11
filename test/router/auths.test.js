const request = require('supertest')
const app = require('../../src/app')
const jwt = require('jsonwebtoken')
const secret = 'aslkdjlkaj10830912039jlkoaiuwerasdjflkasd'
const { uuid } = require('uuidv4')

let user, user0

beforeAll(async ()=> {
    const result = await app.services.user.create({ username: `${Date.now()}`, email: `${Date.now()}@ipca.pt`, location: 'amares', password: '123456' })
    const uniqueId = uuid()
    const expiresIn = '1h'

    user = { ...result[0] }
    user.token = jwt.sign({ user, uniqueId, type: 'register' }, secret, { expiresIn })
})

beforeAll(async ()=> {
    const result = await app.services.user.create({ username: `${Date.now()}`, email: `${Date.now()}@ipca.pt`, location: 'amares', password: '123456' })
    const uniqueId = uuid()
    const expiresIn = '0h'

    user0 = { ...result[0] }
    user0.token = jwt.sign({ user0, uniqueId, type: 'register' }, secret, { expiresIn })
})

// signup functionality

test('Test #1 - Register user', ()=>{
    return request(app).post('/auths/signup')
        .send({ username: `${Date.now()}`, email: `${Date.now()}@ipca.pt`, location: 'amares', password: '123456' })
        .then((res) => {
            expect(res.status).toBe(201)
        })
})

test('Test #1.2 - Register user without email', ()=>{
    return request(app).post('/auths/signup')
        .send({ username: `${Date.now()}`, password: '123456', location: 'amares' })
        .then((res) => {
            expect(res.status).toBe(400)
            expect(res.body.error).toBe('Email is a required attribute')
        })
})

test('Test #1.3 - Register user without username', ()=>{
    return request(app).post('/auths/signup')
    .send({ email: `${Date.now()}@ipca.pt`, password: '123456', location: 'amares' })
        .then((res) => {
            expect(res.status).toBe(400)
            expect(res.body.error).toBe('Name is a required attribute')
        })
})

test('Test #1.4 - Register user without location', ()=>{
    return request(app).post('/auths/signup')
    .send({ username: `${Date.now()}`, email: `${Date.now()}@ipca.pt`, password: '123456' })
        .then((res) => {
            expect(res.status).toBe(400)
            expect(res.body.error).toBe('Location is a required attribute')
        })
})

test('Test #1.5 - Register user without password', ()=>{
    return request(app).post('/auths/signup')
    .send({ username: `${Date.now()}`, email: `${Date.now()}@ipca.pt`, location: 'amares' })
        .then((res) => {
            expect(res.status).toBe(400)
            expect(res.body.error).toBe('Password is a required attribute')
        })
})

// signin functionality

test('Test #2 - Receive authentication token', ()=> {

    const mail = `${Date.now()}@ipca.pt`

    return app.services.user.create(
        { username: `${Date.now()}`, email: mail, password: '123456', location: 'amares', status: true }
    ).then(() => request(app).post('/auths/signin')
        .send({ email: mail, password: '123456'})
        .then((res) => {
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('token');
        }))
})

test('Test #2.1 - If the user does not exist', ()=> {
    return request(app).post('/auths/signin')
        .send({ email:  `${Date.now()}@ipca.pt`, location: 'amares', password: '123456' })
        .then((res) => {
            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Invalid authentication');
        });
})

test('Test #2.2 - If the password is wrong', ()=> {

    const mail = `${Date.now()}@ipca.pt`

    return app.services.user.create(
        { username: `${Date.now()}`, email: mail, password: '123456', location: 'amares', status: true }
    ).then(() => request(app).post('/auths/signin')
        .send({ email: mail, password: '1234'})
        .then((res) => {
            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Invalid authentication');
        }))
})

test('Test #3 - Receive appid', () => {
    const mail = `${Date.now()}@ipca.pt`

    return app.services.user.create(
        { username: `${Date.now()}`, email: mail, password: '123456', location: 'amares', status: true }
    ).then(() => request(app).post('/auths/signin')
        .send({ email: mail, password: '123456'})
        .then((res) => {
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('appid');
        }))
})

test('Test #4 - Activate my acount', ()=> {
    return request(app).get(`/auths/confirmation/${user.token}`)
        .then((res) => {
            expect(res.status).toBe(302)
        })
})

test('Test #4.1 - Activate account with invalid token', ()=> {
    const newtoken = (user.token).substring(0, (user.token).length - 5)
    return request(app).get(`/auths/confirmation/${newtoken}`)
        .then((res) => {
            expect(res.status).toBe(401)
            expect(res.body.error).toBe('Invalid token')
        })
})

test('Test #4.2 - Activate account with already used token', ()=> {
    const decode = jwt.verify(user.token, secret)

    return app.db('banedtoken')
        .insert({ banedid: decode.uniqueId })
        .then(() => request(app).get(`/auths/confirmation/${user.token}`)
            .then((res) => {
                expect(res.status).toBe(401)
                expect(res.body.error).toBe('Token has been used before')
            }))
})

test('Test #4.3 - Activate account with expired token', ()=> {
    return request(app).get(`/auths/confirmation/${user0.token}`)
        .then((res) => {
            expect(res.status).toBe(401)
            expect(res.body.error).toBe('Invalid token')
        })
})

test('Test #5 - Send a recover token', ()=> {
    return app.db('users')
        .insert({ username: `${Date.now()}`, email: `${Date.now()}@ipca.pt`, location: 'amares', password: '123456', appid: '1', status: false }, ['email'])
            .then((subs) => request(app).post(`/auths/recover`)
                .send({ email: subs[0].email})
                .then((res)=> {
                    expect(res.status).toBe(200)
                }))
})