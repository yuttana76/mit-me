const jwt = require("jsonwebtoken");
var logger = require('../config/winston');
const mpamConfig = require('../config/mpam-config');

const JWT_SECRET_STRING = mpamConfig.JWT_SECRET_STRING;

module.exports = (req,res,next)=>{

  // logger.info( ` ${req.originalUrl} - ${req.ip} `);
  logger.info( ` ${req.originalUrl} - ${req.connection.remoteAddress} `);

  try{

    if(!req.headers.authorization)
      throw new Error('authorization not defined.')

    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token,JWT_SECRET_STRING);

    next();
  }catch(error){
    logger.error( `API /check-auth - ${error} `);
    res.status(401).json({message: 'Auth failed!'});
  }
};
