

var sql = require("mssql");
var conn = require("../connection/connect")();
var CustomQuery = require('../../Helpers/CustomQuery');



var Actions = {
    GetAll: async (req, res, next) => {
        try {

          await  getConnection(async (pool) => {console.log(req.sqlQuery)
                let result = await pool.request()
                    .query(req.sqlQuery).then((recordset)=>{
                        var results = [];
                        recordset.recordset.map(x => {
                            results.push(CustomQuery.GetPropertyNameByValue(req.Dto, x))
                        });
                        req.results = results;
                        res.status(200).send(results)
    
                        sql.close();
                        
                    });

               
            });

        } catch (error) {
            console.log(error)
        }




        //try {
        //      conn.connect().then(function () {
        //         var request = new sql.Request(conn);
        //           request.query(req.sqlQuery).then(  (recordset) => {
        //             var results = [];
        //             recordset.recordset.map(x => {
        //                 results.push(CustomQuery.GetPropertyNameByValue(req.Dto, x))
        //             });
        //              conn.close();
        //             req.results = results;
        //              next(results)
        //             //res.status(500).jsonp(results);
        //         })
        //             .catch(function (err) {
        //                 conn.close();
        //                 res.status(500).jsonp({error: 'Internal server error'});
        //             });
        //     })
        //     .catch(function (err) {
        //         conn.close();
        //         res.status(500).jsonp({error: 'Internal server error'});
        //     });
        // } catch (error) {
        //     console.log(error)
        // }

    },

    Get: (req, res, next) => {

        conn.connect().then(function () {
            var request = new sql.Request(conn);

            request.query(req.sqlQuery).then(function (recordset) {
                var results = {};
                recordset.recordset.map(x => {
                    // results.push(CustomQuery.GetPropertyNameByValue(Dto, x))
                    results = CustomQuery.GetPropertyNameByValue(req.Dto, x)
                });
                //res.json(results);
                conn.close();
                req.results = results;
                next(results)
            })
                .catch(function (err) {
                    conn.close();
                    res.status(500).jsonp({ error: 'Internal server error' });
                });
        }).catch(function (err) {
            conn.close();
            res.status(500).jsonp({ error: 'Internal server error' });
        });

    },

    Add: () => {
        var conn = new sql.Connection(dbConfig);

        conn.connect()
            // Successfull connection
            .then(function () {

                // Create request instance, passing in connection instance
                var req = new sql.Request(conn);

                // Call mssql's query method passing in params
                req.query("SELECT * FROM [SalesLT].[Customer]")
                    .then(function (recordset) {
                        console.log(recordset);
                        conn.close();
                    })
                    // Handle sql statement execution errors
                    .catch(function (err) {
                        console.log(err);
                        conn.close();
                    })

            })
            // Handle connection errors
            .catch(function (err) {
                console.log(err);
                conn.close();
            });
    },

    Change: (Query, callback) => {
        console.log("update DAta");
        conn.connect().then(function () {
            var transaction = new sql.Transaction(conn);
            transaction.begin().then(function () {
                var request = new sql.Request(transaction);

                request.query(Query).then(function (recordset) {
                    var User = {};

                    transaction.commit().then(function (recordSet) {
                        conn.close();
                        callback(200, { erro: false, data: recordset })
                        //res.status(200).send(req.body);
                    }).catch(function (err) {
                        conn.close();
                        callback(500, { erro: true, message: "Internal Server Error" })
                    });


                })
                    .catch(function (err) {
                        conn.close();
                        callback(500, { erro: true, message: "Internal Server Error" })
                    });



            }).catch(function (err) {
                conn.close();
                callback(500, { erro: true, message: "Internal Server Error" })
            });
        }).catch(function (err) {
            conn.close();
            callback(500, { erro: true, message: "Internal Server Error" })
        });
    },

    Delete: () => {

    }
}

module.exports = Actions;

//Select All


getConnection = async (callback) => {
   
    let pool = conn.connected != true ? await conn.connect():conn;
    if (pool.connected) {

      callback(pool);
    }
    else {
        getConnection(callback);
    }
    
}