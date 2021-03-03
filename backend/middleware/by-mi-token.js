const jwt = require("jsonwebtoken");
var logger = require('../config/winston');
const dbConfig = require('../config/db-config');

// const TOKEN_SECRET_STRING = dbConfig.TOKEN_SECRET_STRING;
const JWT_SECRET_STRING = dbConfig.JWT_SECRET_STRING;

var mitLog = require('../controllers/mitLog');

module.exports = (req,res,next)=>{

  logger.info( ` Self-Auth ${req.originalUrl} - ${req.connection.remoteAddress} `);
  logger.info( ` baseUrl= ${req.baseUrl}  `);
  logger.info( ` query= ${JSON.stringify(req.query)}  `);

  try{

    if(!req.headers.authorization)
    throw new Error('authorization not defined.')

    const token = req.headers.authorization.split(" ")[1];
    // jwt.verify(token,JWT_SECRET_STRING);
    if(token ==='026606671'){

      // log
      mitLog.saveMITlog('SYSTEM','MI_API', `token=${token} ;url= ${req.originalUrl} ;ip=${req.connection.remoteAddress} ` ,'','',function(){});

      next();
    }else{
      res.status(401).json({message: 'Auth failed!'});
    }

  }catch(error){
    logger.error( `API /check-auth - ${error} `);
    res.status(401).json({message: 'Auth failed!'});
  }
};
