const mongoose = require("mongoose");
const Review = require("./review.js");
const Schema = mongoose.Schema;

const listingSchema = new Schema ({
    title:{
        type : String,
        required:true,
    },
    description: String,
    image: {
       url: String,
       filename: String,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    },
],
owner: {
    type:  Schema.Types.ObjectId,
    ref: "User",
},
});

//this post is created so the review in database will also be deleted with the post 
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id : {$in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;