const express = require('express')
const path = require('path')

const api = require('./routes/index')

const PORT = 3001

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static('../frontend/public'))

app.use('/api', api)

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../frontend/public/index.html')))

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);

