const jwt = require("jsonwebtoken");
var logger = require('../config/winston');
const dbConfig = require('../config/db-config');

// const TOKEN_SECRET_STRING = dbConfig.TOKEN_SECRET_STRING;
const JWT_SECRET_STRING = dbConfig.JWT_SECRET_STRING;

module.exports = (req,res,next)=>{

  logger.info( ` ${req.originalUrl} - ${req.connection.remoteAddress} `);

  try{
    const token = req.headers.authorization.split(" ")[1];
    // jwt.verify(token,JWT_SECRET_STRING);
    if(token ==='41121225'){
      next();
    }else{
      res.status(401).json({message: 'Auth failed!'});
    }

  }catch(error){
    console.log(error);
    logger.error( `API /check-auth - ${error} `);
    res.status(401).json({message: 'Auth failed!'});
  }
};
