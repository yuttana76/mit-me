// var HOST_SERVER = '192.168.10.25'; // PROD
var HOST_SERVER = '192.168.10.48';  // DEV

exports.dbParameters = {
  server: HOST_SERVER,//PROD
  // server: '192.168.10.48',//DEV
  user: 'mftsuser',//process.env.AUTH_SRV_USER,
  password: 'P@ssw0rd',//process.env.AUTH_SRV_PWD,
  database: 'MFTS',//process.env.AUTH_SRV_db,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: false // Use this if you're on Windows Azure
  }

}
exports.dbParameters_BULK = {
  // server: '192.168.10.48',//process.env.AUTH_SRV_IP,
  server: HOST_SERVER,//process.env.AUTH_SRV_IP,
  user: 'mftsuser',//process.env.AUTH_SRV_USER,
  password: 'P@ssw0rd',//process.env.AUTH_SRV_PWD,
  database: 'MFTS',//process.env.AUTH_SRV_db,
  requestTimeout:50000,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: false // Use this if you're on Windows Azure
  }

}

exports.dbParameters_stream = {
  // server: '192.168.10.48',//process.env.AUTH_SRV_IP,
  server: HOST_SERVER,//process.env.AUTH_SRV_IP,
  user: 'mftsuser',//process.env.AUTH_SRV_USER,
  password: 'P@ssw0rd',//process.env.AUTH_SRV_PWD,
  database: 'MFTS',//process.env.AUTH_SRV_db,
  stream :true,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: false // Use this if you're on Windows Azure
  }
}

// exports.mssql_db_user = process.env.AUTH_SRV_USER;
// exports.mssql_db_password = process.env.AUTH_SRV_PWD;
// exports.mssql_db_server = process.env.AUTH_SRV_IP;
// exports.mssql_db_database= process.env.AUTH_SRV_db;

exports.SALT_WORK_FACTOR = 10;
exports.JWT_SECRET_STRING = 'secret_this_should_be_longer'//process.env.JWT_KEY;
exports.JWT_EXPIRES = '1h';

// On production  '14 days';
exports.JWT_EXTERNAL_EXPIRES = '90 days';

exports.mailParameters = {
  host: 'smtp.inetmail.cloud',//process.env.MAIL_SMTP,
  port: '587',//process.env.MAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
      user: 'italert@merchantasset.co.th',//process.env.MAIL_USER, // generated ethereal user
      pass: 'Merchant@2018**'//process.env.MAIL_PASS // generated ethereal password
  }
}

exports.mail_form ='it2@merchantasset.co.th';

exports.UTIL_PRIVATE_CODE ='winteriscomming!';


exports.msByQuery = (queryStr,_config)=>{

  console.log('*** msByQuery()');

  const sql = require("mssql");
  return new Promise(function(resolve, reject) {
    const pool1 = new sql.ConnectionPool(_config, err => {
      pool1
      .request() // or: new sql.Request(pool1)
      .query(queryStr, (err, result) => {
          if (err) {
            console.log(fncName + " Quey db. Was err !!!" + err);
            reject(err);
          } else {
            resolve(result);
          }
        });
    });
    pool1.on("error", err => {
      console.log("ERROR>>" + err);
      reject(err);
    });
  });

}
