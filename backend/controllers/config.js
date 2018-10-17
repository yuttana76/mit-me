exports.dbParameters = {
  user: process.env.AUTH_SRV_USER,
  password: process.env.AUTH_SRV_PWD,
  server: process.env.AUTH_SRV_IP,
  database: process.env.AUTH_SRV_db,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: false // Use this if you're on Windows Azure
  }
}

exports.mssql_db_user = process.env.AUTH_SRV_USER;
exports.mssql_db_password = process.env.AUTH_SRV_PWD;
exports.mssql_db_server = process.env.AUTH_SRV_IP;
exports.mssql_db_database= process.env.AUTH_SRV_db;

exports.SALT_WORK_FACTOR = 10;
exports.TOKEN_EXPIRES = '1h';

exports.mailParameters = {
  host: process.env.MAIL_SMTP,
  port: process.env.MAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
      user: process.env.MAIL_USER, // generated ethereal user
      pass: process.env.MAIL_PASS // generated ethereal password
  }
}

exports.mail_form ='it2@merchantasset.co.th';


// "MAIL_SMTP":"smtp.gmail.com",
// "MAIL_PORT":"587",
// "MAIL_USER":"yuttana76@gmail.com",
// "MAIL_PASS":"41121225"



// {
//   "env": {
//   "NODE_ENV":"production",
//   "JWT_KEY":"secret_this_should_be_longer",
//   "AUTH_SRV_USER": "mftsuser",
//   "AUTH_SRV_PWD": "P@ssw0rd",
//   "AUTH_SRV_IP": "192.168.10.48",
//   "AUTH_SRV_db": "MFTS",
//   "MAIL_SMTP":"smtp.gmail.com",
//   "MAIL_PORT":"587",
//   "MAIL_USER":"yuttana76@gmail.com",
//   "MAIL_PASS":"41121225"
//   }
// }
