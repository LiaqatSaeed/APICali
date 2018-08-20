var express = require('express');
var router = express.Router();
var urlToSqlQuery = require('../Helpers/urlToQuery');



const bcrypt = require('bcrypt');
var DataAccess = require('../CalimaticBLL/DataAccess/Base');

var Helpers = require('../Helpers/CustomQuery');

var authorized = require('../Auth/auth');

var getWebTocken = require('../Auth/getWebTocken');
router.use((req, res, next) => {
    req.TableName = "cmatrix_user";
    req.Dto = require('../DataTransferObjects/UserDto');
    next();
});
router.use(urlToSqlQuery);
router.use('/Users',authorized);
var routes = function () {

    router.use('/login', function (req, res, next) {
       
     req.sqlQuery = "Select * from "+ req.TableName +" where usr_user_name = '"+ req.body.username+"'";
     console.log(req.sqlQuery)    
     DataAccess.Get(req,res,(results)=>{
            next()
        })

      }, function (req, res, next) {
        if (!Helpers.isEmpty(req.results)){
            req.UserInfo = req.results;
            getWebTocken(req,res,next);
        }
        else{
          res.status(204).send({error:'Invalid username'})
        }
        
      })


      router.use('/Users', function (req, res, next) {
        DataAccess.GetAll(req,res,next);
      })

    // router.route('/Users')
    //     .get(function (req, res,next) {
    //         console.log(req.sqlQuery)
    //          DataAccess.GetAll(req,res,next);
         
    //         //  UserAction.login(req,res,next,(status,results)=>{
    //         //     if(status != 400){
    //         //         res.status(status).send(results);
    //         //     }
    //         //     else{
    //         //         res.json(results);
    //         //     }
    //         //     console.log()
    //         //     next();
    //         // });
    //         //next();
    //         // console.log();
    //         // var bufferPassword= CustomQuery.stringToByte(req.query.password.toString())
    //         // console.log(req.headers.authorization)
    //         // conn.connect().then(function () {
    //         //     var req = new sql.Request(conn);
    //         //     var Query = "select * from "+ UserTable +" where usr_user_name = " + "'" + userName + "'";
    //         //     console.log(Query)
    //         //     req.query(Query).then(function (recordset) {
    //         //         var User = {};
    //         //         conn.close();
    //         //         recordset.recordset.map(x => {
    //         //             User = CustomQuery.GetPropertyNameByValue(UserDto, x);
    //         //         });
    //         //         if (!CustomQuery.isEmpty(User)) {
    //         //             res.json({
    //         //                 error: false,
    //         //                 results: User
    //         //             });
    //         //         }
    //         //         else {
    //         //             res.json({
    //         //                 error: true,
    //         //                 results: "invalid Username Password"
    //         //             });
    //         //         }

    //         //     })
    //         //         .catch(function (err) {
    //         //             conn.close();
    //         //             res.status(400).send("Error while Retrieving data");
    //         //         });
    //         // }).catch(function (err) {
    //         //     conn.close();

    //         //     res.status(400).send("Connection Error");
    //         // });

    //     });

    router.route('/login')
        .post(function (req, res,next) {
        DataAccess.Get("Select * from "+ req.TableName +" where usr_user_name = '"+ req.body.username+"'",req.Dto,(results)=>{
            getWebTocken(req,res);
            })
           
            
            // conn.connect().then(function () {
            //     var transaction = new sql.Transaction(conn);
            //     transaction.begin().then(function () {
            //         var request = new sql.Request(transaction);
            //         request.input("ProductName", sql.VarChar(50), req.body.ProductName)
            //         request.input("ProductPrice", sql.Decimal(18, 0), req.body.ProductPrice)
            //         request.execute("Usp_InsertProduct").then(function () {
            //             transaction.commit().then(function (recordSet) {
            //                 conn.close();
            //                 res.status(200).send(req.body);
            //             }).catch(function (err) {
            //                 conn.close();
            //                 res.status(400).send("Error while inserting data");
            //             });
            //         }).catch(function (err) {
            //             conn.close();
            //             res.status(400).send("Error while inserting data");
            //         });
            //     }).catch(function (err) {
            //         conn.close();
            //         res.status(400).send("Error while inserting data");
            //     });
            // }).catch(function (err) {
            //     conn.close();
            //     res.status(400).send("Error while inserting data");
            // });
        });


    // router.route('/:id')
    //     .put(function (req, res) {
    //         var _productID = req.params.id;

    //         console.log("update DAta");
    //         conn.connect().then(function () {
    //             var transaction = new sql.Transaction(conn);
    //             transaction.begin().then(function () {
    //                 var request = new sql.Request(transaction);
    //                 // request.input("ProductID", sql.Int, _productID)
    //                 // request.input("ProductPrice", sql.Decimal(18, 0), req.body.ProductPrice)
    //                 // request.execute("Usp_UpdateProduct").then(function () {
    //                 //     transaction.commit().then(function (recordSet) {
    //                 //         conn.close();
    //                 //         res.status(200).send(req.body);
    //                 //     }).catch(function (err) {
    //                 //         conn.close();
    //                 //         res.status(400).send("Error while updating data");
    //                 //     });
    //                 // }).catch(function (err) {
    //                 //     conn.close();
    //                 //     res.status(400).send("Error while updating data");
    //                 // });



    //                 request.query("update cmatrix_user set usr_last_name = 'Swami1' where usr_key = 13").then(function (recordset) {
    //                     var User = {};

    //                     transaction.commit().then(function (recordSet) {
    //                         conn.close();
    //                         console.log(recordset)
    //                         res.status(200).send(req.body);
    //                     }).catch(function (err) {
    //                         conn.close();
    //                         res.status(400).send("Error while updating data");
    //                     });


    //                 })
    //                     .catch(function (err) {
    //                         conn.close();
    //                         res.status(400).send("Error while Retrieving data");
    //                     });



    //             }).catch(function (err) {
    //                 conn.close();
    //                 res.status(400).send("Error while updating data");
    //             });
    //         }).catch(function (err) {
    //             conn.close();
    //             res.status(400).send("Error while updating data");
    //         });
    //     });
    // router.route('/updatePassword/:id')
    //     .put(function (req, res) {
    //         var _productID = req.params.id;

    //         console.log("update DAta");
    //         conn.connect().then(function () {
    //             var transaction = new sql.Transaction(conn);
    //             transaction.begin().then(function () {
    //                 var request = new sql.Request(transaction);
    //                 // request.input("ProductID", sql.Int, _productID)
    //                 // request.input("ProductPrice", sql.Decimal(18, 0), req.body.ProductPrice)
    //                 // request.execute("Usp_UpdateProduct").then(function () {
    //                 //     transaction.commit().then(function (recordSet) {
    //                 //         conn.close();
    //                 //         res.status(200).send(req.body);
    //                 //     }).catch(function (err) {
    //                 //         conn.close();
    //                 //         res.status(400).send("Error while updating data");
    //                 //     });
    //                 // }).catch(function (err) {
    //                 //     conn.close();
    //                 //     res.status(400).send("Error while updating data");
    //                 // });



    //                 request.query("update cmatrix_user set usr_last_name = 'Swami1' where usr_key = 13").then(function (recordset) {
    //                     var User = {};

    //                     transaction.commit().then(function (recordSet) {
    //                         conn.close();
    //                         console.log(recordset)
    //                         res.status(200).send(req.body);
    //                     }).catch(function (err) {
    //                         conn.close();
    //                         res.status(400).send("Error while updating data");
    //                     });


    //                 })
    //                     .catch(function (err) {
    //                         conn.close();
    //                         res.status(400).send("Error while Retrieving data");
    //                     });



    //             }).catch(function (err) {
    //                 conn.close();
    //                 res.status(400).send("Error while updating data");
    //             });
    //         }).catch(function (err) {
    //             conn.close();
    //             res.status(400).send("Error while updating data");
    //         });
    //     });

    // router.route('/:id')
    //     .delete(function (req, res) {
    //         var _productID = req.params.id;
    //         conn.connect().then(function () {
    //             var transaction = new sql.Transaction(conn);
    //             transaction.begin().then(function () {
    //                 var request = new sql.Request(transaction);
    //                 request.input("ProductID", sql.Int, _productID)
    //                 request.execute("Usp_DeleteProduct").then(function () {
    //                     transaction.commit().then(function (recordSet) {
    //                         conn.close();
    //                         res.status(200).json("ProductID:" + _productID);
    //                     }).catch(function (err) {
    //                         conn.close();
    //                         res.status(400).send("Error while Deleting data");
    //                     });
    //                 }).catch(function (err) {
    //                     conn.close();
    //                     res.status(400).send("Error while Deleting data");
    //                 });
    //             }).catch(function (err) {
    //                 conn.close();
    //                 res.status(400).send("Error while Deleting data");
    //             });
    //         })
    //     });

    return router;
};


var BcryptPassword = (password) => {
    bcrypt.compare(password, hash, function (err, res) {
        if (res) {
            // Passwords match
        } else {


            // bcrypt.hash('myPassword', 10, function(err, hash) {
            //     bcrypt.compare('somePassword', hash, function(err, res) {
            //         if(res) {
            //          // Passwords match
            //         } else {
            //             bcrypt.hash('myPassword', 10, function(err, hash) {

            //             });
            //         } 
            //       });
            // });
        }
    });
}

var GetTockenKey = (CmpKey, UsrKey) => {
    
}



var hasSync = (req,res) => {
   
}
var GetDecryptedPassword = (pass, callback) => {
    // https.get('http://localhost:5000/Account/GetDecryptedPassword?password=UaUIPfvG0ZE=', (resp) => {
    //     let data = '';

    //     // A chunk of data has been recieved.
    //     resp.on('data', (chunk) => {
    //         data += chunk;
    //     });

    //     // The whole response has been received. Print out the result.
    //     resp.on('end', () => {
    //         console.log(JSON.parse(data));
    //         // console.log(JSON.parse(data).explanation);
    //     });

    // }).on("error", (err) => {
    //     console.log("Error: " + err.message);
    // });
    request.post('http://localhost:5000/javaAutomation/GetDecryptedPassword?password=' + pass, { json: true }, function (err, res, body) {
        if (!err && res.statusCode === 200) {
            callback(body);
        }
    });

}


var GetWebTocken = (req, res, next) => {
    jwt.sign({
        data: req.UserInfo
    }, req.WebSecret, { expiresIn: 1 }, function (err, token) {
        if (!err) {
            res.send(token)
        } else {
            res.send(err)
        }
    });
}





module.exports = routes;