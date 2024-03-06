const {isValidToken} = require ("../config/tokenHandler");
const flash = require("connect-flash");


const verifyPasswordResetLink = async (req, res)=>{
    if(req.query && req.query.token && req.query.id){
      //check token and id are valid
  const{token,id} = req.query;
  try{
     const isValid = await isValidToken({token,id});
      if(isValid){
        res.staus(200).json({message:"valid token/link "})
      }else{
  res.staus(400).json({message:"Invalid token or link is expired"})
      }
  }catch(er){
  
  res.json({message:"something went wrong, please try again latter"})
  }
  }else{
    res.staus(400).json({message:"Invalid token or link"})
  }
  }


module.exports = verifyPasswordResetLink;

