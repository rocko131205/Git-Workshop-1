// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// const multer = require('multer');

// const app = express();
// const PORT = 8000;
// const JWT_SECRET = 'your_jwt_secret';
// const MONGO_URI = 'mongodb://localhost:27017/crm_project';

// const {transporter} = require('./utility/nodemailer');
// // Middleware
// app.use(cors());
// app.use(bodyParser.json());

// // MongoDB Connection
// mongoose.connect(MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
// .then(() => console.log(' MongoDB connected'))
// .catch((err) => {
//     console.error('MongoDB connection error:', err);
//     process.exit(1); // Exit if DB connection fails
// });



// // Project schema


// const projectSchema = new mongoose.Schema({
//   typeOfProject: { 
//     type: String, 
//     enum: ['Residential', 'Commercial', 'Plots', 'Villa', 'Residential / Commercial', 'IT/ITES', 'Warehouse'],
//     required: true
//   },
//   areaOfLand: { type: String, default: '' },
//   geoTag: { type: String, default: '' },
//   typeOfUnits: { 
//     type: String, 
//     enum: ['Studio', '1BHK', '1.5 BHK', '2BHK', '2.5 BHK', '3BHK', '4 BHK', 'Row House', 'Villa'],
//     required: true
//   },
//   address: { type: String, required: true },
//   numberOfBuildings: { type: Number, default: 0 },
//   numberOfPhases: { type: Number, default: 0 },
//   amenities: { type: [String], default: [] },
//   typeOfBuilding: { type: String, default: '' },
//   flatsPerFloor: { type: Number, default: 0 },
//   paymentSchedule: { type: String, default: '' },
//   demandLetter: { type: String, default: '' },
//   currentASRRate: { type: Number, default: 0 },
//   RERANumber: { type: String, default: '' },
//   bankDetails: {
//     approval: { type: String, default: '' },
//     IOD: { type: String, default: '' },
//     CC: { type: String, default: '' },
//     NA: { type: String, default: '' },
//     purchaseDeed: { type: String, default: '' },
//     titleDocument: { type: String, default: '' },
//     reraCertificate: { type: String, default: '' },
//     approvedPlan: { type: String, default: '' },
//     NOCFire: { type: String, default: '' },
//     tree: { type: String, default: '' },
//     PWD: { type: String, default: '' },
//     environment: { type: String, default: '' },
//     airportAuthority: { type: String, default: '' },
//     traffic: { type: String, default: '' },
//     projectBrochure: { type: String, default: '' }
//   },
//   otherCharges: {
//     parking: { type: Number, default: 0 },
//     societyFormation: { type: Number, default: 0 },
//     developmentCharge: { type: Number, default: 0 },
//     legalCharge: { type: Number, default: 0 },
//     maintenancePerSqFt: { type: Number, default: 0 },
//     infrastructureCharge: { type: Number, default: 0 }
//   }
// });

// // Creating a separate collection for projects
// const Project = mongoose.model("Project", projectSchema);

// // Updating User Schema to reference projects
// const userSchema = new mongoose.Schema({
//     firstname: { type: String, required: true },
//     lastname: { type: String, required: true },
//     email: { type: String, unique: true, required: true },
//     phone: { type: String, required: true },
//     companyType: { type: String, required: true },
//     gst: { type: String },
//     PanCard: { type: String },
//     street: { type: String, required: true },
//     city: { type: String, required: true },
//     state: { type: String, required: true },
//     pincode: { type: String, required: true },
//     password: { type: String, required: true },
//     terms: { type: Boolean, required: true },
//     otp: String,
//     otpExpiry: Date,
//     projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }], // Reference projects by ID
// });

// const User = mongoose.model("User", userSchema);

// module.exports = { User, Project };


// // Register Route
// // Strong Password Validation Function
// // function isPasswordStrong(password) {
// //     const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
// //     return strongPasswordRegex.test(password);
// // }

// // Register Route
// app.post('/api/signup', async (req, res) => {
//     const {
//         firstname,
//         lastname,
//         email,
//         phone,
//         companyType,
//         gst,
//         PanCard,
//         street,
//         city,
//         state,
//         pincode,
//         password,
//         terms,
//     } = req.body;

//     // Check Password Strength
//     // if (!isPasswordStrong(password)) {
//     //     return res.status(400).json({ error: 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.' });
//     // }

//     try {
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ error: 'Email already exists' });
//         }

//         const hashedPassword = await bcrypt.hash(password, 12); // Increase salt rounds for better security

//         const user = new User({
//             firstname,
//             lastname,
//             email,
//             phone,
//             companyType,
//             gst,
//             PanCard,
//             street,
//             city,
//             state,
//             pincode,
//             password: hashedPassword,
//             terms,
//         });

//         await user.save();
//         res.status(201).json({ message: 'User registered successfully' });
//     } catch (error) {
//         console.error('Signup Error:', error);
//         res.status(500).json({ error: 'Error registering user' });
//     }
// });


// // Generate OTP
// const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// app.post('/api/generate-otp', async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         const user = await User.findOne({ email });

//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (!isPasswordValid) {
//             return res.status(401).json({ message: "Invalid password" });
//         }

//         const otp = generateOtp();
//         const otpExpiry = new Date(Date.now() + 300 * 1000);

//         await User.updateOne({ email }, { otp, otpExpiry });

//         console.log(`Generated OTP for ${email}: ${otp}, Expires at: ${otpExpiry}`);

//         const mailOptions = {
//             from: 'ag5603390@gmail.com',
//             to: email,
//             subject: 'Your OTP for Login',
//             text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
//         };

//     transporter.sendMail(mailOptions, (error, info) => {
//             if (error) {
//                 console.error('Error sending OTP email:', error);
//                 return res.status(500).json({ error: 'Failed to send OTP email' });
//             }
//             res.status(200).json({ message: 'OTP sent successfully' });
//         });

//     } catch (error) {
//         console.error('OTP Generation Error:', error);
//         res.status(500).json({ error: 'Error generating OTP' });
//     }
// });

// // Verify OTP and Login Route
// app.post('/api/verify-otp', async (req, res) => {
//     const { email, otp } = req.body;

//     try {
//         const user = await User.findOne({ email });
//         if (!user || user.otp !== otp || user.otpExpiry < new Date()) {
//             return res.status(400).json({ error: 'Invalid or expired OTP' });
//         }

//         await User.updateOne({ email }, { otp: null, otpExpiry: null });

//         const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

//         res.status(200).json({ message: 'Login successful', token });
//     } catch (error) {
//         console.error('OTP Verification Error:', error);
//         res.status(500).json({ error: 'Error verifying OTP' });
//     }
// });

// // Login with Password Route
// app.post('/api/verify-otp', async (req, res) => {
//     const { email, otp } = req.body;

//     try {
//         const user = await User.findOne({ email });

//         if (!user) {
//             return res.status(404).json({ error: "User not found" });
//         }

//         console.log(`Stored OTP: ${user.otp}, Entered OTP: ${otp}, Expiry: ${user.otpExpiry}`);

//         if (!user.otp || user.otp !== otp || user.otpExpiry < new Date()) {
//             return res.status(400).json({ error: "Invalid or expired OTP" });
//         }

//         // Clear OTP after successful login
//         await User.updateOne({ email }, { otp: null, otpExpiry: null });

//         const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

//         res.status(200).json({ message: "Login successful", token });
//     } catch (error) {
//         console.error('OTP Verification Error:', error);
//         res.status(500).json({ error: 'Error verifying OTP' });
//     }
// });

// // Start the server
// app.listen(PORT, () => {
//     console.log(`🚀 Server running on http://localhost:${PORT}`);
// });
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/crm_project';

// Import routes
const authRoutes = require('./routes/auth.js');
const projectRoutes = require('./routes/projects.js');

// Middleware
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files

// MongoDB Connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('CRM Project Backend is running...');
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
