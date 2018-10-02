const express = require('express');
const bodyParser = require('body-parser');

const connexRoutes = require('./routes/connex');
const fundRoutes = require('./routes/fund');
const userRoutes = require('./routes/user');
const amcRoutes = require('./routes/amc');
const transRoutes = require('./routes/transaction');
const customerRoutes = require('./routes/customer');

const clientTypeRoutes = require('./routes/clientType');
const PIDTypesRoutes = require('./routes/PIDTypes');
const thaiTitleRoutes = require('./routes/thaiTitle');
const engTitleRoutes = require('./routes/engTitle');
const nationRoutes = require('./routes/nation');
const countryRoutes = require('./routes/country');
const provinceRoutes = require('./routes/province');
const amphurRoutes = require('./routes/amphur');
const tambonRoutes = require('./routes/tambon');
const saleAgentRoutes = require('./routes/saleAgent');
const wipCustomerRoutes = require('./routes/wipCustomer');

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
app.use("/api/fund",fundRoutes);
app.use("/api/user",userRoutes);
app.use("/api/amc",amcRoutes);
app.use("/api/trans",transRoutes);
app.use("/api/customer",customerRoutes);

// ***** Master data
app.use("/api/clientType",clientTypeRoutes);
app.use("/api/PIDType",PIDTypesRoutes);
app.use("/api/thaiTitle",thaiTitleRoutes);
app.use("/api/engTitle",engTitleRoutes);
app.use("/api/country",countryRoutes);
app.use("/api/province",provinceRoutes);
app.use("/api/amphur",amphurRoutes);
app.use("/api/tambon",tambonRoutes);
app.use("/api/nation",nationRoutes);

app.use("/api/saleAgent",saleAgentRoutes);
app.use("/api/wipcustomer",wipCustomerRoutes);

module.exports = app;
