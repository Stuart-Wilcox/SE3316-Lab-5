let mongoose = require("mongoose");
let User = mongoose.model("User");

module.exports.profileRead = function(req, res){
    console.log(req.payload);
    if(!req.payload._id){
        res.status(401).json({
            "message": "UnauthorizedError: private profile"
        });
    }
    else{
        User.findById(req.payload_id)
        .exec(function(err, user){
           if(err){
               res.status(400).json({
                   "message":err.name + ": " + err.message
               })
               return;
           }
           res.status(200).json(user);
        });
    }
}