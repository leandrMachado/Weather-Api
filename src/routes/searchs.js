module.exports = (app) => {
    const find = (req, res) => {
        app.services.search.find({ zone: req.params.zone })
            .then((result) => res.status(200).json(result))
    }

    return { find }
}