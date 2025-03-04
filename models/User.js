const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String, required: true },
    companyType: { type: String, required: true },
    gst: { type: String },
    PanCard: { type: String },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    password: { type: String, required: true },
    terms: { type: Boolean, required: true },
    otp: String,
    otpExpiry: Date,
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }] // Reference projects by ID
});

module.exports = mongoose.model("User", userSchema);
