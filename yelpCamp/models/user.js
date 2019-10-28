var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
	username: String,
	password: String,
});

//plugin authentification 
userSchema.plugin(passportLocalMongoose);

//export 
module.exports = mongoose.model("User", userSchema);