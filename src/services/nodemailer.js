const jwt = require('jsonwebtoken')
const secret = 'aslkdjlkaj10830912039jlkoaiuwerasdjflkasd'

module.exports = (app) => {

    const confirmation = (token) => {
        const decoded = jwt.verify(token, secret)

        if(decoded.type === 'register'){
            app.services.user.update(decoded.user.email, { status: true })
                .then((result) => {
                    return result
                })
                .catch((error) => { return error })
        }

        if(decoded.type === 'newsletter'){
            app.services.subscribe.update(decoded.subscription.email, { status: true })
                .then((result) => {
                    return result
                })
                .catch((error) => { return error })

        }


    }

    return { confirmation }
}