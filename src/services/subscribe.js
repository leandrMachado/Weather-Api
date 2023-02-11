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

    const findAll = (filter = {}) => {
        return app.db('subscriptions').where(filter).select()
    }

    const findOne = (filter = {}) => {
        return app.db('subscriptions').where(filter).first();
    }
    
    const create = async (subscription) => {
        if(!subscription.email) throw new validationError('Email is a required attribute')
        if(!subscription.location) throw new validationError('Location is a required attribute')

        const subscriptionDb = await findOne({ email: subscription.email })
        if(subscriptionDb) throw new validationError('This email is already written in the location: ' + subscriptionDb.location)

        const uniqueId = uuid()
        const confirmToken = jwt.sign({ subscription, uniqueId, type: 'newsletter' }, secret, { expiresIn: '1h' })
        
        //   ADICIONAR FUNCCIONALIDADE DE ENVIAR EMAILS PARA ATIVAR AUTENTICAÇAO 
        transporter.sendMail({
            from: 'silmi22083@gmail.com',
            to: subscription.email,
            subject: 'Weather App',
            html: `<a href="http://localhost:3001/auths/confirmation/${confirmToken}">Click here to confirm your subscription</a>`
        }, (error) => {
            if(error) throw new validationError(error)
        })


        const newSubscription = { ...subscription }
        newSubscription.status = false

        return app.db('subscriptions').insert(newSubscription, '*') 
    }

    const update = async (email, subscription) => {
        return app.db('subscriptions')
            .where({ email })
            .update(subscription, '*')
    }

    const remove = (email) => {
        return app.db('subscriptions')
            .where({ email })
            .del();
    }

    return { create, update, remove, findOne, findAll }
}