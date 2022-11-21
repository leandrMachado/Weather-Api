module.exports = (app) => {
    const findByZone = (req, res) => {
        app.services.search.findByZone({ zone: req.params.zone })
            .then((result) => res.status(200).json(result))
    }

    return { findByZone }
}