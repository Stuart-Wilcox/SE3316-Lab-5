let crypto = require('crypto');
let mongoose = require('mongoose');
let jwt = require("jsonwebtoken");
let Schema = mongoose.Schema;


let UserSchema = Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    locked: Boolean,
    hash: String,
    salt: String
});

UserSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString("hex");
};

UserSchema.methods.validPassword = function(password){
    let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString("hex");
    return this.hash === hash;
};

UserSchema.methods.generateJwt = function(){
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        _id: this._id,
        email: this.email,
        name: this.name,
        exp: parseInt(expiry.getTime()/1000),

    }, "MY_SECRET");
};

module.exports = mongoose.model('User', UserSchema);
