const app = require('express')()
const consign = require('consign')
const cors = require('cors')
const winston = require('winston');
const { uuid } = require('uuidv4');

const knex = require('knex')
const knexfile = require('../knexfile')

app.db = knex(knexfile.test)
app.use(cors())

app.log = winston.createLogger({
    level: 'debug',
    transports: [
      new winston.transports.Console({ format: winston.format.json({ space: 1 }) }),
      new winston.transports.File({
        filename: 'log/error.log',
        level: 'warn',
        format: winston.format.combine(winston.format.timestamp(), winston.format.json({ space: 1 })),
      }),
    ],
})
  

consign({ cwd: 'src', verbose: false })
    .include('./config/passport.js')
    .include('./config/middlewares.js')
    .include('./services')
    .include('./routes')
    .include('./config/router.js')
    .into(app);

app.get('/', (req, res, next) => {
    return res.status(200).send()
})

app.use((err, req, res, next) => {
    const { name, message, stack } = err

    if(name === 'validationError') res.status(400).json({ error: message })
    else {
        const id = uuid();
        app.log.error(id + ': ' + name + message + stack);
        res.status(500).json({ id, error: 'Erro de sistema!' });
    }
      next(err);
})

// NOTA: CODIGO PARA CNFIGURAR O ENVIO DA NEWSLETTER

module.exports = app