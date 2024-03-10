const router = require('express').Router()

const customersRouter = require('./customers');

router.use('/customers', customersRouter)

module.exports  = router