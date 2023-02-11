const express = require('express')
const secret = 'aslkdjlkaj10830912039jlkoaiuwerasdjflkasd'
const jwt = require('jsonwebtoken')

module.exports = (app) => {
    const router = express.Router()

    router.get('/', (req, res, next) => {
        app.services.user.find()
            .then((result) => res.status(200).json(result))
            .catch((error) => next(error))
    })
    
    router.post('/', async (req, res, next) => {
        try{
            const result = await app.services.user.create(req.body)
            return res.status(201).json(result[0])
        }
        catch(error) { next(error) }
    })

    router.get('/get', async (req, res, next) => {
        const bearerHeader = req.headers['authorization']
        const bearer = bearerHeader.split(' ')
        const bearerToken = bearer[1]
        
        try{ 
            const decode = jwt.verify(bearerToken, secret)

            const user = await app.services.user.findOne({ id: decode.user.id })
            return res.status(200).json({ user })
        }
        catch(error) { next(error) }

    })

    router.put('/:email', (req, res, next) => {
        app.services.user.update(req.params.email, req.body)
            .then((result) => res.status(200).json(result))
            .catch((error) => next(error))
    })

    router.delete('/:email', async (req, res, next) => {
        app.services.user.remove(req.params.email)
            .then((result) => res.status(204).json(result))
            .catch((error) => next(error))
    })

    return router
}