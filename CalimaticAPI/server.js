
var express = require('express');

var app = express();
var port = process.env.port || 1337;

var bodyParser = require('body-parser');
// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: true }));
// create application/json parser
app.use(bodyParser.json());




var indexRouter = require('./routes/index');
// var catalogRouter = require('./routes/routeCatalog'); 




var accountController = require('./Controller/AccountCountroller')();
var planController = require('./Controller/PlanController')();
var productController = require('./Controller/ProductController')();

app.use("/api/saleperson", function(req,res){
    console.log(req.body)
    res.json({"Message":"Welcome to Node js"});
});

app.use("/api/account", accountController);
app.use("/api/plan", planController);
app.use("/api/product", productController);

app.listen(port, function () {
    var datetime = new Date();
    var message = "Server runnning on Port:- " + port + "Started at :- " + datetime;
    console.log(message);
});

