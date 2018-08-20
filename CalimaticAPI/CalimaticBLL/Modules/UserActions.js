var request = require('request');
const bcrypt = require('bcrypt');
var DataAccess = require('../DataAccess/Base');
var CustomQuery = require('../../Helpers/CustomQuery');
var UserDto = require('../../DataTransferObjects/UserDto');
var jwt = require('jsonwebtoken');
const UserTable = "cmatrix_user";
var express = require('express');
var app = express();
app.set('jsonWebTokenSecret', '@Password!@#');
module.exports = {

    login: (req, res, callback) => {
        var userName = req.query.username;
        var pas = req.query.password;
        var header = req.headers.authorization;
        if (header == undefined && header == '') {
            if (userName != undefined) {
                var Query = "select * from " + UserTable + " where usr_user_name = " + "'" + userName + "'";
                DataAccess.Get(Query, UserDto, (status, results) => {
                    hasSync(pas, results.password, results.Key, (stauts, results) => {
                        callback(status, results);
                    });

                });

            } else {
                callback(400, { error: true, message: 'No record found' });
            }
        } else {
            getJwtToken(header);
        }


    },
    Register: () => {

    },

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

var hasSync = (pass, UserObj, hash, Key, callback) => {
    bcrypt.compare(pass, UserObj.password, function (err, res) {
        if (res) {
            // Passwords match
            console.log("Hash match" + res)
        }
        else {
            GetDecryptedPassword(hash, (decryptPass) => {
                console.log(decryptPass)
                bcrypt.hash(decryptPass, 10, function (err, hash) {
                    DataAccess.Change("update cmatrix_user set usr_password = '" + hash + "' where usr_key =" + UserObj.Key, (status, results) => {

                        console.log(results)
                        callback(status, results);
                    })
                });
            });
        }
    });
}

var getJwtToken = (userObj, callback) => {
    jwt.sign({
        data: userObj6
    }, app.get('jsonWebTokenSecret'), { expiresIn: 1 }, function (err, token) {
        if (err) {

        } else {
            callback(token)
        }
    });
}

var verifyToken = (token, callback) => {
    jwt.verify(token, app.get('jsonWebTokenSecret'), function (err, decoded) {
        if (error) {
            callback({ error: false, message: 'Successfully Logged in' })
        } else {
            callback({ error: true, message: 'No record found' })
        }// bar
    });
}

