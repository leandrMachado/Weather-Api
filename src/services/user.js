const bcrypt = require('bcrypt-nodejs')
const validationError = require('../errors/validationError')
const nodemailer = require('nodemailer')
const NODE_CONFIG = require('../config/smtp')
const jwt = require('jsonwebtoken')
const secret = 'aslkdjlkaj10830912039jlkoaiuwerasdjflkasd'
const { uuid } = require('uuidv4')


module.exports = (app) => {

    const transporter = nodemailer.createTransport({
        service: NODE_CONFIG.service,
        auth: {
            user: NODE_CONFIG.auth.user,
            pass: NODE_CONFIG.auth.pass
        }
    })

    const find = () => {
        return app.db('users').select();
    }

    const findOne = (filter = {}) => {
        return app.db('users').where(filter).first();
    }

    const getPasswordHash = (password) => {
        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(password, salt);
    }

    const create = async (user) => {
        if (!user.email) throw new validationError('Email is a required attribute')
        if (!user.username) throw new validationError('Name is a required attribute')
        if (!user.location) throw new validationError('Location is a required attribute')
        if (!user.password) throw new validationError('Password is a required attribute')

        const userDb = await findOne({ email: user.email });
        if (userDb) throw new validationError('This email already exists')

        const uniqueId = uuid()
        const confirmToken = jwt.sign({ user, uniqueId, type: 'register' }, secret, { expiresIn: '1h' })

      //   ADICIONAR FUNCCIONALIDADE DE ENVIAR EMAILS PARA ATIVAR AUTENTICAÇAO
        transporter.sendMail({
            from: 'silmi22083@gmail.com',
            to: user.email,
            subject: 'Weather App',
            html: `<a href="http://localhost:3001/auths/confirmation/${confirmToken}">Click here to confirm your subscription</a>`
        }, (error) => {
            if(error) throw new validationError(error)
        })

        const newUser = { ...user }
        newUser.status = false
        newUser.appid = uuid()
        newUser.password = getPasswordHash(user.password)

        return app.db('users').insert(newUser, ['id', 'username', 'email', 'appid', 'location']);
    }

    const update = async (email, user) => {
        const updateUser = { ...user }

        if(user.password){
            updateUser.password = getPasswordHash(updateUser.password)
        }

        return app.db('users')
            .where({ email })
            .update(updateUser, '*')
    }

    const remove = (email) => {
        return app.db('users')
            .where({ email })
            .del();
    }

    return  { find ,create, findOne, update, remove }
}