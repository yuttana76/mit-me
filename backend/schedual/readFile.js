// const UploadFundNAV = require('../controllers/uploadFund');
const fund = require('../controllers/fund');

var fs = require('fs');
var AdmZip = require('adm-zip');
var textfile_name = 'NAV.txt';

exports.readFile = (fileName) => {

    var DOWNLOAD_DIR = './downloadFiles/';

    console.log("Reading file >> " + DOWNLOAD_DIR + fileName);

    var zip = new AdmZip(DOWNLOAD_DIR + fileName);
    // var zipEntries = zip.getEntries(); // an array of ZipEntry records
    zip.extractAllTo(/*target path*/DOWNLOAD_DIR, /*overwrite*/true);

    fs.readFile(DOWNLOAD_DIR + textfile_name, function(err, data) {
        if(err) throw err;
        var array = data.toString().split("\n");

        var attr = array[0].split("|") ;

        console.log('Record data:' +array.length );
        console.log('Fund data:' + attr[2]);

        if ( attr[2] != (array.length - 1 ) ){
            console.log('Download data missing. Try again')
            return ;
        }

        console.log('Process NEXT !')

        array.shift(); //removes the first array element
        // UploadFundNAV.uploadNAV(array);

        // //attr.length
        for(i in array) {
            var item = array[i].split("|") ;

          // 1	AMC Code
          // 2	Fund Code
          // 3	AUM
          // 4	NAV
          // 5	Offer NAV
          // 6	Bid NAV
          // 7	Switch Out NAV
          // 8	Switch In NAV
          // 9	NAV Date
          var _Close_Date = transformDate(item[8]);
          fundData = `{
            "Fund_Code":"${item[1]}"
            ,"Close_Date":"${_Close_Date}"
            ,"Asset_Size":"${item[2] || 0}"
            ,"Nav_Price":"${item[3] || 0}"
            ,"Offer_Price":"${item[4] || 0}"
            ,"Bid_Price":"${item[5] || 0}"
            ,"OfferSwitch_Price":"${item[6] || 0}"
            ,"BidSwitch_Price":"${item[7] || 0}"
          }`;

          // UploadFundNAV.uploadNAV(fundData);
          fund.uploadNAV(fundData);

        }

    });

    fs.unlink(DOWNLOAD_DIR + textfile_name, function () {
        console.log('write operation complete.');
    });
}

// 20181128
function transformDate(val) {
  var  _year = val.slice(0, 4);
  var  _month = val.slice(4, 6);
  var  _date = val.slice(6, 8);
  return _year+"-"+_month+"-"+_date;
}
