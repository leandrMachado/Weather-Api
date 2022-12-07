const validationError = require('../error/validationError')

module.exports = (app) => {
    const find = (filter = {}) => {
        return app.db('users-token').where(filter).select(['id', 'email', 'name'])
    }

    const save = async (user) => {
        if(!user.name) throw new validationError('Name is required attribute')
        if(!user.email) throw new validationError('Email is required attribute')
        if(!user.password) throw new validationError('Password is required attribute')

        const userDb = await find({ email: user.email })
        if(userDb && userDb.length > 0) throw new validationError('This email already exists')

        return app.db('users-token').insert(user, ['id', 'email', 'name'])
    }

    return { find, save }
}