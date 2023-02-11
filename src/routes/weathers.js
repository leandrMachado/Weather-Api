const express = require('express')

module.exports = (app) => {
    const router = express.Router()

    router.get('/no-auths', (req, res, next) => {
        app.services.weather.search(req.query)
            .then((result) => res.status(200).json(result))
            .catch((error) => next(error) )
    })

    router.get('/', (req, res, next) => {
        app.services.weather.shareWeather(req.query)
            .then((result) => res.status(200).json(result))
            .catch((error) => next(error) )
    })

    return router
}