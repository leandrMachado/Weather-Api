module.exports = (app) => {
    const find = (req, res, next) => {
        app.services.user.find()
            .then((snapshot) => res.status(200).json(snapshot))
            .catch((error) => next(error))
    }

    const save = async (req, res, next) => {
        try{
            const snapshot = await app.services.user.save(req.body)
            res.status(201).json(snapshot[0])
        }
        catch(error) { next(error) }
    }

    return { find, save}
}