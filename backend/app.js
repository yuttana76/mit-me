const express = require('express');
const bodyParser = require('body-parser');

const connexRoutes = require('./routes/connex');
const fundConnexRoutes = require('./routes/fundConnex');
const userRoutes = require('./routes/user');
const amcRoutes = require('./routes/amc');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader(
      "Access-Control-Allow-Origin",
      "*");
  res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-Width, Content-Type, Accept, Authorization");
  res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, PUT,  DELETE, OPTIONS"
  );
  next();
});

app.use("/api/connex",connexRoutes);
app.use("/api/connexFund",fundConnexRoutes);
app.use("/api/user",userRoutes);
app.use("/api/amc",amcRoutes);

module.exports = app;
