const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String
});
mongoose.model("User", userSchema);

module.exports = mongoose.model("User");