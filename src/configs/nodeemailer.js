const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587, // Your SMTP server port
    secure: false, // Set to true if using SSL/TLS
    auth: {
        user: process.env.ADDRESS_EMAIL,
        pass: process.env.PASSWORD_EMAIL,
    },
});

module.exports = transporter