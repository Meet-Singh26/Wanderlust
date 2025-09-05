const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchemaJoi, ratingSchemaJoi } = require("./schemaJoi.js");

// to validate Listing schema joi
module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchemaJoi.validate(req.body);
    if (error) {
        throw new ExpressError(400, error);
    } else {
        next();
    }
};

// to validate Review schema joi
module.exports.validateReview = (req, res, next) => {
    const { error } = ratingSchemaJoi.validate(req.body);
    if (error) {
        throw new ExpressError(400, error);
    } else {
        next();
    }
};

// to check whether the user is logged in
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to do that!");
        return res.redirect("/login");
    }
    next();
};

// to save the originalUrl(session.redirectUrl) to the res.locals
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

// to make sure that the logged user is same as the owner of listing to be edited/deleted
module.exports.isOwner = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You aren't the owner of this listing!");
        return res.redirect(`/listings/${req.params.id}`);
    }
    next();
};

// to make sure that the logged user is same as the author of review to be deleted
module.exports.isReviewAuthor = async (req, res, next) => {
    const review = await Review.findById(req.params.reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You aren't the author of this review!");
        return res.redirect(`/listings/${req.params.id}`);
    }
    next();
};
