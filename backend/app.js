const express = require('express');
const bodyParser = require('body-parser');
const path = require("path");

const connexRoutes = require('./routes/connex');
const fundRoutes = require('./routes/fund');
const userRoutes = require('./routes/user');

const utilityRoutes = require('./routes/utility');
const riskSuitRoutes = require('./routes/riskSuit');

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
const custAddressRoutes = require('./routes/custAddress');
const workFlowRoutes = require('./routes/workFlow');
const mailRoutes = require('./routes/mail');
const departmentRoutes = require('./routes/department');
const employeeRoutes = require('./routes/employee');
const applicationRoutes = require('./routes/application');
const groupRoutes = require('./routes/group');
const authorityRoutes = require('./routes/authority');
const anoucementRoutes = require('./routes/anoucement');
const suitRoutes = require('./routes/suit');
const otpTokenRoutes = require('./routes/otpToken');

const navRoutes = require('./routes/nav');
const reportRoutes = require('./routes/report');
const downloadRoutes = require('./routes/download');
const fatcaRoutes = require('./routes/fatca');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", express.static(path.join(__dirname, "angular")));
app.use("/images",express.static(path.join("backend/images")));


/*
Config for separate Banckend and Frontend servers
*/
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
app.use("/api/dep",departmentRoutes);
app.use("/api/emp",employeeRoutes);

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
app.use("/api/custAddress",custAddressRoutes);
app.use("/api/workFlow",workFlowRoutes);
app.use("/api/mail",mailRoutes);
app.use("/api/application",applicationRoutes);
app.use("/api/group",groupRoutes);
app.use("/api/authority",authorityRoutes);
app.use("/api/anoucement",anoucementRoutes);

app.use("/api/nav",navRoutes);

//External apps
app.use("/api/fatca",fatcaRoutes);

// Utility
app.use("/api/util",utilityRoutes);
app.use("/api/risk",riskSuitRoutes);

app.use("/api/download",downloadRoutes);

// Reports
app.use("/api/rep",reportRoutes);

// Suitability
app.use("/api/suit",suitRoutes);

// OTP
app.use("/api/otp",otpTokenRoutes);

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "angular", "index.html"));
});
module.exports = app;
