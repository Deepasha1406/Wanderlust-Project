const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const { authorize } = require("passport");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../clodconfig.js");
const upload = multer({storage});

//new route  => it should always be above /:id route
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/")
.get( wrapAsync(listingController.index))  //index route
.post(isLoggedIn,
    upload.single('listing[image]'), 
    validateListing,
    wrapAsync (listingController.createListing)); //create route

router.route("/:id")
.get( wrapAsync(listingController.showListing))  //show route
.put( isLoggedIn,isOwner, validateListing, wrapAsync(listingController.updateListing)) //update route
.delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));   //delete route


//edit route
router.get("/:id/edit",isLoggedIn,isOwner, upload.single('listing[image]'), wrapAsync(listingController.renderEditForm));



 module.exports = router;


