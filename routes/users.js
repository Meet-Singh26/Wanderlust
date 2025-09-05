const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

// Signup
router
    .route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signinUser));

// Login
router
    .route("/login")
    .get(userController.renderLoginForm)
    .post(
        saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true,
        }),
        userController.loginUser
    );

// Logout
router.get("/logout", userController.logoutUser);

module.exports = router;
