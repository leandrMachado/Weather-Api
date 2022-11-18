const app = require('express')()
const consign = require('consign')

const knex = require('knex')
const knexfile = require('../knexfile')

app.db = knex(knexfile.test)

consign({ cwd: 'src', verbose: false })
  .include('./config/middlewares.js')
  .then('./services')
  .then('./routes')
  .then('./config/routes.js')
  .into(app)

app.get('/', (req, res) => {
  return res.status(200).sendFile(__dirname + '/public/index.html')
})

module.exports = app
