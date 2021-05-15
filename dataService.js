const mysql = require("mysql")
const sql = require("sql-query")
const dbConfigJson = require("./dbConfig.json")
const FiltersService = require("./filtersService")
const _ = require("lodash")
const filtersService = new FiltersService()

class DataService {
    constructor() {
        this.dbConfig = dbConfigJson
        this.pool = mysql.createPool({
            connectionLimit: this.dbConfig.connectionLimit,
            host: this.dbConfig.host,
            user: this.dbConfig.user,
            password: this.dbConfig.password,
            database: this.dbConfig.dbName
        })
    }

    getAll(res) {
        const query = sql.Query()
            .select()
            .from(this.dbConfig.geoObjectsTable)
            .build()
        this.usePoolQuery(res, query)
    }

    getCustom(res) {
        const query = sql.Query()
            .select()
            .from(this.dbConfig.geoObjectsTable)
            .where({ isCustom: 1 })
            .build()
        this.usePoolQuery(res, query)
    }

    getById(res, id) {
        const query = sql.Query()
            .select()
            .from(this.dbConfig.geoObjectsTable)
            .where({ id: id })
            .build()
        this.usePoolQuery(res, query, filtersService.getFirstResult)
    }

    getInRange(res, lat, lng, radius) {
        if (lat === NaN || lng === NaN || radius === NaN) {
            res.json({ "code": 100, "status": "Filters missing" })
            return
        }

        this.usePoolQuery(res, `call GETINRADIUS(${lat}, ${lng}, ${radius})`, filtersService.getFirstResult)
    }

    filter(res, categories, filters) {
        const withGeoFilters = (filters.lat || filters.lng || filters.radius)
        if (withGeoFilters && (!filters.lat || !filters.lng || !filters.radius)) {
            res.json({ "code": 100, "status": "Filters missing" })
            return
        }

        const postProcess = categories ? filtersService.getFiltersPredicate(categories, false) : undefined
        const query = withGeoFilters
            ? `call GETINRADIUS(${filters.lat}, ${filters.lng}, ${filters.radius})`
            : sql.Query()
                .select()
                .from(this.dbConfig.geoObjectsTable)
                .build()

        this.usePoolQuery(res, query, postProcess)
    }

    add(res, parameters) {
        const query = sql.Query()
            .insert()
            .into(this.dbConfig.geoObjectsTable)
            .set({ name: parameters.name, categories: parameters.categories, lng: parameters.lng, lat: parameters.lat, isCustom: 1 })
            .build()
        console.log("query" + query)
        this.usePoolQuery(res, query)
    }

    useConnection(res, sqlQuery) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                console.log(err)
                console.log(connection)
                res.json({ "code": 100, "status": "Can't establish database connection." })
                return
            }
            connection.query(sqlQuery, (err, rows) => {
                connection.release()
                if (!err) {
                    const result = rows || "Nothing found"
                    res.json(result)
                }
            })
            connection.on('error', (err) => {
                res.json({ "code": 100, "status": "Error in connection database" })
                return
            })
        })
    }

    usePoolQuery(res, sqlQuery, postProcess) {
        this.pool.query(sqlQuery, (err, rows) => {
            if (err) {
                console.log(err)
                res.json({ "error": true, "message": "Can't establish database connection." + err })
            }

            if (!rows) {
                res.json("Nothing found")
            } else {
                const result = postProcess ? postProcess(JSON.parse(JSON.stringify(rows))) : rows
                res.json(result)
            }
        })
    }
}

module.exports = DataService