const mysql = require("mysql")

class DataService {
    constructor() {
        this.pool = mysql.createPool({
            connectionLimit: 100, //important
            host: "localhost",
            user: "nedsqdfz_neds",
            password: "RHjzA9Z9F3LbYU_",
            database: "nedsqdfz_Geography"
        })
    }

    getAll(res) {
        this.usePoolQuery(res, "select * from GeoObjects")
    }

    getById(res, id) {
        this.usePoolQuery(res, `select * from GeoObjects WHERE ID = ${id}`)
    }

    useConnection(res, sqlQuery) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                console.log(err)
                console.log(connection)
                res.json({ "code": 100, "status": "Can't establish database connection." });
                return;
            }
            connection.query(sqlQuery, (err, rows) => {
                connection.release();
                if (!err) {
                    const result = rows || "Nothing found"
                    res.json(result);
                }
            });
            connection.on('error', (err) => {
                res.json({ "code": 100, "status": "Error in connection database" });
                return;
            });
        })
    }

    usePoolQuery(res, sqlQuery) {
        this.pool.query(sqlQuery, (err, rows) => {
            if (err) {
                console.log(err)
                res.json({ "error": true, "message": "Can't establish database connection." + err });
            }
            const result = rows || "Nothing found"
            res.json(result);
        })
    }
}

module.exports = DataService