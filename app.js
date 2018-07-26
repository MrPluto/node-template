var express = require('express');
var app = express();
var db = require('./db');

var UserController = require('./user/UserController');
var AuthController = require('./auth/AuthController');

app.use('/users', UserController);
app.use('/auth',AuthController,function(req,res){
  res.status(401).send('not auth');
});


module.exports = app;
