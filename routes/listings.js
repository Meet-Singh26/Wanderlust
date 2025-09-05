const express = require("express");
const router = express.Router({ mergeParams: true });
exports.router = router;
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 2, // 2MB limit
  },
});

router
  .route("/")
  // index route
  .get(wrapAsync(listingController.index))
  // create route(POST)
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  );

// new route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  // update route(PUT)
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  // show route(GET)
  .get(wrapAsync(listingController.showListing))
  // delete route(DELETE)
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
