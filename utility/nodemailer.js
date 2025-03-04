const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'ag5603390@gmail.com',
//         pass: 'your_app_password' // env
//     }
// });

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'ag5603390@gmail.com', // Your Gmail
      pass: 'zejd ipff hipc wvqc'     // Your App Password
  }
});

module.exports = { transporter };