const mysql = require("mysql")
const sql = require("sql-query")
const dbConfigJson = require("./dbConfig.json")

class DataService {
    constructor() {
        this.dbConfig = dbConfigJson
        this.getFirstResult = (result) => { return result[0] }
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

    getById(res, id) {
        const query = sql.Query()
            .select()
            .from(this.dbConfig.geoObjectsTable)
            .where({ id: id })
            .build()
        this.usePoolQuery(res, query, this.getFirstResult)
    }

    getInRange(res, lat, lng, radius) {
        this.usePoolQuery(res, `call GETINRADIUS(${lat}, ${lng}, ${radius})`, this.getFirstResult)
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

    usePoolQuery(res, sqlQuery, cleanResult) {
        this.pool.query(sqlQuery, (err, rows) => {
            if (err) {
                console.log(err)
                res.json({ "error": true, "message": "Can't establish database connection." + err })
            }

            if (!rows) {
                res.json("Nothing found")
            } else {
                const result = cleanResult ? cleanResult(JSON.parse(JSON.stringify(rows))) : rows
                res.json(result)
            }
        })
    }
}

module.exports = DataService