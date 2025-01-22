const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const sendEmail = (payload) => {
    const { email, subject, html } = payload
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD
        }
    });
    const mailOptions = {
        from: process.env.MAIL_USERNAME,
        to: email,
        subject: subject,
        html: html
    }
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {

        } else {

        }

    })
}

module.exports = sendEmail;