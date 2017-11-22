//server.js

//===DEPENDENCIES===
let express = require('express');
let path = require('path');
let favicon = require("serve-favicon");
let cookieParser = require("cookie-parser");
let bodyParser = require('body-parser');
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let mongoose = require('mongoose');
let User = require(path.join(__dirname, '/models/User'));
let jwt = require("express-jwt");
let ctrlProfile = require(path.join(__dirname, '/controllers/profile'));

//===GLOBAL VARIABLES===
let app = express();
let router = express.Router();
let port = process.env.PORT || 8080;
let auth = jwt({
    secret: "MY_SECRET",
    userProperty: 'payload'
})

//===CONFIGURATIONS===
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017', {useMongoClient: true});
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
    function(username, password, done){
        User.findOne({email: username}, function(err, user){
            if(err){
                return done(err);
            }
            if(!user){
                return done(null, false, {
                    message: "User not found"
                });
            }
            if(!user.validPassword(password)){
                return done(null, false, {
                    message: "Password is wrong"
                });
            }
            return done(null, user);
        });
    }
));

//===CREATE MIDDLEWARE LOGIC===
router.route("/register")
.post(function(req, res){
    let user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    
    user.setPassword(req.body.password);
    
    user.save(function(err){
        if(err){
            res.status(400).json({
                "message": err.name + ": " + err.message
            });
            return;
        }
        let token;
        token = user.generateJwt();
        res.json({
            "token":token
        })
    })
});

router.route("/login")
.post(function(req, res, next){
    passport.authenticate('local', function(err, user, info){
       let token;
       if(err){
           res.status(404).json(err);
           return;
       }
       
       if(user){
           token = user.generateJwt();
           res.status(200).json({
               "token":token
           });
       }
       else{
           res.status(401).json(info);
       }
    })(req, res, next);
});

router.route("/remove-profile")
.delete(function(req, res, next){
  passport.authenticate('local', function(err, user, info){
      if(err){
          res.status(404).json(err);
          return;
      }
       
      if(user){
          //delete user
          User.remove({email: req.body.email}, function(err, _user){
              if(err){
                  res.status(404).json(err);
                  return;
              }
              res.status(200).json({
                  "message": "User deleted"
              })
          });
      }
      else{
          res.status(401).json(info);
      }
  })(req, res, next);
});

router.route("/profile/:userId")
.get(auth, ctrlProfile.profileRead);


//===LISTEN===
app.use(passport.initialize());
app.use('/', function(req, res, next){
  console.log(`[${req.method}] ${req.originalUrl}`); 
  next();
});
app.use(function(err, req, res, next){
   if(err.name === 'UnauthorizedError'){
       res.status(401).json({
           "message": err.name + ": " + err.message
       });
       return;
   }
   next();
});
app.use('/api', router);
app.listen(port);
console.log(`Listening on port ${port}`);