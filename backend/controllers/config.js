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
