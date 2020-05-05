
"use strict";
const assert = require( "assert" );
const dotenv = require( "dotenv" );

// read in the .env file
dotenv.config();

// capture the environment variables the application needs
const {
  FC_API_URL,
  FC_API_USER,
  FC_API_PASSWORD,
  PORT,
  SQL_USER,
  SQL_PASSWORD,
  SQL_DATABASE,
  SQL_SERVER,
  SQL_ENCRYPT,
  SALT_WORK_FACTOR,
  JWT_SECRET_STRING,
  JWT_EXPIRES,
  JWT_EXTERNAL_EXPIRES,
  UTIL_PRIVATE_CODE,
  MAIL_HOST,
  MAIL_PORT,
  MAIL_USER,
  MAIL_PASSWORD,
} = process.env;

// validate the required configuration information
assert( FC_API_URL, "FC_API_URL configuration is required." );
assert( FC_API_USER, "FC_API_USER configuration is required." );
assert( FC_API_PASSWORD, "FC_API_PASSWORD configuration is required." );
assert( PORT, "PORT configuration is required." );
assert( SQL_USER, "SQL_USER configuration is required." );
assert( SQL_PASSWORD, "SQL_PASSWORD configuration is required." );
assert( SQL_DATABASE, "SQL_DATABASE configuration is required." );
assert( SQL_SERVER, "SQL_SERVER configuration is required." );
assert( SQL_ENCRYPT, "SQL_ENCRYPT configuration is required." );
assert( SALT_WORK_FACTOR, "SALT_WORK_FACTOR configuration is required." );
assert( JWT_SECRET_STRING, "JWT_SECRET_STRING configuration is required." );
assert( JWT_EXPIRES, "JWT_EXPIRES configuration is required." );
assert( JWT_EXTERNAL_EXPIRES, "JWT_EXTERNAL_EXPIRES configuration is required." );
assert( UTIL_PRIVATE_CODE, "UTIL_PRIVATE_CODE configuration is required." );
assert( MAIL_HOST, "MAIL_HOST configuration is required." );
assert( MAIL_PORT, "MAIL_PORT configuration is required." );
assert( MAIL_USER, "MAIL_USER configuration is required." );
assert( MAIL_PASSWORD, "MAIL_PASSWORD configuration is required." );

// export the configuration information
module.exports = {
  SALT_WORK_FACTOR:SALT_WORK_FACTOR,
  JWT_SECRET_STRING:JWT_SECRET_STRING,
  JWT_EXPIRES:JWT_EXPIRES,
  JWT_EXTERNAL_EXPIRES:JWT_EXTERNAL_EXPIRES,
  UTIL_PRIVATE_CODE:UTIL_PRIVATE_CODE,
  FC_API_URI:FC_API_URL,
  FC_API_AUTH:{
    "username":FC_API_USER,
    "password":FC_API_PASSWORD
  },

  AUTH_PATH :"/api/auth",
  API_DOWNLOAD_PATH :"/api/files/",
  INVEST_PROFILE_PATH :"/api/customer/individual/investor/profile",
  INVEST_INDIVIDUAL :"/api/customer/individual",
  DOWNLOAD_PATH :'./backend/downloadFiles/fundConnext/',

  //
  dbParameters:{
    server: SQL_SERVER,
    user: SQL_USER,
    password: SQL_PASSWORD,
    database: SQL_DATABASE,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    },
    options: {
      encrypt: SQL_ENCRYPT
    }
  },

  dbParameters_BULK:{
    server: SQL_SERVER,
    user: SQL_USER,
    password: SQL_PASSWORD,
    database: SQL_DATABASE,
    requestTimeout:50000,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    },
    options: {
      encrypt: SQL_ENCRYPT
    }
  },

  MPAM_MailParameters:{
    host:MAIL_HOST,
    port:MAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth:{
        user:MAIL_USER,
        pass:MAIL_PASSWORD
    }
  },

}
