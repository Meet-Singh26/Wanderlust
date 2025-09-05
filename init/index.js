const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

main()
    .then((res) => {
        console.log("Connection to DB Established!");
    })
    .catch((err) => {
        console.log("Some error occured!");
        console.log(err);
    });

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB = async () => {
    await Listing.deleteMany({});
    await Review.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Data was initialized!");
};

initDB();
