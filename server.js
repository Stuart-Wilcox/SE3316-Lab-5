//server.js

//===DEPENDENCIES===
let express = require('express');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let path = require('path');
let User = require(path.join(__dirname, '/models/User'));

//===GLOBAL VARIABLES===
let app = express();
let router = express.Router();
let port = process.env.PORT || 8080;

//===CONFIGURATIONS===
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017', {useMongoClient: true});


//===CREATE MIDDLEWARE LOGIC===
router.route('/status')// r^/api/status/$
.get(function(req, res){
    console.log("Served");
   res.send("Status: running."); 
});


//===LISTEN===
app.use('/', function(req, res, next){
  console.log(`[${req.method}] ${req.originalUrl}`); 
  next();
});
app.use('/api', router);
app.listen(port);
console.log(`Listening on port ${port}`);