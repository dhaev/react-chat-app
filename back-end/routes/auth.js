const express = require('express');
const passport = require('passport');
const router = express.Router();
const { User } = require("../models/user");
const { check, validationResult } = require('express-validator');
const genPassword = require('../config/passwordUtils').genPassword;

const sendEmail = require("../config/sendMail");
const {generateToken, isValidToken} = require ("../config/tokenHandler");
const flash = require("connect-flash");

router.get('/google',  passport.authenticate('google', { scope: ['profile','email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), function(req, res) {
    res.status(200);
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), function(req, res) {
    res.status(200).json({message: "login successful", user: req.user});
});

router.post('/register', [
  check('uname', 'Display Name is required').trim().not().isEmpty().escape(),
  check('uname', 'Display Name should be at least 5 characters').isLength({ min: 5 }),
  check('email', 'Please include a valid email').trim().isEmail().normalizeEmail(),
  check('pw', 'Please enter a password with 6 or more characters').trim().isLength({ min: 6 }).escape(),
  check('pw', 'Password should not exceed 20 characters').isLength({ max: 20 }),
  check('pw', 'Password should contain at least one number, one uppercase letter, one lowercase letter, and one special character').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/),
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const firstError = errors.array()[0];
        return res.status(400).json({ error: firstError });
    }

    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ error: "User with this email already exists" });
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
        console.log(savedUser);

        // Respond with success message
        res.status(200).json({ message: "Sign up successful" });
        // You can also redirect to another page if needed:
        // res.redirect('http://localhost/3000/login');
    } catch (error) {
        console.error(error);
        // Handle error, maybe redirect to an error page
    }
});

//password reset route
router.get("/forgot-pass",  (req, res)=>{
  res.render("reset")
})

// / middleware fucntion to associate connect-flash on response
// router.use((req,res,next)=>{
// // res.locals.message = req.flash;
// next()
// })
// password reset post route
router.post("/password-reset", async (req,res)=>{

  console.log("req received fond")
    const {email} = req.body;
    try{
let user = await User.findOne({email:email});
console.log(user +" fond")
if(user){
    const resetToken =  await generateToken(user._id);
    const link= `${req.protocol}://${req.get('host')}/auth/password-reset-link?token=${resetToken}&id=${user._id}`;
 
// html for email
const html = `<b> Hi ${user.displayName}, </b>
<p> You requested to reset your password. </p>
<p> Please, click the link below to reset your password. </p>
<a href = "${link}"> Reset Password </a>
`
console.log(link);
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
        console.log(er);
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
    console.log(er)
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
    console.log(er)
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
    console.log("Updated User : ", updatedUser);
    if(updatedUser){
        // req.flash("success", "password is changed successfully.")
res.redirect("/login");
    }
}catch(er){
    console.log(er)
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
