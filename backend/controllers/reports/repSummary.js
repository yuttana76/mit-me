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
  var prefix ='001';
  var rptName =  rptPATH+`${prefix}_summaryReport.pdf`
  'use strict';
  var getData = getDATA(req);

  getData.then(function(result) { // PROMISE
    console.log("Initialized user details");
    var mydata = result.result;
    var pageHeader = function(rpt, data) {
      rpt.printedAt({fontSize: 5, align: 'right'});
      rpt.pageNumber({align :'right',footer:true,text:'Page {0} of {1}'});
      rpt.newline();
      rpt.print('Summary of Subscription, Redemption and Switching Form', {fontBold: true, fontSize: 14, align: 'center'});// Report Title

      // rpt.print(' To AMC ' + data.Amc_Code, {fontSize: 8, align: 'center'} );

      // rpt.print([' Trade date ' + data.StartDate , ' to ' + data.EndDate ].join(' '), {fontSize: 8,align: 'center'} );
      rpt.newLine();

      // rpt.band([
      //   {data: 'Agent ', width: 30},
      //   {data: data.Agent_Code, width: 30 ,underline:true},
      //   {data: ' ', width: 5},
      //   {data: data.Agent_Name, width: 60 ,underline:true},
      //   {data: 'Attn. to:', width: 30},
      //   {data: data.Attend_Name, width: 100 ,underline:true, font: 'thaiFron',x: 100, addY: 2},
      //   {data: 'Tel:', width: 20},
      //   {data: data.Attend_Tel, width: 100 ,underline:true},
      //   {data: 'Fax:', width: 20},
      //   {data: data.Attend_Fax, width: 70 ,underline:true}
      // ]);
      // rpt.newLine();

      // rpt.band([
      //   {data: 'Fund:', width: 30},
      //   {data: data.Eng_Name, width: 150,underline:true},
      //   {data: 'Contact ', width: 40},
      //   {data: data.Contact_Name, width: 100, underline:true, font: 'thaiFron'},
      //   {data: 'Tel ', width: 20},
      //   {data: data.Contact_Tel, width: 70 ,underline:true},
      //   {data: 'Fax ', width: 20},
      //   {data: data.Contact_Fax, width: 50 ,underline:true}
      // ]);
      // rpt.newLine();
      // rpt.newLine();
    }

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

  };

  var nameheader = function(rpt, data) {
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

     rpt.band([
       {data: 'NO #', width: 60},
       {data: 'Type', width: 60},
       {data: 'Unit Holder', width: 60},
       {data: 'Holder name', width: 100},
       {data: 'Sales name', align: 3, width: 60},
       {data: 'check-baht', width: 60, align: 3},
       {data: 'check no/bank/branch', width: 60, align: 3},
       {data: 'cash-baht', width: 65, align: 3},
       {data: 'Unit', width: 60, align: 3},
       {data: 'To fund', width: 60, align: 2},
     ]);
     rpt.bandLine();
  }

    var detail = function(rpt, data) {
      rpt.fontNormal();

      // Format number
      _Amount_Baht= number_format(data.Amount_Baht,2);
      _Amount_Unit= number_format(data.Amount_Unit,4);

      // Detail Body
      rpt.band([
       {data: data._row, width: 60, align: 2},
       {data: data.TranType_Code, width: 60, align: 2},
       {data: data.Holder_Id, width: 60, align: 2},
       {data: data.fullName, width: 100},
       {data: data.User_Name, align: 3, width: 60},
       {data: '', width: 60, align: 3},
       {data: '', width: 60, align: 3},
       {data: _Amount_Baht, width: 80, align: 3},
       {data: _Amount_Unit, width: 60, align: 3},
       {data: '', width: 60, align: 2}
      ], {border: 0, width: 0, height: 100,font:'thaiFron'});
  };

  var namefooter = function ( rpt, data, state ) {
    rpt.newLine();
    rpt.bandLine();
    // console.log('namefooter>>' + JSON.stringify(data) );

    rpt.newLine();

    _total = number_format(rpt.totals.Amount_Baht,2);
    rpt.band([
        ["Totals for " + data.Amc_Code  + ` - ${data.Eng_Name} (${data.Fund_Code})`, 300],
        [_total, 100, 3]
    ], {addY: 1});
    rpt.bandLine();
    rpt.newLine();
};

// var formatterFnc = function(data){
//   // console.log('******************* Formatter here !' );
//   data.Amount_Unit =0;
// }

    var resultReport = new Report(rptName)
        .data(mydata)
        .fontsize(9)
        .margins(40)
        .pageHeader( pageHeader )// Optional
        .landscape(true)
        .detail(detail)
        .registerFont ( 'thaiFron',  {normal: rptPATH +'THSarabun.ttf'} )
    ;

    resultReport.groupBy( "Amc_Code" )
          .sum('Amount_Baht')
          .header( nameheader)
          .footer( namefooter )
          .groupBy( "Fund_Code" );

    // Hey, everyone needs to debug things occasionally -- creates debug output so that you can see how the report is built.
    resultReport.printStructure();

    resultReport.render(function(err, name) {
        res.download(rptName); // Set disposition and send it.
    });

}, function(err) {

  console.log('ERROR >>' + JSON.stringify(err));
  res.status(204).json({
    message: "Report error " + JSON.stringify(err)
  });
})

}




// *************************************
function number_format (number, decimals) {
  number = Number(number).toFixed(decimals);
  var parts = number.toString().split(".");
  number = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");

  return number;
}

/**
*	Usage: 	number_format(123456.789, 2);
*	result:	123,456.79
**/
