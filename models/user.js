var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");
    

var UserSchema = new mongoose.Schema({
    name:String,
    username: String,
    password: String,
    googleid:String,
    hash:String,
    salt:String
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',UserSchema);