let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = Schema({
    username: String,
    email: String,
    password: String,
    fname: String,
    lname: String
});

module.exports = mongoose.model('User', UserSchema);