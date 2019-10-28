var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

router.get('/campgrounds', function(req,res){
    Campground.find({}, function(err, allCampgrounds) {
        if (err){
            console.log(err);
        }
        else {
            res.render("campgrounds/campgrounds", {campgrounds:allCampgrounds});
        }
    })
    //res.render("campgrounds", {campgrounds:campgrounds});
});

router.get("/campgrounds/new", isLoggedIn, function(req,res){
    res.render("campgrounds/new");
});

//SHOW rouote
router.get("/campgrounds/:id", function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }
        else {
            res.render("campgrounds/show", {campground:foundCampground});
        }
    });

});


//EDIT route
router.get("/campgrounds/:id/edit", checkCampgroundOwnership, function(req,res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground:foundCampground});
    });
});

//UPDATE route
router.put("/campgrounds/:id", checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err,updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DESTROY route
router.delete("/campgrounds/:id",checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    });
});

router.post('/campgrounds', isLoggedIn, function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name:name, price:price, image:image, description:desc, author: author};
    Campground.create(newCampground, function(err, newlyCreated){
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("campgrounds/campgrounds");
        } 
    });
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged into do that");
    res.redirect("/login");
}

function checkCampgroundOwnership(req, res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash("error", "Campground not found");
                res.redirect("back");
            } else{
                if(foundCampground.author.id.equals(req.user._id)){
                     next();
                }else{
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }   
            }
        });
    }
    else{
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
}

module.exports = router;


