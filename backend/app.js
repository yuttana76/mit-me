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

const masterdataRoutes = require('./routes/masterdata');
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
const cddRoutes = require('./routes/cdd');

const navRoutes = require('./routes/nav');
const reportRoutes = require('./routes/report');
const downloadRoutes = require('./routes/download');
const fatcaRoutes = require('./routes/fatca');
const custChildrenRoutes = require('./routes/child');
const ledRoutes = require('./routes/led');
const ledApiRoutes = require('./routes/led_api');
const swanRoutes = require('./routes/swan');
const ndidProxyRoutes = require('./routes/ndidProxy');
const onlineProcessRoutes = require('./routes/onlineProcess');
const openAccountRoutes = require('./routes/openAccount');

const exportFileRoutes = require('./routes/exportFile');
const fundConnextAPIRoutes = require('./routes/fundConnextAPI');
const streamingRoutes = require('./routes/streaming');
const streaming2faRoutes = require('./routes/streaming2fa');
const sttEopenRoutes = require('./routes/sttEopen');

const smsRoutes = require('./routes/sms');
const surveyRoutes = require('./routes/survey');
const graphQLRoutes = require('./routes/graphQL');
const slackRoutes = require('./routes/slack');
const miWealthRoutes = require('./routes/miWealth');

var logger = require("./config/winston");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", express.static(path.join(__dirname, "angular")));
app.use("/images",express.static(path.join("backend/images")));
app.use("/downloadFiles/files",express.static(path.join("backend/downloadFiles/files")));

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


//STAGE
// const HOST_FC= FC_API_Config.fundConnextApi_STAGE.host
// const USER_API=FC_API_Config.fundConnextApi_STAGE.auth

app.use(("/api/test"),(req, res, next)=>{

  var ip = req.headers['x-forwarded-for'] ||
     req.connection.remoteAddress ||
     req.socket.remoteAddress ||
     (req.connection.socket ? req.connection.socket.remoteAddress : null);

  logger.info("/api/test > " +  ip)


  var accountId=",M2102117,M2102118";
  var accountArray=   accountId.split(',')

   for(var i = 0; i < accountArray.length;i++){

     if(accountArray[i]){
      console.log('Acc>>' + accountArray[i])
     }

   }

  res.status(200).json({
    message: "MIT API test successful!",

  });

})


app.use("/api/connex",connexRoutes);
app.use("/api/fund",fundRoutes);

app.use("/api/user",userRoutes);

app.use("/api/amc",amcRoutes);
app.use("/api/trans",transRoutes);
app.use("/api/customer",customerRoutes);
app.use("/api/dep",departmentRoutes);
app.use("/api/emp",employeeRoutes);

// ***** Master data
app.use("/api/master",masterdataRoutes);
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

app.use("/api/cdd",cddRoutes);

app.use("/api/child",custChildrenRoutes);

app.use("/api/led",ledRoutes);
app.use("/api/ledApi",ledApiRoutes);

app.use("/api/swan",swanRoutes);

//NDID Proxy
app.use("/api/proxy",ndidProxyRoutes);

//Export files
app.use("/api/export",exportFileRoutes);

// FundConnect API
app.use("/api/fundConnext",fundConnextAPIRoutes);

// Streaming
app.use("/api/stream",streamingRoutes);

app.use("/api/stream2fa",streaming2faRoutes);

app.use("/api/stteopen",sttEopenRoutes);

//SMS API
app.use("/api/sms",smsRoutes);

app.use("/api/online",onlineProcessRoutes);

app.use("/api/account",openAccountRoutes);

app.use("/api/survey",surveyRoutes);

app.use("/api/graphQL",graphQLRoutes);
app.use("/api/slack",slackRoutes);

app.use("/api/mi",miWealthRoutes);


app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "angular", "index.html"));
});
module.exports = app;
