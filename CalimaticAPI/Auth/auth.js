

var jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    if(req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === "Bearer"){
        console.log(req.headers)
        jwt.verify(req.headers.authorization.split(' ')[1], req.WebSecret, function (err, decoded) {
            console.log(err);
            if (!err) {
                console.log(decoded);
                req.UserInfo = decoded;
             next()
            } else {
                console.log('This is the first')
                res.status(401).send('Not Authorized');
            }// bar
        });
    }else{
        console.log('This is the second')
        res.status(401).send('Not Authorized');
    }

}