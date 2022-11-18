module.exports = (app) => {
    app.route('/search/:zone')
        .get(app.routes.searchs.find)
}