const request = require('supertest')
const app = require('../../src/app')
const jwt = require('jsonwebtoken')
const secret = 'aslkdjlkaj10830912039jlkoaiuwerasdjflkasd'
const { uuid } = require('uuidv4')


let subscription

beforeAll(async ()=> {
    const result = await app.services.subscribe.create({ email: `${Date.now()}@ipca.pt`, location: 'amares' })
    const uniqueId = uuid()
    const expiresIn = '1h'

    subscription = { ...result[0] }
    subscription.token = jwt.sign({ subscription, uniqueId, type: 'newsletter'}, secret, { expiresIn })
})

test('Test #1 - Get all subscription', ()=> {
    return request(app).get('/subscription')
        .send({ email: `${Date.now()}@ipca.pt`, location: 'amares' })
        .then((res) => {
            expect(res.status).toBe(200)
        })
})

test('Test #2 - New subscription', ()=> {
    return request(app).post('/subscription')
        .send({ email: `${Date.now()}@ipca.pt`, location: 'amares' })
        .then((res) => {
            expect(res.status).toBe(201)
        })
})

test('Test #2.1 - New subscription without email', ()=> {
    return request(app).post('/subscription')
        .send({ localizacao: 'amares' })
        .then((res) => {
            expect(res.status).toBe(400)
            expect(res.body.error).toBe('Email is a required attribute')
        })
})

test('Test #2.2 - New subscription without location', ()=> {
    return request(app).post('/subscription')
        .send({ email: `${Date.now()}@ipca.pt`, status: false })
        .then((res) => {
            expect(res.status).toBe(400)
            expect(res.body.error).toBe('Location is a required attribute')
        })
})

test('Test #3 - Update locations', ()=> {
    return app.db('subscriptions')
        .insert({ email: `${Date.now()}@ipca.pt`, location: 'amares', status: false }, ['email'])
            .then((subs) => request(app).put(`/subscription/${subs[0].email}`)
                .send({ location: 'braga' }))
            .then((res)=> {
                expect(res.status).toBe(200)
            })
})

test('Test #4 - Remove subscription', ()=> {
    return app.db('subscriptions')
        .insert({ email: `${Date.now()}@ipca.pt`, location: 'danone', status: false }, ['email'])
            .then((subs) => request(app).delete(`/subscription/${subs[0].email}`))
            .then((res)=> {
                expect(res.status).toBe(204)
            })
})

test('Test #5 - Check if the email already exists', ()=> {
    const sameemail = `${Date.now()}@ipca.pt`

    return app.services.subscribe.create(
        { email: sameemail, location: 'amares' }
    )
    .then(() => request(app).post('/subscription')
        .send({ email: sameemail, location: 'amares' })
        .then((res) => {
            expect(res.status).toBe(400)
            expect(res.body.error).toBe('This email is already written in the location: amares')
        }))
})

test('Test #6 - Activate subscription', ()=>{
    return request(app).get(`/auths/confirmation/${subscription.token}`)
        .then((res) => {
            expect(res.status).toBe(302)
        })
})
