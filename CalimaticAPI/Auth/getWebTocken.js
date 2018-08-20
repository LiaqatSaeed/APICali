

var request = require('request');
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


var GetDecryptedPassword = (pass, callback) => {
    request.post('http://localhost:5000/javaAutomation/GetDecryptedPassword?password=' + pass, { json: true }, function (err, res, body) {
        if (!err && res.statusCode === 200) {
            callback(body);
        }
    });

}



var getJwtToken = (req,res,next) => {
    console.log(req.WebSecret)
    jwt.sign(req.UserInfo,req.WebSecret, function (err, token) {
        if (err) {
          res.status(500).send('Internal Server Error')
        } else {
          res.send({
              token:token,
              UserInfo:req.UserInfo,
        });
           
        }
    });
}


module.exports = (req, res,next) => {
    bcrypt.compare(req.body.password, req.UserInfo.password, function (err, response) {
        if (response) {
       
            getJwtToken(req,res);
          
        }
        else {
            GetDecryptedPassword(req.query.password, (decryptPass) => {
                bcrypt.hash(decryptPass, 10, function (err, hash) {
                    DataAccess.Change("update cmatrix_user set usr_password = '" + hash + "' where usr_key =" + UserObj.Key, (status, results) => {
                        req.UserInfo.password = hash;
                        getJwtToken(req,res);
                    })
                });
            });
        }
    });
}
