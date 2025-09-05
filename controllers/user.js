const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
    res.render("user/signup.ejs");
};

module.exports.signinUser = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust");
            res.redirect("/listings");
        });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("user/login.ejs");
};

module.exports.loginUser = async (req, res) => {
    req.flash("success", "Welcome to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    // Strip off method-override query and review ID if present
    if (redirectUrl.includes("?")) {
        redirectUrl = redirectUrl.split("?")[0];
    }
    if (redirectUrl.includes("/reviews")) {
        redirectUrl = redirectUrl.split("/reviews")[0];
    }
    req.session.redirectUrl = null;
    res.redirect(redirectUrl);
};

module.exports.logoutUser = async (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
};
