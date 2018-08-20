var sql = require("mssql");
var connect = function () {
    var conn = new sql.ConnectionPool({
        user: 'sa',
        password: 'liaqat',
        server: 'LAPTOP-05A8VMJ1',
        database: 'CaliberMatrix',
        connectionTimeout: 300000,
        requestTimeout: 300000,
        pool: {
            idleTimeoutMillis: 300000,
            max: 100
        }
    });
    conn.on('error', err => {
        // ... error handler 
        console.log('sql errors', err);
    });

    return conn;
};

module.exports = connect;