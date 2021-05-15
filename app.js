
const DataService = require("./dataService")
const express = require('express')
const cors = require('cors');
const app = express()
const port = process.env.PORT || 3000
const dataService = new DataService()


app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
app.use(cors());


app.get('/', (req, res) => {
    res.send("Hello world! ")
})

app.get('/geoapi/objects/all', (req, res) => {
    dataService.getAll(res)
})

app.get('/geoapi/objects/:id', (req, res) => {
    dataService.getById(res, parseInt(req.params.id))
})

app.get('/geoapi/getInRadius/', (req, res) => {
    dataService.getInRange(res, parseFloat(req.query.lat), parseFloat(req.query.lng), parseInt(req.query.radius))
})

app.get('/geoapi/filter/', (req, res) => {
    app.use(cors());
    dataService.filter(res, req.query.categories, {
        lat: parseFloat(req.query.lat), lng: parseFloat(req.query.lng), radius: parseInt(req.query.radius)
    })
})

app.get('/geoapi/objects/custom', (req, res) => {
    dataService.getCustom(res)
})

app.post('/geoapi/objects/add/', (req, res) => {
    dataService.add(res, { lat: req.body.lat, lng: req.body.lng, name: req.body.name, categories: req.body.categories })
})

app.listen(port, () => console.log(`Listening on port ${port}...`))

