const Listing = require("../models/listing.js");
const fs = require("fs");
const uploadToImgBB = require("../imgbbConfig.js");
const axios = require("axios");

module.exports.index = async (req, res) => {
    const {category, search} = req.query; // Get the category & search from the URL query

    // Build the query object
    let query = {};
    if (category) query.category = category;  // Add category filter if provided
    if (search) query.$or = [{ title: new RegExp(search, 'i') }, { country: new RegExp(search, 'i') }, { location: new RegExp(search, 'i') }];

    // Find listings based on the constructed query
    const allListings = await Listing.find(query);

    if (search && !allListings.length) {
        req.flash("error", "No Search Results");
        return res.redirect("/listings");
    }

    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.createListing = async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    if (req.file) {
        try {
            const imgbbUrl = await uploadToImgBB(req.file.path);
            newListing.image = {
                url: imgbbUrl,
                filename: req.file.filename,
            };
        } catch (uploadError) {
            req.flash("error", "Image upload failed: " + uploadError.message);
            return res.redirect("/listings/new");
        } finally {
            // Ensure local file is deleted even if ImgBB upload fails
            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
        }
    }
    await newListing.save();
    req.flash("success", "New Listing Added Successfully!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    if (!listing) {
        req.flash("error", "Listing you requested for doesn't exist!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
    let editListing = await Listing.findByIdAndUpdate(req.params.id, {
        ...req.body.listing,
    });

    if (typeof req.file !== "undefined") {
        try {
            const imgbbUrl = await uploadToImgBB(req.file.path);
            editListing.image = {
                url: imgbbUrl,
                filename: req.file.filename,
            };
            await editListing.save();
        } catch (uploadError) {
            // Flash an error and redirect, or send a specific error message
            req.flash("error", "Image upload failed: " + uploadError.message);
            return res.redirect("/listings/new");
        } finally {
            // Ensure local file is deleted even if ImgBB upload fails
            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
        }
    }
    req.flash("success", "Listing Updated Successfully!");
    res.redirect(`/listings/${req.params.id}`);
};

module.exports.showListing = async (req, res) => {
    const listing = await Listing.findById(req.params.id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for doesn't exist!");
        res.redirect("/listings");
    }

    // --- Geocoding Logic ---
    let coordinates = null;
    if (listing.location && listing.country) {
        const address = `${listing.location}, ${listing.country}`;
        try {
            const response = await axios.get(
                "https://nominatim.openstreetmap.org/search",
                {
                    params: {
                        q: address,
                        format: "json",
                        limit: 1, // Only need the top result
                    },
                    headers: {
                        "User-Agent":
                            "WanderlustApp/1.0 (g.w.yn.ethrepal.es.ya@gmail.com)", // IMPORTANT: Replace with your app name and email
                    },
                }
            );

            // Check if response.data is not empty and contains valid lat/lon
            if (
                response.data &&
                response.data.length > 0 &&
                response.data[0].lat &&
                response.data[0].lon
            ) {
                coordinates = {
                    latitude: parseFloat(response.data[0].lat),
                    longitude: parseFloat(response.data[0].lon),
                };
                console.log(`Geocoded ${address} to:`, coordinates); // Log successful geocoding
            } else {
                console.warn(
                    `Nominatim did not find coordinates for: ${address}`
                );
                console.log("Nominatim response data:", response.data); // Log response data even if empty
            }
        } catch (error) {
            req.flash(
                "error",
                `❌ Error geocoding location for ${address}: ${error.message}`
            );
            // `coordinates` remains null if there's an error or no results
        }
    }
    // --- End Geocoding Logic ---

    // Pass the coordinates along with the listing data to the EJS template
    res.render("listings/show.ejs", { listing, coordinates });
};

module.exports.destroyListing = async (req, res) => {
    const listing = await Listing.findByIdAndDelete(req.params.id);
    if (!listing) {
        req.flash("error", "Listing you requested for doesn't exist!");
        res.redirect("/listings");
    }
    req.flash("success", "Listing Deleted Successfully!");
    res.redirect("/listings");
};
