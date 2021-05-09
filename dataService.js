const mysql = require("mysql")
const sql = require("sql-query")
const dbConfigJson = require("./dbConfig.json")

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

    getById(res, id) {
        const query = sql.Query()
            .select()
            .from(this.dbConfig.geoObjectsTable)
            .where({ id: id })
            .build()
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

    usePoolQuery(res, sqlQuery) {
        this.pool.query(sqlQuery, (err, rows) => {
            if (err) {
                console.log(err)
                res.json({ "error": true, "message": "Can't establish database connection." + err })
            }
            const result = rows || "Nothing found"
            res.json(result)
        })
    }
}

module.exports = DataService