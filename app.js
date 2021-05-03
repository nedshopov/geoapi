
const DataService = require("./dataService")
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const dataService = new DataService()

app.get('/', (req, res) => {
    res.send("Hello world! ")
})

app.get('/geoapi/objects/all', (req, res) => {
    dataService.getAll(res)
})

app.get('/geoapi/objects/:id', (req, res) => {
    dataService.getById(res, parseInt(req.params.id))
})

app.listen(port, () => console.log(`Listening on port ${port}...`))

