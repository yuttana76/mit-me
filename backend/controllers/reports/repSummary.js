var Report = require('fluentReports' ).Report;
var request = require("request");
var Report = require('fluentReports' ).Report;
var logger = require('../../config/winston');

// ***************************************************
function getDATA(req) {
  var options = {
      url: process.env.BE_URL +'/trans/report',
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

        console.log('***STEP 2-2');
        resolve(JSON.parse(body));
          // if (err) {
          //     reject(err);
          // } else {
          //     resolve(JSON.parse(body));
          // }
      })
  })
}

exports.repSummary = (req, res, next) => {
  var fncName = 'repSummary';
  console.log('Welcome ' + fncName);

  logger.info('API repSummary ');

  // Optional -- If you don't pass a report name, it will default to "report.pdf"
  var prefix ='001';
  var rptName =  `./backend/reports/${prefix}_summaryReport.pdf`

  'use strict';

  var getData = getDATA(req);
  console.log('***STEP 3');

  getData.then(function(result) { // PROMISE

    console.log("Initialized user details");
    var mydata = result.result;

    var contactInfo = function(rpt, data) {

      rpt.print([
        data.name,
        data.add1,
        data.add2,
        [data.city, data.state.abbr, data.zip].join(' ')
      ], {x:80});

    };

    // var message = function(rpt, data) {

    //   var msg = [
    //        'Dear '+ (data.person ? data.person : 'Valued Customer') + ',',
    //        ' ',
    //        'Our records indicate that you have invoices that have not been paid and are overdue or you have credits that have not been applied.',
    //        'You are receiving this statement as a reminder of invoices or credits that haven\'t been resolved.',
    //        'If you have questions or comments concerning your statement please call 555-1212 and speak to someone in our billing department.',
    //        '',
    //        'Thank you in advance for your cooperation in this matter.'];

    //     rpt.print(msg, {textColor: 'blue'});
    // };


  //   var nameheader = function ( rpt, data ) {

  //     rpt.print(' To AMC ' + data.Amc_Code, {fontSize: 8, align: 'center'} );
  //     rpt.print([' Trade date ' + data.StartDate , ' to ' + data.EndDate ].join(' '), {fontSize: 8,align: 'center'} );


  //     // rpt.band([
  //     //   {data: 'To AMC'},
  //     //   {data: data.Amc_Code, align: 'center'}
  //     // ]);

  //   rpt.newLine();

  // };

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
        {data: data.Attend_Name, width: 100 ,underline:true, font: 'ARIALUNI',x: 100, addY: 2},
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
        {data: data.Contact_Name, width: 100, underline:true, font: 'ARIALUNI'},
        {data: 'Tel ', width: 20},
        {data: data.Contact_Tel, width: 70 ,underline:true},
        {data: 'Fax ', width: 20},
        {data: data.Contact_Fax, width: 50 ,underline:true}
      ]);
      rpt.newLine();


    // Contact Info
    // contactInfo(rpt, data);
      // nameheader(rpt, data);

    rpt.newline();
    rpt.newline();
    rpt.newline();

    // Message
    // message(rpt,data);

    rpt.newline();
    rpt.newline();
    rpt.newline();

    // Detail Header
    rpt.fontBold();
    rpt.band([
      {data: 'Invoice #', width: 60},
      {data: 'Cust PO'},
      {data: 'Invoice Date', width: 60},
      {data: 'Current', align: 3, width: 60},
      {data: '31-60 Days', width: 60, align: 3},
      {data: '61-90 Days', width: 60, align: 3},
      {data: '91-120 Days', width: 65, align: 3},
      {data: '>120 Days', width: 60, align: 3},
      {data: 'Total Due', width: 60, align: 3}
    ]);
    rpt.fontNormal();
    rpt.bandLine();
  };

    var detail = function(rpt, data) {
    // Detail Body
      rpt.band([
       {data: data.sale.no, width: 60, align: 1},
       {data: data.sale.purchase_order},
       {data: data.sale.invoice_date, width: 60},
       {data: data.current, align: 3, width: 60},
       {data: data.thirty, width: 60, align: 3},
       {data: data.sixty, width: 60, align: 3},
       {data: data.ninety, width: 65, align: 3},
       {data: data.hundredtwenty, width: 60, align: 3},
       {data: data.sale.balance_due, width: 60, align: 3}
      ], {border: 1, width: 0});
  };

    var finalSummary = function(rpt, data) {

    rpt.standardFooter([
      ['sale.no',1,3],
      ['current', 4, 3],
      ['thirty', 5, 3],
      ['sixty', 6, 3],
      ['ninety', 7, 3],
      ['hundredtwenty', 8, 3],
      ['sale.balance_due', 9, 3]
    ]);
    rpt.newline();
    rpt.newline();
    rpt.print('Thank You for Choosing us!', {align: 'right'});
  };

      var totalFormatter = function(data, callback) {

          for (var key in data) {
              if (data.hasOwnProperty(key)) {
                  if (key === 'sale.no') { continue; }
                  // Simple Stupid Money formatter.  It is fairly dumb.  ;-)
                  var money = data[key].toString();
                  var idx = money.indexOf('.');
                  if (idx === -1) {
                      money += ".00";
                  } else if (idx === money.length-2) {
                      money += "0";
                  }
                  for (var i=6;i<money.length;i+=4) {
                      money = money.substring(0,money.length-i) + "," + money.substring(money.length-i);
                  }

                  data[key] = '$ '+money;

              }
          }

          callback(null, data);
      };

    var resultReport = new Report(rptName)
        .data(mydata)
        // .totalFormatter(totalFormatter)
        ;

      // You can Chain these directly after the above like I did or as I have shown below; use the resultReport variable and continue chain the report commands off of it.  Your choice.

    // Settings
    resultReport
      .fontsize(9)
      .margins(40)
        // .detail(detail)
        // .groupBy('id')
        // .sum('current')
        // .sum('thirty')
        // .sum('sixty')
        // .sum('ninety')
        // .sum('hundredtwenty')
        // .sum('sale.balance_due')
        // .count('sale.no')
        // .footer(finalSummary)
        .header(header, {pageBreakBefore: true} )
          .registerFont ( 'ARIALUNI',  {normal: './backend/reports/ARIALUNI.ttf'} )
        // .font('Times-Roman')
    ;

    // Hey, everyone needs to debug things occasionally -- creates debug output so that you can see how the report is built.
    resultReport.printStructure();

    console.time("Rendered");
    resultReport.render(function(err, name) {
        console.timeEnd("Rendered");

        res.download(rptName); // Set disposition and send it.

      //   res.status(200).json({
      //     report: name
      // });

    });

}, function(err) {
    console.log(err);
})

}



