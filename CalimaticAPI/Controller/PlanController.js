var express = require('express');
var router = express.Router();
var urlToSqlQuery = require('../Helpers/urlToQuery');

var DataAccess = require('../CalimaticBLL/DataAccess/Base');

var authorized = require('../Auth/auth');
router.use('/agileproject', (req, res, next) => {
    req.TableName = "cmatrix_agile_project";
    req.Dto = require('../DataTransferObjects/AgileProjectDto');
    next();
});

router.use('/agileprojectstates', (req, res, next) => {
    req.TableName = "cmatrix_agile_project_states";
    req.Dto = require('../DataTransferObjects/AgileProjectStatesDto');
    next();
});

router.use('/backlog', (req, res, next) => {
    req.TableName = "cmatrix_agile_backlog";
    req.Dto = require('../DataTransferObjects/BacklogDto');
    next();
});

router.use('/taskboard', (req, res, next) => {
    req.TableName = "cmatrix_agile_backlog";
    req.Dto = require('../DataTransferObjects/BacklogDto');
    next();
});

router.use(urlToSqlQuery);
router.use(authorized);



var routes = () => {

    //GetAllAgileProjects
    router.use('/agileproject', function (req, res, next) {
        console.log(req.sqlQuery)
        DataAccess.GetAll(req, res, () => {
            next();
        });
    }, (req, res, next) => {
        res.status(200).send(req.results)
    })

    router.use('/agileprojectstates', (req, res, next) => {
        console.log(req.sqlQuery)
        DataAccess.GetAll(req, res, () => {
            next();
        });
    }, (req, res, next) => {
        res.status(200).send(req.results)
    })
    router.use('/backlog', async (req, res, next) => {
      
      DataAccess.GetAll(req, res,next).then(()=>{
          
      })
    })
    router.use('/taskboard', async (req, res, next) => {
      
        DataAccess.GetAll(req, res,next).then(()=>{
            
        })
    })
  

    return router;
}


module.exports = routes;

