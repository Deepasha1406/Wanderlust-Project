
const ExpressError = require("./utils/ExpressError.js");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const {listingSchema,reviewSchema} = require("./schema.js");

module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
};


//this route is created because passport reset the (req.session) , so when we store something in sesssion it shows undefined thats why we need to store this in locals
module.exports.saveRedirectUrl = (req,res,next) => {
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req,res,next) =>{
  let { id } = req.params;
  let listing = await Listing.findById(id); 
  if (!listing.owner.equals(res.locals.curUser._id)) {
      req.flash("error", "You are not the owner of this listing");
      return res.redirect(`/listings/${id}`); 
  }
  next();
};

module.exports.validateListing = (req,res,next) =>{
 let {error} = listingSchema.validate(req.body);
  if(error){
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400,errMsg);
  }else{
      next();
  }
};

module.exports.validateReview = (req,res,next) =>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

module.exports.isReviewAuthor = async (req,res,next) =>{
  let {id, reviewId } = req.params;
  let listing = await Listing.findById(id); 
  if (!listing.owner.equals(res.locals.curUser._id)) {
      req.flash("error", "You are not the owner of this listing");
      return res.redirect(`/listings/${id}`); 
  }
  next();
};