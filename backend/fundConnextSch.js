
/*
1. Have to start REST API server. ( MOCKUP download file )
 */
const https = require('https');
const fs = require('fs');
const cron1 = require("node-cron");

const DownloadModule = require('./schedual/download');
const ReadFileModule = require('./schedual/readFile');

const DownloadToDB = require('./schedual/downloadToDB');

// ************ Schedualer
// // // Every 5 min in 11am,12am, 13pm, 14pm,15pm  on weekday
//   // cron2.schedule("*/2 11,12,13,14,15 * * mon,tue,wed,thu,fri", function() {
//     cron1.schedule("* * * * mon,tue,wed,thu,fri", function() {

//     console.log("running on time(11,12,13) every 10 min. " + new Date());
//     // DownloadModule.downloadFileHTTP()

//     DownloadToDB.downloadToDB();

//   });

// ************ Jobs
DownloadToDB.downloadToDB();

