module.exports = (app) => {
    app.route('/users-token')
        .get(app.routes.users.find)
        .post(app.routes.users.save)

}