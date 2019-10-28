//var decleration
var express = require("express");
var app = express();
var port = 3000;
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var seedDB = require("./seeds");
var passport = require("passport");
var  localStrategy = require("passport-local");
var User = require("./models/user");
var methodOverride = require("method-override");
var flash = require("connect-flash");

var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var authRoutes = require("./routes/auth");

//var passportLocalMongoose = require("passport-local-mongoose"); //required in ./models/user

//fill database with dummy data
//seedDB(); 

app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public")); //tells app where to find CSS
app.use(flash());

//passport config
app.use(require("express-session")({
    secret: "She bad, she know she bad",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//use files containing all the routes
app.use(commentRoutes);
app.use(campgroundRoutes); 
app.use(authRoutes);

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set("view engine", "ejs");


//handle deprication warnings
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

//connect to DB
mongoose.connect("mongodb://localhost:27017/yelp_camp");

app.listen(port, () => console.log(`Now serving your app on port ${port}!`));

/* Deprecated hard coding method
Campground.create({
    name: "Granite Hill", 
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
    description: "This is an imagey image that depicts an image"
},function(err, campground){
    if(err){
        console.log("UH OH ERROR!");
    }
    else{
        console.log("New Created Capground!");
        console.log(campground);
    }
});
*/