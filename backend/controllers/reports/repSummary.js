// var Report = require('../../node_modules/fluentreports' ).Report;
// D:\Merchants\apps\mit\node_modules\fluentreports

var request = require("request");
// var Report = require('fluentReports' ).Report;
var logger = require('../../config/winston');
var util = require("../../util/validateUtil");
var rptPATH = './backend/downloadFiles/reports/';
var fs = require('fs');

var transTypeDesc = { B:'Subscription',S:'Redemption', SO:'Switch-out' };

// ***************************************************
function getTransactionDATA(req) {
  var options = {
      url: process.env.apiURL +'/trans/report/transaction',
      headers: {'User-Agent': 'request'},
      qs:{
        startDate:req.query.startDate,
        endDate:req.query.endDate,
        amcCode:req.query.amcCode,
        fundCode:req.query.fundCode
      }
  };
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

function getTransactionHeader(req) {
  var options = {
      url: process.env.apiURL +'/trans/report/transactionHeader',
      headers: {'User-Agent': 'request'},
      qs:{
        startDate:req.query.startDate,
        endDate:req.query.endDate,
        amcCode:req.query.amcCode,
        fundCode:req.query.fundCode
      }
  };
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

function getTransactionByTransType(req) {
  var options = {
      url: process.env.apiURL +'/trans/report/transactionByTransType',
      headers: {'User-Agent': 'request'},
      qs:{
        startDate:req.query.startDate,
        endDate:req.query.endDate,
        amcCode:req.query.amcCode,
        fundCode:req.query.fundCode
      }
  };
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
  var getData = getTransactionDATA(req);

  getData.then(function(data) { // PROMISE
    console.log("Initialized user details");
    var mydata = data.result;
    var pageHeader = function(rpt, data) {
      rpt.printedAt({fontSize: 5, align: 'right'});
      rpt.pageNumber({align :'right',footer:true,text:'Page {0} of {1}'});
      rpt.newline();
      rpt.print('Summary of Subscription, Redemption and Switching Form', {fontBold: true, fontSize: 14, align: 'center'});// Report Title
      rpt.newLine();
    }

    var header = function(rpt, data) {
      rpt.printedAt({fontSize: 5, align: 'right'});
      rpt.newline();

      // Report Title
      rpt.print('Summary of Subscription, Redemption and Switching Form', {fontBold: true, fontSize: 14, align: 'center'});

  };

  var amcHeader = function(rpt, data) {
    rpt.print(' To AMC ' + data.Amc_Code, {fontBold: true, fontSize: 10, align: 'center'});
    rpt.print([' Trade date ' + data.StartDate , ' to ' + data.EndDate ].join(' '), {fontBold: true, fontSize: 10, align: 'center'} );
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
  }

    var detail = function(rpt, data) {

      // console.log( 'DETAIL>>' + JSON.stringify(data)) ;

      rpt.fontNormal();

      // Format number
      _Amount_Baht= util.number_format(data.Amount_Baht,2);
      _Amount_Unit= util.number_format(data.Amount_Unit,4);
      _transTypeDesc =  transTypeDesc[data.TranType_Code]

      // Detail Body
      rpt.band([
       {data: data._row, width: 60, align: 2},
       {data: _transTypeDesc, width: 60, align: 2},
       {data: data.Holder_Id, width: 60, align: 2},
       {data: data.fullName, width: 100},
       {data: data.User_Name, align: 3, width: 60},
       {data: '', width: 60, align: 3},
       {data: '', width: 100, align: 3},
       {data: _Amount_Baht, width: 80, align: 3},
       {data: _Amount_Unit, width: 60, align: 3},
       {data: data.Fund_SI, width: 60, align: 2}
      ],{border: 0, width: 0, wrap: 1,font:'thaiFron',fontSize:10});

  };

    var amcFooter = function ( rpt, data, state ) {
      rpt.newLine();
      rpt.bandLine();
      rpt.newLine();
      _total = util.number_format(rpt.totals.Amount_Baht,2);
      rpt.band([
          ["Grand - Totals for " + data.Amc_Code , 300],
          [_total, 100, 3]
      ], {addY: 1});
      rpt.newLine();
      rpt.bandLine();
    };

    var fundHeader = function ( rpt, data ) {

      rpt.fontBold();
      rpt.print( [data.Fund_Code + " (" + data.Eng_Name+")" ]  , {x: 1, addY: 2,fontBold: true, fontSize: 10} );
      rpt.newLine();
     // Detail Header

     rpt.band([
       {data: 'NO #',align: 2, width: 60},
       {data: 'Type',align: 2,width: 60},
       {data: 'Unit Holder',align: 2, width: 60},
       {data: 'Holder name',align: 2, width: 100},
       {data: 'Sales name', align: 2, width: 60},
       {data: 'check-baht',align: 2, width: 60},
       {data: 'check no/bank/branch',align: 2, width: 100},
       {data: 'cash-baht', align: 3,width: 65},
       {data: 'Unit',align: 3, width: 60},
       {data: 'To fund', align: 3,width: 60},
     ]);
     rpt.bandLine();
    //  rpt.newLine();

    };

    var fundFooter = function ( rpt, data ) {
      _total = util.number_format(rpt.totals.Amount_Baht,2);
      rpt.newLine();
      rpt.print( ["     Total "+ data.Fund_Code + "      "  + _total]  , {x: 500, addY: 2} );
      rpt.newLine();
      rpt.bandLine();
    };

    var resultReport = new Report(rptName)
        .data(mydata)
        .fontsize(9)
        .margins(5)
        .pageHeader( pageHeader )// Optional
        .landscape(true)
        .detail(detail)
        .registerFont ( 'thaiFron',  {normal: rptPATH +'THSarabun.ttf'} )
    ;

    resultReport.groupBy( "Amc_Code" )
          .sum('Amount_Baht')
          .header( amcHeader)
          .footer( amcFooter )
          .groupBy( "Fund_Code" )
            .sum('Amount_Baht')
            .header( fundHeader )
             .footer( fundFooter ,{pageBreakAfter: true});


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

//*************************************** */

exports.repSummaryByTransType = (req, res, next) => {
  var fncName = 'repSummaryByTransType';
  console.log('Welcome ' + fncName);
  logger.info('API repSummary ');
  var prefix ='001';
  var rptName =  rptPATH+`${prefix}_summaryReportByTransType.pdf`
  const IMG_LOGO = "./backend/downloadFiles/images/MPAM-logo.png";
  'use strict';

    // console.log("Header Data" + JSON.stringify(header));
    var getDetailData = getTransactionByTransType(req);
    getDetailData.then(function(detailData) { // PROMISE

        var mydata = detailData.result;

      var pageHeader = function(rpt, data) {

        rpt.print('   MPAM Confidential ', {x: 80, y: 610, rotate: 310, opacity: 1, textColor: '#EEEEEE', width: 1000, fontSize: 80});

        rpt.setCurrentY(14);
         if (IMG_LOGO && fs.existsSync(IMG_LOGO)) {
             rpt.image(IMG_LOGO, {scale :0.7,align:3});
         }
         rpt.setCurrentY(20);

        // console.log('LOGO>> ' + fs.existsSync("./backend/downloadFiles/images/MPAM-logo.png"));
        //  rpt.image("./backend/downloadFiles/images/MPAM-logo.png", {width: 200});

        rpt.printedAt({fontSize: 5, align: 'right'});
        rpt.pageNumber({align :'right',footer:true,text:'Page {0} of {1}'});
        rpt.newline();
        rpt.print('Merchant Partners Asset Management Limited', {fontBold: true, fontSize: 12, align: 'center'});// Report Title
        rpt.print('Dialy Transaction Summary', {fontBold: true, fontSize: 10, align: 'center'});// Report Title
      }

      var amcHeader = function(rpt, data) {
        rpt.newLine();
        rpt.band([
          {data: 'AMC :', width: 30 ,fontBold: true ,fontSize: 14},
          {data: data.AmcCode, width: 50,underline:true ,align: 1 ,fontSize: 14},
          {data: 'Transaction : ', width: 70 ,fontBold: true ,fontSize: 14},
          {data: data.TransDate, width: 120, underline:true ,align: 1 ,fontSize: 14},
          {data: 'Attn to : ', width: 40 ,fontBold: true ,fontSize: 14},
          {data: data.Attend_Name, width: 130 ,underline:true ,align: 1 , fontSize: 14},
          {data: 'E-mail : ', width: 40 ,fontBold: true ,fontSize: 14},
          {data: data.Email_Address, width: 150 ,underline:true ,align: 1 ,fontSize: 14},
          {data: 'Tel : ', width: 30 ,fontBold: true ,fontSize: 14},
          {data: data.Attend_Tel, width: 100 ,underline:true ,align: 1 ,fontSize: 14}
        ],{font:'thaiFron'} );
        rpt.newLine();

        rpt.fontNormal();
        rpt.band([
          {data: 'Subscription', width: 241 ,fontBold: true ,align: 2 },
          {data: 'Redemption', width: 120 ,fontBold: true ,align: 2 },
          {data: 'Switching-out ', width: 200 ,fontBold: true ,align: 2 },
        ],{ border: 1,x: 194 });

        rpt.band([
          {data: 'NO', width: 30 ,fontBold: true ,align: 2},
          {data: 'Holder ID', width: 65 ,fontBold: true ,align: 2},
          {data: 'Holder Name', width: 100 ,fontBold: true ,align: 2},
          {data: 'Cash(Baht)', width: 60 ,fontBold: true ,align: 2},
          {data: 'Cheque(Baht)', width: 70 ,fontBold: true ,align: 2},
          {data: 'Cheque no/Bank/Branch ', width: 110 ,fontBold: true ,align: 2},
          {data: 'Baht', width: 60 ,fontBold: true ,align: 2},
          {data: 'Units', width: 60 ,fontBold: true ,align: 2},
          {data: 'Baht', width: 60 ,fontBold: true ,align: 2},
          {data: 'Units', width: 60 ,fontBold: true ,align: 2},
          {data: 'To Fund', width: 80 ,fontBold: true ,align: 2},
        ],{ border: 1 } );
      }

      var amcFooter = function ( rpt, data, state ) {
        rpt.fontNormal();

        // rpt.bandLine(tickness=1);
        rpt.newLine();
        SUB_Baht_total = util.number_format(rpt.totals.SUB_Baht,2);
        RED_Baht_total = util.number_format(rpt.totals.RED_Baht,2);
        SW_Baht_total = util.number_format(rpt.totals.SW_Baht,2);

        rpt.band([
          {data: 'Grand - Total ', width: 184 ,fontBold: true ,align: 2 },
          {data: SUB_Baht_total, width: 70 ,fontBold: true ,align: 3 },
          {data: '', width: 70 ,fontBold: true ,align: 3 },
          {data: '', width: 100 ,fontBold: true ,align: 3 },
          {data: RED_Baht_total, width: 70 ,fontBold: true ,align: 3 },
          {data: '', width: 50 ,fontBold: true ,align: 2 },
          {data: SW_Baht_total, width: 70 ,fontBold: true ,align: 3 },
          {data: '', width: 60 ,fontBold: true ,align: 2 },
          {data: '', width: 80 ,fontBold: true ,align: 2 }
        ],{ border: 0,wrap: 1});
        rpt.newLine();
        rpt.bandLine(tickness=2);

      };

    var detail = function(rpt, data) {
      rpt.fontNormal();
      _SUB_Baht= util.number_format(data.SUB_Baht,2);
      _SUB_Cheque= util.number_format(data.SUB_Cheque,2);
      _RED_Baht= util.number_format(data.RED_Baht,2);
      _RED_Unit= util.number_format(data.RED_Unit,4);
      _SW_Baht= util.number_format(data.SW_Baht,2);
      _SW_Unit= util.number_format(data.SW_Unit,4);

      // Detail Body
      rpt.band([
        {data: '', width: 30  },
        {data: data.Holder_Id, width: 65,fontSize: 8 },
        {data: data.HolderName, width: 100 ,fontSize: 14,font:'thaiFron'},
        {data: _SUB_Baht, width: 60 ,fontSize: 8, align:3},
        {data: _SUB_Cheque, width: 70 ,fontSize: 8, align:3},
        {data: data.SUB_ChequeDesc, width: 110 ,fontSize: 8},
        {data: _RED_Baht, width: 60 ,fontSize: 8, align:3},
        {data: _RED_Unit, width: 60 ,fontSize: 8, align:3},
        {data: _SW_Baht, width: 60 ,fontSize: 8, align:3},
        {data: _SW_Unit, width: 60 ,fontSize: 8, align:3},
        {data: data.SW_ToFund, width: 80 ,fontSize: 8, align:2},
        ],{border: 1, width: 0, wrap: 1});
      };

      var fundHeader = function(rpt, data) {
        rpt.fontNormal();
        rpt.newLine();
        rpt.print(data.FundCode, {fontBold: true, fontSize: 10, align: 'left'});
      }

      var fundFooter = function ( rpt, data ) {
        rpt.fontNormal();
        rpt.newLine();
        SUB_Baht_total = util.number_format(rpt.totals.SUB_Baht,2);
        RED_Baht_total = util.number_format(rpt.totals.RED_Baht,2);
        SW_Baht_total = util.number_format(rpt.totals.SW_Baht,2);

        rpt.band([
          {data: 'Total '+data.FundCode, width: 184 ,fontBold: true ,align: 2 },
          {data: SUB_Baht_total, width: 70 ,fontBold: true ,align: 3 },
          {data: '', width: 70 ,fontBold: true ,align: 2 },
          {data: '', width: 100 ,fontBold: true ,align: 2 },
          {data: RED_Baht_total, width: 70 ,fontBold: true ,align: 3 },
          {data: '', width: 50 ,fontBold: true ,align: 2 },
          {data: SW_Baht_total, width: 70 ,fontBold: true ,align: 3 },
          {data: '', width: 60 ,fontBold: true ,align: 2 },
          {data: '', width: 80 ,fontBold: true ,align: 2 }
        ],{ border: 0,wrap: 1,});
        // rpt.newLine();
        // rpt.bandLine(tickness=1);
      };


      // Start create report
      var resultReport = new Report(rptName)
      .data(mydata)
      .fontsize(9)
      .margins(5)
      .landscape(true)
      .pageHeader( pageHeader )// Optional
      .detail(detail)
      .registerFont ( 'thaiFron',  {normal: rptPATH +'THSarabun.ttf'} )
  ;

  resultReport.groupBy( "Amc_Code" )
        // .sum('SUB_Baht')
        .sum('SUB_Baht')
        .sum('RED_Baht')
        .sum('SW_Baht')
        .header( amcHeader)
        .footer( amcFooter )
        .groupBy( "FundCode" )
          .sum('SUB_Baht')
          .sum('RED_Baht')
          .sum('SW_Baht')
          .header( fundHeader )
          .footer( fundFooter )
          .registerFont ( 'thaiFron',  {normal: rptPATH +'THSarabun.ttf'} )

      // Hey, everyone needs to debug things occasionally -- creates debug output so that you can see how the report is built.
      resultReport.printStructure();

      resultReport.render(function(err, name) {
          res.download(rptName); // Set disposition and send it.
      });

    }, function(err) {
      console.log('Detail ERROR >>' + JSON.stringify(err));
      res.status(204).json({
        message: "Report error " + JSON.stringify(err)
      });
    })


  }
