const express = require('express')

module.exports = (app) => {
    const router = express.Router()

    router.get('/', (req, res, next) => {
        app.services.subscribe.findAll()
            .then((result) => res.status(200).json(result))
            .catch((error) => next(error))
    })

    // add some one to the newsletter
    router.post('/', async (req, res, next) => {
        try{
            const result = await app.services.subscribe.create(req.body)
            return res.status(201).json(result[0]);
        }
        catch(error) { next(error) }
    })

    // --
    router.put('/:email', (req, res, next) => {
        app.services.subscribe.update(req.params.email, req.body)
            .then((result) => res.status(200).json(result))
            .catch((error) => next(error))
    })

    // remove subscription
    router.delete('/:email', (req, res, next) => {
        app.services.subscribe.remove(req.params.email)
            .then((result) => res.status(204).json(result))
            .catch((error) => next(error))
    })

    return router
}