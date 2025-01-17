const { User } = require("../models/databaseSchema");
const genPassword = require('../config/passwordUtils').genPassword;
const { checkPassword } = require('../middleware/validationcheck')

const {isValidToken} = require ("../config/tokenHandler");
const flash = require("connect-flash");

const createNewPassword = async(req,res)=>{
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
      }

module.exports = createNewPassword