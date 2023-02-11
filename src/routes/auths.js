const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt-nodejs')
const validationError = require('../errors/validationError')
const secret = 'aslkdjlkaj10830912039jlkoaiuwerasdjflkasd'
const { uuid } = require('uuidv4');
const nodemailer = require('nodemailer')
const NODE_CONFIG = require('../config/smtp')

module.exports = (app) => {
    const router = express.Router()
    const transporter = nodemailer.createTransport({
        service: NODE_CONFIG.service,
        auth: {
            user: NODE_CONFIG.auth.user,
            pass: NODE_CONFIG.auth.pass
        }
    })

    router.post('/signin', (req, res, next) => {
        app.services.user.findOne({ email: req.body.email })
            .then((user) => {
                if(!user) throw new validationError('Invalid authentication')
                if(bcrypt.compareSync(req.body.password, user.password)){
                    const uniqueId = uuid()

                    const token = jwt.sign({ user, uniqueId }, secret)
                    const appid = user.appid

                    res.status(200).json({ token, appid })

                }else throw new validationError('Invalid authentication');
            }).catch((error) => next(error))
    })

    router.post('/signup', async (req, res, next) => {
        try{
            const result = await app.services.user.create(req.body)
            return res.status(201).json(result[0])
        }
        catch(error) { next(error) }
    })

    router.get('/confirmation/:token', async (req, res, next) => {
        try{
            const decode = jwt.verify(req.params.token, secret)

            const usedIds = await app.db('banedtoken').where({ banedid: decode.uniqueId }).first()
            if(usedIds) res.status(401).json({ error: 'Token has been used before' })

            try{
                const result = await app.services.nodemailer.confirmation(req.params.token)
                await app.db('banedtoken').insert({ banedid: decode.uniqueId }, '*')
                return res.status(302).redirect('http://localhost:4200/success')
            }
            catch(error) { next(error) }

        }
        catch(error) { 
            return res.status(401).json({ error: 'Invalid token' });
        }

    })

    router.post('/recover', (req, res, next) => {
        app.services.user.findOne({ email: req.body.email })
            .then((user) => {
                transporter.sendMail({
                    from: 'silmi22083@gmail.com',
                    to: user.email,
                    subject: 'Weather App',
                    html: `<a href="http://localhost:4200/reset-password">Click here to reset your password.</a>`
                }, (error) => {
                    if(error) throw new validationError(error)
                })

                const uniqueId = uuid()
                const token = jwt.sign({ user, uniqueId }, secret, { expiresIn: '1h' })

                res.status(200).json({ token })
            })
    })

    return router
}