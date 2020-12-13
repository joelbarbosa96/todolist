const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create User Schema
const UserSchema = new Schema({
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true, minlength: 5 },
  displayName: { type: String },
});

module.exports = User = mongoose.model("User", UserSchema);
