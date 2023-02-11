const request = require('supertest')
const app = require('../../src/app')

let user

beforeAll( async ()=> {
    const mail = `${Date.now()}@ipca.pt`

    return app.services.user.create(
        { username: `${Date.now()}`, email: mail, password: '123456', location: 'amares', status: true }
    ).then(() => request(app).post('/auths/signin')
        .send({ email: mail, password: '123456'})
        .then((res) => {
            user = { ...res.body }
        }))
})

test('Test - List weather data from cords', ()=>{
    return request(app).get(`/data/no-auths/?lat=44.34&lon=10.99`)
        .then((res) => {
            expect(res.status).toBe(200)
            expect(res.body.city.name).toBe('Zocca')
        })
})

test('Test #2 - List weather data from city', () => {
    return request(app).get(`/data/no-auths/?name=Braga`)
        .then((res) => {
            expect(res.status).toBe(200)
            expect(res.body.city.name).toBe('Braga')
        })
})

test('Test #3 - If introduce wrong cords', ()=> {
    return request(app).get('/data/no-auths/?lat=-10&lon=--20')
        .then((res) => {
            expect(res.status).toBe(400)
            expect(res.body.error).toBe('Invalid coordinates')
        })
})

test('Test #4 - If name of location dosent exist', () => {
    return request(app).get('/data/no-auths/?name=aaa')
        .then((res) => {
            expect(res.status).toBe(400)
            expect(res.body.error).toBe('Invalid location name')
        })
})

test('Test #5 -  List weather data from cords with appid', ()=> {
    return request(app).get(`/data/?lat=44.34&lon=10.99&appid=${user.appid}`)
        .then((res) => {
            expect(res.status).toBe(200)
            expect(res.body.city.name).toBe('Zocca')
        })
})

test('Test #6 - List weather data from city with appid', ()=> {
    return request(app).get(`/data/?name=Braga&appid=${user.appid}`)
        .then((res) => {
            expect(res.status).toBe(200)
            expect(res.body.city.name).toBe('Braga')
        })
})

test('Test #7 - Without appid', ()=> {
    return request(app).get(`/data/?name=Braga&appid=`)
        .then((res) => {
            expect(res.status).toBe(400)
            expect(res.body.error).toBe('Appid is a required attribute')
        })
})

test('Test #8 - If without location name', ()=> {
    return request(app).get(`/data/?name=&appid=${user.appid}`)
        .then((res) => {
            expect(res.status).toBe(400)
            expect(res.body.error).toBe('Name of location or coordinates is a required attribute')
        })
})

test('Test #9 - If without latitude', ()=>{
    return request(app).get(`/data/?lat=&lon=10.99&appid=${user.appid}`)
    .then((res) => {
        expect(res.status).toBe(400)
        expect(res.body.error).toBe('Latitude is a required attribute')
    })
})

test('Test #10 - If without longitude', ()=>{
    return request(app).get(`/data/?lat=44.34&lon=&appid=${user.appid}`)
        .then((res) => {
            expect(res.status).toBe(400)
            expect(res.body.error).toBe('Longitude is a required attribute')
        })
})

test('Test #11 - Without coordinates', ()=> {
    return request(app).get(`/data/?lat=&lon=&appid=${user.appid}`)
        .then((res) => {
            expect(res.status).toBe(400)
            expect(res.body.error).toBe('Name of location or coordinates is a required attribute')
        })
})

test('Test #12 - Sendig invalid appid', ()=> {
    const newappid = (user.appid).substring(0, (user.appid).length - 5)

    return request(app).get(`/data/?lat=44.34&lon=10.99&appid=${newappid}`)
        .then((res) => {
            expect(res.status).toBe(400)
            expect(res.body.error).toBe(`This appid doesn't exist please create un account to use the api!`)
        })
})