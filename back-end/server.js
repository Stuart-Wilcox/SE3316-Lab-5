//server.js

//===DEPENDENCIES===
let express = require('express');
let path = require('path');
let favicon = require("serve-favicon");
let cookieParser = require("cookie-parser");
let bodyParser = require('body-parser');
//let passport = require('passport');
//let LocalStrategy = require('passport-local').Strategy;
let mongoose = require('mongoose');
let User = require(path.join(__dirname, '/models/User'));
let Collection = require(path.join(__dirname, '/models/Collection'));
let ctrlProfile = require(path.join(__dirname, '/controllers/profile'));
let ctrlCollections = require(path.join(__dirname, '/controllers/collections'));
let auth = require(path.join(__dirname, '/config/jwt'));
let passport = require(path.join(__dirname, '/config/passport'));
let mailer = require(path.join(__dirname, '/config/nodemailer'));

//===GLOBAL VARIABLES===
let app = express();
let router = express.Router();
let port = process.env.PORT || 8080;

//===CONFIGURATIONS===
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017', {useMongoClient: true});

//===CREATE MIDDLEWARE LOGIC===


router.route("/register")
.post(function(req, res){

    if(!req.body.name||!req.body.email||!req.body.password){
      //the request doesnt have the info needed to make a new user
      res.status(400).json({message:"Missing information"});
      return;
    }

    //make a new user with appropriate attributes
    let user = new User();
    user.name = req.body.name;
    user.email = req.body.email;

    user.setPassword(req.body.password);

    user.locked = true;//user stays locked until activation link is visited

    user.save(function(err){
        if(err){
            res.status(400).json({
                "message": err.name + ": " + err.message
            });
            return;
        }else{
          res.status(200).json({
              mesage:"Link sent"
          });
          /*SEND EMAIL TO PERSON*/
          mailer.sendMail(user.email, `http://localhost:4200/accounts/activate/${user._id}`);
        }
    });
});

router.route("/resend-validation")
.post(function(req, res){
  if(!req.body.email){
    res.status(400).json({message:"No email included"});
    return;
  }

  User.find({email:req.body.email}, function(err, user){
    if(err){
      res.status(400).json(err);
    }else{
      res.status(200).json({message:"Link sent"});

      mailer.sendMail(user.email, `http://localhost:4200/accounts/activate/${user._id}`);
    }
  });
})

router.route("/login")
.post(function(req, res, next){
    passport.authenticate('local', function(err, user, info){
       if(err){
         //something went wrong
         res.status(404).json(err);
         return;
       }

       if(user){
          if(user.locked){
            //user has not yet visited the activation link
            res.status(401).json({message:"account locked"});
          }else{
            //all good
            let token = user.generateJwt();
            res.status(200).json({
                id: user._id,
                token: token
             });
         }
       }
       else{
           res.status(401).json(info);
       }
    })(req, res, next);//make sure you call the function
});

router.route("/accounts/activate/:id")
.get(function(req, res){
  //activation link
  let id = req.params.id;
  User.findById(id, function(err, user){
    if(err){
      //something wrong
      res.status(400).json(err);
    }
    else if(user.locked){
      //user is currently locked
      user.locked = false;
      user.save(function(err){
        if(err){
          res.status(500).json({message:err.message});
        }else{
          //the good case
          res.status(200).json({message:"unlocked successfully"});
        }
      });
    }else{
      //user has already been unlocked
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
.get(auth, ctrlCollections.getCollection)
.put(auth, ctrlCollections.updateCollection)
.delete(auth, ctrlCollections.deleteCollection);

router.route("/collections/public/:id")
.get(ctrlCollections.getPublicCollection);

router.route("/collections/:id/upvote")
.post(auth, ctrlCollections.upvoteCollection);

router.route("/:id/collections")
.get(auth, ctrlCollections.getUserCollections);

// //===DEV ONLY! REMOVE IN PROD==//
// router.route("/users")
// .get(function(req, res){
//   User.find(function(users, err){
//     if(err){
//       res.send(err);
//     }
//     else{
//       res.json(users);
//     }
//   });
// })
// .post(function(req, res){
//   let user = new User();
//   user.name = req.body.name;
//   user.email = req.body.email;
//   user.setPassword(req.body.password);
//
//   user.save(function(err){
//     if(err){
//       res.send(err);
//     }else{
//       res.json({
//         message: "User created"
//       });
//     }
//   });
// })
// .delete(function(req, res){
//   User.remove({_id:req.body.id}, function(err, user){
//     if(err){
//       res.send(err);
//     }else{
//       res.json({
//         message: `${user.name} deleted`
//       })
//     }
//   });
// })
// .put(function(req, res){
//   User.findById(req.body.id, function(err, user){
//     if(err){
//       res.send(err);
//     }else{
//       if(req.body.name){
//         user.name = req.body.name;
//       }
//       if(req.body.email){
//         user.email = req.body.email;
//       }
//       if(req.body.password){
//         user.setPassword(req.body.password);
//       }
//       user.save(function(err){
//         if(err){
//           res.send(err);
//         }
//         else{
//           res.json({
//             message: `${user.name} updated`
//           });
//         }
//       });
//     }
//   });
// });


//===LISTEN===
app.use(passport.initialize());

//log requests as they come in
app.use('/', function(req, res, next){
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

app.use('/api', router);
app.listen(port);

console.log(`Listening on port ${port}`);
