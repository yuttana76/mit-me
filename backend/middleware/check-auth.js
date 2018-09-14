const jwt = require("jsonwebtoken");

const TOKEN_SECRET_STRING = 'secret_this_should_be_longer';

module.exports = (req,res,next)=>{
  try{
    const token = req.headers.authorization.split(" ")[1];

    jwt.verify(token,TOKEN_SECRET_STRING);
    next();
  }catch(error){
    console.log(error);
    res.status(401).json({message: 'Auth failed!'});
  }
};
