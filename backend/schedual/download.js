/*
1. Download file HTTP
2. Save file to /downloadFiles/yyyymmdd-hhmm-NAV.zip
3. Call /api/fund/uploadNAV/yyyymmdd-hhmm-NAV.zip
  3.1 Extract & Upload NAV to db.
*/

const fs = require('fs');
const download = require('download');
const ReadFileModule = require('./readFile');

// const https = require('https');
var request = require('request');



var srcfile_name = 'NAV.zip';
// var srcfile_name = '20181128_MPAM_SET_NAV.txt';


var file_url = 'http://localhost:3000/api/download/'+ srcfile_name;

// http://localhost:3000/api/fund/uploadNAV/20181217-1125-NAV.zip
var upload_url = 'http://localhost:3000/api/fund/uploadNAV/';
var DOWNLOAD_DIR = './downloadFiles/';

exports.downloadFileHTTP = () => {

  console.log("Downloading HTTP >> " + file_url);
// const dateformat = require('dateformat');
let curDate = new Date();
let prefixFile =  curDate.getFullYear() +""+ (curDate.getMonth()+1)+""+ curDate.getDate() +"-"+curDate.getHours() +""+ curDate.getMinutes()+"-";
var targetfile_name = prefixFile+'NAV.zip';
// var textfile_name = prefixFile+'-NAV.txt';

  download(file_url).then(data => {

    // fs.writeFileSync(DOWNLOAD_DIR + targetfile_name, data);

    fs.writeFile(DOWNLOAD_DIR + targetfile_name, data, function(err) {
      if(err) {
          return console.log(err);
      }

      console.log("HTTP calling  >>" + upload_url+targetfile_name);

      request
      .get(upload_url+targetfile_name)
      .on('error', function(err) {
        console.log('ERR >>'+err)
      })
      .on('response', function(response) {
        console.log('RSP >>'+response.statusCode) // 200
        console.log(response.headers['content-type']) // 'image/png'
      })

  });

    // //Call module
    ReadFileModule.readFile(targetfile_name);

    var zip = new AdmZip(DOWNLOAD_DIR + targetfile_name);
    zip.extractAllTo(/*target path*/DOWNLOAD_DIR, /*overwrite*/true);

        fs.unlink(DOWNLOAD_DIR + targetfile_name, function () {
          console.log('write operation complete.');
    });

  });


}



// function downloadFile(file, callback) {
//   if (file.downloadUrl) {
//     var accessToken = gapi.auth.getToken().access_token;
//     var xhr = new XMLHttpRequest();
//     xhr.open('GET', file.downloadUrl);
//     xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
//     xhr.onload = function() {
//       callback(xhr.responseText);
//     };
//     xhr.onerror = function() {
//       callback(null);
//     };
//     xhr.send();
//   } else {
//     callback(null);
//   }
// }
