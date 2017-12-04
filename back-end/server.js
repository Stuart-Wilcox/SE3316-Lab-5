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
let Collection = require(path.join(__dirname, '/models/Collection'));
let ctrlProfile = require(path.join(__dirname, '/controllers/profile'));
let ctrlCollections = require(path.join(__dirname, '/controllers/collections'));
let auth = require(path.join(__dirname, '/config/jwt'));

//===GLOBAL VARIABLES===
let app = express();
let router = express.Router();
let port = process.env.PORT || 8080;
app.use(function(err, req, res, next){
  console.log("ERROR HANDLER!!!!")
   if(err.name === 'UnauthorizedError'){
       res.status(401).json({
           message:"Unauthorized"
       });
       return;
   }
   next(err);
});

//===CONFIGURATIONS===
app.use(cookieParser());
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

    user.locked = true;

    user.save(function(err){
        if(err){
            res.status(400).json({
                "message": err.name + ": " + err.message
            });
            return;
        }
        res.status(200).json({
            url:"/accounts/activate/"+user._id
        });
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
          if(user.locked){
            res.status(401).json({message:"account locked"});
          }else{
           token = user.generateJwt();
           res.status(200).json({
                id: user._id,
               token: token
           });
         }
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
                  message: "User deleted"
              })
          });
      }
      else{
          res.status(401).json(info);
      }
  })(req, res, next);
});

router.route("/accounts/activate/:id")
.get(function(req, res){
  let id = req.params.id;
  User.findById(id, function(err, user){
    if(err){
      res.send(err);
    }
    else if(user.locked){
      user.locked = false;
      user.save(function(err){
        if(err){
          res.status(500).json({message:err.message});
        }else{
          res.status(200).json({message:"unlocked successfully"});
        }
      });
    }else{
      res.status(200).json({message: "already unlocked"});
    }
  });
})

router.route("/profile")
.get(auth, ctrlProfile.profileRead);

router.route("/collections")
.post(auth, ctrlCollections.addCollection)
.get(auth, ctrlCollections.getCollections);

router.route("/collections/top")
.get(ctrlCollections.getTopCollections);

router.route("/collections/:id")
.post(auth, ctrlCollections.addImageToCollection)
.get(ctrlCollections.getCollection)
.put(auth, ctrlCollections.updateCollection)
.delete(auth, ctrlCollections.deleteCollection);

router.route("/collections/:id/upvote")
.post(auth, ctrlCollections.upvoteCollection);

router.route("/:id/collections")
.get(auth, ctrlCollections.getUserCollections);

//===DEV ONLY! REMOVE IN PROD==//
router.route("/users")
.get(function(req, res){
  User.find(function(users, err){
    if(err){
      res.send(err);
    }
    else{
      res.json(users);
    }
  });
})
.post(function(req, res){
  let user = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  user.setPassword(req.body.password);

  user.save(function(err){
    if(err){
      res.send(err);
    }else{
      res.json({
        message: "User created"
      });
    }
  });
})
.delete(function(req, res){
  User.remove({_id:req.body.id}, function(err, user){
    if(err){
      res.send(err);
    }else{
      res.json({
        message: `${user.name} deleted`
      })
    }
  });
})
.put(function(req, res){
  User.findById(req.body.id, function(err, user){
    if(err){
      res.send(err);
    }else{
      if(req.body.name){
        user.name = req.body.name;
      }
      if(req.body.email){
        user.email = req.body.email;
      }
      if(req.body.password){
        user.setPassword(req.body.password);
      }
      user.save(function(err){
        if(err){
          res.send(err);
        }
        else{
          res.json({
            message: `${user.name} updated`
          });
        }
      });
    }
  });
});


//===LISTEN===
app.use(passport.initialize());
app.use('/', function(req, res, next){
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});
app.use('/api', router);
app.listen(port);
console.log(`Listening on port ${port}`);
