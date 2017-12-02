let mongoose = require("mongoose");
let User = mongoose.model("User");

module.exports.profileRead = function(req, res){
    //req.payload is the user returned from the jwt authentication
    if(!req.payload._id){
        res.status(401).json({
            message: "UnauthorizedError: private profile"
        });
    }
    else{
        User.findById(req.payload._id)
        .exec(function(err, user){
           if(err){
               res.status(400).json({
                   message:err.name + ": " + err.message
               });
               return;
           }
           else if(user.locked){
             res.status(404).json({
               message:"Account locked"
             });
             return;
           }else{
             res.status(200).json({
              name: user.name,
              email: user.email,
              id: user._id
            });
          }
        });
    }
}
