var express = require('express');
var router = express.Router();
var sql = require("mssql");
var conn = require("../CalimaticBLL/connection/connect")();
var DataAccess = require('../CalimaticBLL/DataAccess/Base');
var urlToSqlQuery = require('../Helpers/urlToQuery');
router.use((req, res, next) => {
    req.TableName = "cmatrix_agile_epic";
    req.Dto = require('../DataTransferObjects/EpicDto');
    next();
});
router.use(urlToSqlQuery);

var routes = function () {
    router.route('/login').get(function (req, res) {
     DataAccess.GetAll(req,res);    
    });
    router.route('/')
        .get(function (req, res) {

            // var sqlQuery = "";
            // if (!CustomQuery.isEmpty(req.query)) {
            //     sqlQuery = CustomQuery.GetQuery(req.query, Epic, EpicDto,(Query)=>{
            //         console.log(Query);
            //         return Query;
            //     });
            // }
            // else {
            //     sqlQuery = "SELECT * FROM cmatrix_agile_epic ";
            // }

            console.log(sqlQuery)

            conn.connect().then(function () {
                var req = new sql.Request(conn);
                req.query(sqlQuery).then(function (recordset) {

                    var EpicRecords = [];
                    recordset.recordset.map(x => {
                        EpicRecords.push(CustomQuery.GetPropertyNameByValue(EpicDto, x))
                    });

                    res.json(EpicRecords);
                    conn.close();
                })
                    .catch(function (err) {
                        conn.close();
                        res.status(400).send("Error while Retrieving data");
                    });
            }).catch(function (err) {
                conn.close();

                res.status(400).send("Connection Error");
            });
        });

    router.route('/')
        .post(function (req, res) {
            conn.connect().then(function () {
                var transaction = new sql.Transaction(conn);
                transaction.begin().then(function () {
                    var request = new sql.Request(transaction);
                    request.input("ProductName", sql.VarChar(50), req.body.ProductName)
                    request.input("ProductPrice", sql.Decimal(18, 0), req.body.ProductPrice)
                    request.execute("Usp_InsertProduct").then(function () {
                        transaction.commit().then(function (recordSet) {
                            conn.close();
                            res.status(200).send(req.body);
                        }).catch(function (err) {
                            conn.close();
                            res.status(400).send("Error while inserting data");
                        });
                    }).catch(function (err) {
                        conn.close();
                        res.status(400).send("Error while inserting data");
                    });
                }).catch(function (err) {
                    conn.close();
                    res.status(400).send("Error while inserting data");
                });
            }).catch(function (err) {
                conn.close();
                res.status(400).send("Error while inserting data");
            });
        });


    router.route('/:id')
        .put(function (req, res) {
            var _productID = req.params.id;
            conn.connect().then(function () {
                var transaction = new sql.Transaction(conn);
                transaction.begin().then(function () {
                    var request = new sql.Request(transaction);
                    request.input("ProductID", sql.Int, _productID)
                    request.input("ProductPrice", sql.Decimal(18, 0), req.body.ProductPrice)
                    request.execute("Usp_UpdateProduct").then(function () {
                        transaction.commit().then(function (recordSet) {
                            conn.close();
                            res.status(200).send(req.body);
                        }).catch(function (err) {
                            conn.close();
                            res.status(400).send("Error while updating data");
                        });
                    }).catch(function (err) {
                        conn.close();
                        res.status(400).send("Error while updating data");
                    });
                }).catch(function (err) {
                    conn.close();
                    res.status(400).send("Error while updating data");
                });
            }).catch(function (err) {
                conn.close();
                res.status(400).send("Error while updating data");
            });
        });


    router.route('/:id')
        .delete(function (req, res) {
            var _productID = req.params.id;
            conn.connect().then(function () {
                var transaction = new sql.Transaction(conn);
                transaction.begin().then(function () {
                    var request = new sql.Request(transaction);
                    request.input("ProductID", sql.Int, _productID)
                    request.execute("Usp_DeleteProduct").then(function () {
                        transaction.commit().then(function (recordSet) {
                            conn.close();
                            res.status(200).json("ProductID:" + _productID);
                        }).catch(function (err) {
                            conn.close();
                            res.status(400).send("Error while Deleting data");
                        });
                    }).catch(function (err) {
                        conn.close();
                        res.status(400).send("Error while Deleting data");
                    });
                }).catch(function (err) {
                    conn.close();
                    res.status(400).send("Error while Deleting data");
                });
            })
        });

    return router;
};
module.exports = routes;