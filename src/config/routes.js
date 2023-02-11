module.exports = (app) => {
    app.route('/data')
        .get(app.routes.weathers.search)
        .get(app.routes.weathers.shareWeather)

    app.route('/auths/signup')
        .post(app.routes.auths.signup)
    
    app.route('/auths/signin')
        .post(app.routes.auths.signip)
    
    app.route('/auths/confirmation/:token')
        .get(app.routes.auths.confirmation)
    
    app.route('/auths/recover/:email')
        .post(app.routes.auths.findOne)
    
    app.route('/users')
        .all(app.config.passport.authenticate())
        .get(app.routes.users.find)
        .post(app.routes.users.create)

    app.route('/users/get')
        .get(app.routes.users.findOne)
    
    app.route('/users/:email')   
        .put(app.routes.users.update)
        .delete(app.routes.users.remove)

    app.route('/subscription')
        .get(app.routes.subscribes.findAll)
        .post(app.routes.subscribes.create)
    
    app.route('/subscription/:email')
        .put(app.routes.subscribes.update)
        .delete(app.routes.subscribes.remove)
        
}