const jwt = require("jsonwebtoken");
var logger = require('../config/winston');

const TOKEN_SECRET_STRING = 'secret_this_should_be_longer';

module.exports = (req,res,next)=>{

  logger.info( `API /check-auth - ${req.originalUrl} - ${req.ip} `);

  try{
    const token = req.headers.authorization.split(" ")[1];

    jwt.verify(token,TOKEN_SECRET_STRING);
    next();
  }catch(error){
    console.log(error);
    res.status(401).json({message: 'Auth failed!'});
  }
};
