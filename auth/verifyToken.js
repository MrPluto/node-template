var config = require('../config');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');



function verifyToken(req,res,next){

  var token = req.headers['access-token'];
  if (!token) {
    return res.status(500).send('token missing')
  }
  jwt.verify(token,config.secret,function(err,decoded){
    if (err) {
      return res.status(500).send('fail to auth');
    }

    req.userId = decoded.id;
    next();
  })
}


module.exports = verifyToken;
