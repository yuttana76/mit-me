const express = require('express');
var express_graphql = require('express-graphql');
var { buildSchema } = require('graphql');

const graphQLController = require('../controllers/graphQL')

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
  account: graphQLController.getAccount,

};

// Create an express server and a GraphQL endpoint
var app = express();
app.use( express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));


module.exports = app;


