const express = require('express');
const passport = require('passport');
const router = express.Router();
const { User } = require("../models/databaseSchema");
const {validationResult } = require('express-validator');
const genPassword = require('../config/passwordUtils').genPassword;
const { checkUsername, checkEmail, checkPassword } = require('../middleware/validationcheck')

const sendEmail = require("../config/sendMail");
const {generateToken, isValidToken} = require ("../config/tokenHandler");
const flash = require("connect-flash");

router.get('/google',  passport.authenticate('google', { scope: ['profile','email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), function(req, res) {
    res.status(200).json({message: "login successful", user: req.user});
});

router.post('/login', [checkEmail(), checkPassword('pw')], passport.authenticate('local', { failureRedirect: '/login' }), function(req, res) {
    res.status(200).json({message: "login successful", user: req.user});
});

router.post('/register',  [checkUsername(), checkEmail(), checkPassword('pw')], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const firstError = errors.array()[0];
        return res.status(400).json({ error: firstError });
    }

    try {
        const emailExists = await User.findOne({ email: req.body.email });
        if (emailExists) {
            return res.status(400).json({ error: "User with this email already exists" });
        }
        const displayNameExists = await User.findOne({ displayName: req.body.uname });
        if (displayNameExists) {
            return res.status(400).json({ error: "User with this name already exists" });
        }

        const saltHash = genPassword(req.body.pw);
        const salt = saltHash.salt;
        const hash = saltHash.hash;

        const newUser = new User({
            displayName: req.body.uname,
            email: req.body.email,
            hash: hash,
            salt: salt,
        });

        // Save the new user
        const savedUser = await newUser.save();

        // Respond with success message
        res.status(200).json({ message: "Sign up successful" });
 
    } catch (error) {
        res.status(500).json({ message: "internal server error" });
        // Handle error, maybe redirect to an error page
    }
});

//password reset route
router.get("/forgot-pass",  (req, res)=>{
  res.render("reset")
})

// password reset post route
router.post("/password-reset", async (req,res)=>{

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
})

router.get("/password-reset-link",  async (req,res)=>{
  if(req.query && req.query.token && req.query.id){
    //check token and id are valid
const{token,id} = req.query;
try{
   const isValid = await isValidToken({token,id});
    if(isValid){
res.render("newPasswordForm",{
    token,
    id,
})
    }else{
res.json({message:"Invalid token or link is expired"})
    }
}catch(er){

res.json({message:"something went wrong, please try again latter"})
}
}else{
    res.redirect("/login")
}
})



router.post("/newPassword",  async(req,res)=>{
    
  if(req.query.token && req.query.id){
const {token, id}= req.query;
let isValid;
try{    isValid = await isValidToken({token,id});
}catch(er){

}
if(isValid){
const {password, repeatPassword}=req.body;
if(password.length<6){
    
   return  res.render("newPasswordForm",{
    token,
    id,
    errorMessage:"Password need to have minimum 6 characters"
   })
}
if (password!== repeatPassword){
   return  res.render("newPasswordForm",{
    token,
    id,
    errorMessage:" Password is not match."
   })
}
if(password == repeatPassword && password.length>6){
try{
  const saltHash = genPassword(password);
  const newSalt = saltHash.salt;
  const newHash = saltHash.hash;
  
    const updatedUser = await User.findByIdAndUpdate(id, { salt: newSalt, hash: newHash }, { new: true });

    if(updatedUser){
        // req.flash("success", "password is changed successfully.")
res.redirect("/login");
    }
}catch(er){

}
}
} else{
    res.json({message:"Invalid token or link is expired"})  
}
} else{
    res.json({message:"Something went wrong! try again later"})  
}
    })


module.exports = router;
