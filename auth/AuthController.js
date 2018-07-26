var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var config = require('../config');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

var VerifyToken = require('./verifyToken');

router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());

var User = require('../user/User');

router.post('/register',function(req,res){
  var hashedPw = bcrypt.hashSync(req.body.password,8);
  User.create({
      name:req.body.name,
      email: req.body.email,
      password: hashedPw
    },
    function(err,user){
      if (err) {
        return res.status(500).send('err')
      }
      var token = jwt.sign({id:user._id},config.secret,{
        expiresIn: 2 * 60 // 60s
      });
      res.status(200).send({auth:true,token:token});
    });
});
router.post('/login',function(req,res){
  User.findOne({name:req.body.name},function(err,user){
    console.log(err,user);
    if (err) {
      return res.status(500).send('user not existed');
    }
    if (bcrypt.compareSync(req.body.password,user.password)) {
      var token = jwt.sign({id:user._id},config.secret,{
        expiresIn: 2 * 60 // 60s
      });
      console.log('login success:',user._id);
      return res.status(200).send({token:token,user:user});
    } else {
      return res.status(500).send('user not existed');
    }
  })
});
function test(res,req,next){
  console.log('just test');
  next();
}
router.get('/me',VerifyToken,test,function(req,res,next){
    User.findById(req.userId,function(err,user){
      console.log('me',err,user);
      if (err) {
        return res.status(500).send('user not existed');
      }
      // res.status(200).send(user);
      next(user);
    });
})

router.use(function(user,req,res,next){
  res.status(200).send(user);
});

router.get('/:id',function(req,res,next){
  if (req.params.id == 1) {
    next('route'); //pass the control to next route to handle
  } else {
    next(); //pass the control to next middleware
  }
},function(req,res,next){
  res.status(200).send('Jay:'+req.params.id);
});

router.get('/:id',function(req,res,next){
  res.status(200).send('JJ:'+req.params.id);
});

router.use(function (req, res, next) {
  if (!req.headers['x-auth']) return next('router');  //will pass control to app callback. see app.js.
  next()
})

router.get('/', function (req, res) {
  res.send('hello, user!')
})
module.exports = router;
