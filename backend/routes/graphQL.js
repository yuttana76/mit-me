const express = require('express');
var express_graphql = require('express-graphql');
var { buildSchema } = require('graphql');

const dbConfig = require("../config/db-config");
var config = dbConfig.dbParameters;

//************** */ Functions
function queryDB(queryStr){

  const sql = require("mssql");

  return new Promise(function(resolve, reject) {
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1.request()
        .query(queryStr, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result.recordset);
          }
        });
    });
    pool1.on("error", err => {
      console.log("EROR>>" + err);
      reject(err);
    });
  });
}

var getAccount = function(arg) {
  return queryDB(`SELECT * FROM Account_Info WHERE Cust_Code='${arg.Cust_Code}' `).then(row=>{
    return {
      Cust_Code: row[0].Cust_Code,
      First_Name_T: row[0].First_Name_T,
      Last_Name_T: row[0].Last_Name_T
    }
  })
};

//************** */ Functions

// GraphQL schema
var schema = buildSchema(`
    type Query {
      account(Cust_Code: String!): Account
      message: String
    },

    type Account {
      Cust_Code: String
      First_Name_T: String
      Last_Name_T: String
    },

`);

// Root resolver
const root = {
  message: ()=> 'Welcome OpenQL',
  account: getAccount,

};

// Create an express server and a GraphQL endpoint
var app = express();
app.use( express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));


module.exports = app;


