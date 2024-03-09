const customers = require('express').Router();
const uuid = require('../helpers/uuid')

const { readFromFile, readAndAppend} = require('../helpers/fsUtils');

//GET Route for retrieving all the customers
customers.get('/', (req, res) => {
    console.info(`${req.method} request received for customers`);
    readFromFile('../db/customers.json').then((data) => res.json(JSON.parse(data)))
})

customers.post('/', (req, res) => {
    console.info(`${req.method} request received to add a customer`);

    const { name, tag, ro, contact, model } = req.body;

    if(req.body) {
        const newCustomer = {
            id: uuid(),
            name,
            tag,
            ro,
            contact,
            model,
        }

        readAndAppend(newCustomer, './db/customers.json');
        res.json(`Customer added succesfully `)
    } else {
        res.error('Error adding customer')
    }
})

module.exports = customers