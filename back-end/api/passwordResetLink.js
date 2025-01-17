const { User } = require("../models/databaseSchema");
const sendEmail = require("../config/sendMail");
const { generateToken } = require ("../config/tokenHandler");

const passwordResetLink = async (req,res)=>{

    const {email} = req.body;
    try{
let user = await User.findOne({email:email});

if(user){
    const resetToken =  await generateToken(user._id);
    const link= `${req.protocol}://${req.get('host')}/auth/password-reset-link?token=${resetToken}&id=${user._id}`;
 
// html for email
const html = `<b> Hi ${user.displayName}, </b>
<p> You requested to reset your password. </p>
<p> Please, click the link below to reset your password. </p>
<a href = "${link}"> Reset Password </a>
`
const payload = {
    email,
    subject:"Password reset request",
    html
}
sendEmail(payload);
// res.redirect("/login")
// req.flash("success", "Check your email for the password reset link")
    res.redirect("/login")
}else{
    // req.flash("error","We could not find any user, please check your email address again")
res.redirect("/auth/forgot-pass")
}
    }catch(er){
       throw er
        // req.flash("error","Something went wrong, please try again later!")
        res.redirect("/auth/forgot-pass")
    }
}

module.exports = passwordResetLink;