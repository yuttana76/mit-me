var Report = require('fluentReports' ).Report;
var request = require("request");
var Report = require('fluentReports' ).Report;
var logger = require('../../config/winston');

var rptPATH = './backend/downloadFiles/reports/';

// ***************************************************
function getDATA(req) {
  var options = {
      url: process.env.apiURL +'/trans/report/transaction',
      headers: {
          'User-Agent': 'request'
      },
      qs:{
        startDate:req.query.startDate,
        endDate:req.query.endDate,
        amcCode:req.query.amcCode,
        fundCode:req.query.fundCode
      }
  };
  // Return new promise
  return new Promise(function(resolve, reject) {

    request.get(options, function(err, resp, body) {
      if (resp.statusCode == '200'){
        resolve(JSON.parse(body));
      }else{
        reject(resp);
      }


      })
  })
}

exports.repSummary = (req, res, next) => {
  var fncName = 'repSummary';
  console.log('Welcome ' + fncName);

  logger.info('API repSummary ');

  // Optional -- If you don't pass a report name, it will default to "report.pdf"
  var prefix ='001';
  var rptName =  rptPATH+`${prefix}_summaryReport.pdf`

  logger.info('API repSummary #2');
  'use strict';

  var getData = getDATA(req);
  // console.log('***STEP 3');

  getData.then(function(result) { // PROMISE

    console.log("Initialized user details");

    var mydata2 =[{
      StartDate: "2018-01-01",
      EndDate: "2018-12-25",
      Amc_Code: "KASSET",
      Agent_Code: "",
      Agent_Name: "Merchant",
      Attend_Name: "วิศรุต/อานุภาพ",
      Attend_Tel: "02-6733899",
      Attend_Fax: "026733989",
      Fund_Code: "KEQLTF",
      Eng_Name: "K Equity LTF",
      Contact_Name: "ภิกษา",
      Contact_Tel: "02-6606679",
      Contact_Fax: "026606678",
      Ref_No: "M00000000554",
      Holder_Id: "0895214876",
      fullName: "XXX",
      User_Name: "Tananya Pongpattana",
      License_Code: "039583",
      TranType_Code: "S",
      Tran_Date: "2018-01-12T00:00:00.000Z",
      Amount_Baht: 181581.58,
      Amount_Unit: 4864.6176,
      Nav_Price: 37.327,
      Status_Id: 7
      },
      {
        StartDate: "2018-01-01",
        EndDate: "2018-12-25",
        Amc_Code: "KASSET",
        Agent_Code: "",
        Agent_Name: "Merchant",
        Attend_Name: "วิศรุต/อานุภาพ",
        Attend_Tel: "02-6733899",
        Attend_Fax: "026733989",
        Fund_Code: "KEQLTF",
        Eng_Name: "K Equity LTF",
        Contact_Name: "ภิกษา",
        Contact_Tel: "02-6606679",
        Contact_Fax: "026606678",
        Ref_No: "M00000000554",
        Holder_Id: "0895214876",
        fullName: "YYY",
        User_Name: "Tananya Pongpattana",
        License_Code: "039583",
        TranType_Code: "S",
        Tran_Date: "2018-01-12T00:00:00.000Z",
        Amount_Baht: 181581.58,
        Amount_Unit: 4864.6176,
        Nav_Price: 37.327,
        Status_Id: 7
        }
    ];

    var mydata = result.result;

    // console.log("DATA>>" + JSON.stringify(mydata));

    var header = function(rpt, data) {

      // if(!data.id) {return;}

      // Company Info - Top Left
      //rpt.setCurrentY(14);

      // Date Printed - Top Right
      // rpt.fontSize(9);
      // rpt.print('print date'+ new Date().toString('MM/dd/yyyy'), {y: 10, fontSize: 6, align: 'right'});
      rpt.printedAt({fontSize: 5, align: 'right'});
      rpt.newline();

      // Report Title
      rpt.print('Summary of Subscription, Redemption and Switching Form', {fontBold: true, fontSize: 14, align: 'center'});

      rpt.print(' To AMC ' + data.Amc_Code, {fontSize: 8, align: 'center'} );
      rpt.print([' Trade date ' + data.StartDate , ' to ' + data.EndDate ].join(' '), {fontSize: 8,align: 'center'} );
      rpt.newLine();

      rpt.band([
        {data: 'Agent ', width: 30},
        {data: data.Agent_Code, width: 30 ,underline:true},
        {data: ' ', width: 5},
        {data: data.Agent_Name, width: 60 ,underline:true},
        {data: 'Attn. to:', width: 30},
        {data: data.Attend_Name, width: 100 ,underline:true, font: 'thaiFron',x: 100, addY: 2},
        {data: 'Tel:', width: 20},
        {data: data.Attend_Tel, width: 100 ,underline:true},
        {data: 'Fax:', width: 20},
        {data: data.Attend_Fax, width: 70 ,underline:true}
      ]);
      rpt.newLine();

      rpt.band([
        {data: 'Fund:', width: 30},
        {data: data.Eng_Name, width: 150,underline:true},
        {data: 'Contact ', width: 40},
        {data: data.Contact_Name, width: 100, underline:true, font: 'thaiFron'},
        {data: 'Tel ', width: 20},
        {data: data.Contact_Tel, width: 70 ,underline:true},
        {data: 'Fax ', width: 20},
        {data: data.Contact_Fax, width: 50 ,underline:true}
      ]);
      rpt.newLine();
      rpt.newLine();


    // Detail Header
    rpt.fontBold();

    // rpt.bandLine();
    // rpt.band([
    //   {data: '', width: 60},
    //   {data: '', width: 60},
    //   {data: '', width: 60},
    //   {data: '', width: 60},
    //   {data: 'subscription-baht', width: 220, align: 'center',border: {left: 1, right: 1, top: 2, bottom: 0}},
    //   {data: 'redemtion', width: 120, align: 'center' ,border: {left: 1, right: 1, top: 2, bottom: 0}},
    //   {data: 'switching', width: 120, align: 'center' ,border: {left: 1, right: 1, top: 2, bottom: 0}},
    // ]);
    // rpt.bandLine();

    rpt.band([
      {data: 'NO #', width: 60},
      {data: 'Type', width: 60},
      {data: 'Unit Holder', width: 60},
      {data: 'Holder name', width: 60},
      {data: 'Sales name', align: 3, width: 60},

      {data: 'check-baht', width: 60, align: 3},
      {data: 'check no/bank/branch', width: 100, align: 3},
      {data: 'cash-baht', width: 60, align: 3},
      {data: 'Unit', width: 60, align: 3},
      {data: 'To fund', width: 60, align: 3},
    ]);
    rpt.bandLine();

    rpt.fontNormal();
  };

    var detail = function(rpt, data) {
    // Detail Body
      rpt.band([
       {data: '', width: 60, align: 1},
       {data: data.TranType_Code},
       {data: data.Holder_Id},
       {data: data.fullName, width: 100},
       {data: data.User_Name, align: 3, width: 60},

       {data: '', width: 60, align: 3},
       {data: '', width: 60, align: 3},
       {data: data.Amount_Baht, width: 65, align: 3},
       {data: data.Amount_Unit, width: 60, align: 3},
       {data: '', width: 60, align: 3}
      ], {border: 0, width: 0, height: 100,font:'thaiFron'});
  };


    var resultReport = new Report(rptName)
        .data(mydata)
        // .totalFormatter(totalFormatter)
        ;

    // Settings
    resultReport
      .fontsize(9)
      .margins(40)
      .landscape(true)
        .detail(detail)
        .header(header, {pageBreakBefore: true} )
        .registerFont ( 'thaiFron',  {normal: rptPATH +'THSarabun.ttf'} )
        // .registerFont ( 'ARIALUNI',  {normal: rptPATH +'ARIALUNI.ttf'} )
    ;

    // Hey, everyone needs to debug things occasionally -- creates debug output so that you can see how the report is built.
    resultReport.printStructure();

    resultReport.render(function(err, name) {
        res.download(rptName); // Set disposition and send it.
      //   res.status(200).json({
      //     report: name
      // });
    });

}, function(err) {

  console.log('ERROR >>' + JSON.stringify(err));

  res.status(204).json({
    message: "Report error " + JSON.stringify(err)
  });
})

}



