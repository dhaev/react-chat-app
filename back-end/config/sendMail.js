const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const sendEmail = (payload)=>{
    const { email, subject, html}= payload
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD
        }
    });
    const mailOptions ={
    from:process.env.MAIL_USERNAME,
    to:email,
    subject:subject,
    html:  html
    }
    transporter.sendMail(mailOptions,(error,info)=>{
        if(error){
            console.log(error)
        }else{
    console.log(info);
        }
        
    })
    }
    module.exports = sendEmail;