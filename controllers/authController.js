const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { transporter } = require("../utility/nodemailer");
const { JWT_SECRET } = require("../config");

// Generate OTP function
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Register a new user
exports.signup = async (req, res) => {
  const {
    firstname,
    lastname,
    email,
    phone,
    companyType,
    gst,
    PanCard,
    street,
    city,
    state,
    pincode,
    password,
    terms,
  } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      firstname,
      lastname,
      email,
      phone,
      companyType,
      gst,
      PanCard,
      street,
      city,
      state,
      pincode,
      password: hashedPassword,
      terms,
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ error: "Error registering user" });
  }
};

// Generate and send OTP
exports.generateOtp = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 300 * 1000); // 5 minutes

    await User.updateOne({ email }, { otp, otpExpiry });

    console.log(`Generated OTP for ${email}: ${otp}, Expires at: ${otpExpiry}`);

    const mailOptions = {
      from: "ag5603390@gmail.com",
      to: email,
      subject: "Your OTP for Login",
      text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending OTP email:", error);
        return res.status(500).json({ error: "Failed to send OTP email" });
      }
      res.status(200).json({ message: "OTP sent successfully" });
    });
  } catch (error) {
    console.error("OTP Generation Error:", error);
    res.status(500).json({ error: "Error generating OTP" });
  }
};

// Verify OTP and login
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpiry < new Date()) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    await User.updateOne({ email }, { otp: null, otpExpiry: null });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({ message: "Login successful", token, user: { id: user._id, email: user.email } });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    res.status(500).json({ error: "Error verifying OTP" });
  }
};
