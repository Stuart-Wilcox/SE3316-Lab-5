let jwt = require("express-jwt");

let auth = jwt({
    secret: "MY_SECRET",
    userProperty: 'payload',
    fail:function failure(req, res, next){
      if(!req.cookies.token){
        res.status(401).json({error:"Unauthorized Error"});
      }
    },
    getToken: function fromCookies(req){
      let t = req.cookies.token || "";
      return t;
    }
});

module.exports = auth;
