const express = require('express')

module.exports = (app) => {
    app.use('/subscription', app.routes.subscribes)
    app.use('/data', app.routes.weathers)
    app.use('/auths', app.routes.auths)

    const secureRouter = express.Router()

    secureRouter.use('/users', app.routes.users)

    app.use('/v1', app.config.passport.authenticate(), secureRouter)
}