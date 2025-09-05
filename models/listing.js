const mongoose = require("mongoose");
const { Schema } = mongoose;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        maxLength: [400, "Description cannot be more than 400 characters!"],
    },
    image: {
        url: String,
        filename: String,
    },
    price: {
        type: Number,
        min: 50,
    },
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    category: {
        type: String,
        enum: [
            "Beachfront",
            "City Stays",
            "Mountain Getaways",
            "Historic Homes",
            "Unique Stays",
            "Safari & Wild",
            "Private Islands",
            "Countryside Retreats",
            "Pool Villas",
            "Lakefront",
            "Ski-in/out",
            "Desert Escapes",
        ],
        required: true,
    },
});

// Mongoose POST Middleware to delete all the reviews of listing being deleted.
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
