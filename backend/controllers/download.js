const dbConfig = require('../config/db-config');
var config = dbConfig.dbParameters;
var AdmZip = require('adm-zip');
var fs = require('fs');
const path = require("path");
var logger = require('../config/winston');

const  DOWNLOAD_PATH = './backend/downloadFiles/files/';

exports.downloadNAV = (req, res, next) => {

    var file = req.params.file;
    var fileLocation = path.join('./backend/uploadFiles',file);

    logger.info('/api/download/NAV ' + fileLocation);

    // Check if the file exists in the current directory.
    fs.access('./backend/uploadFiles/'+file, fs.constants.F_OK, (err) => {

      if(err){
        logger.error('/api/download/NAV ' + err);
        res.status(422).json({
          message: "Unprocessable Entity"
        });
      }

      res.download(fileLocation, file);

    });

  }

exports.downloadfile = (req, res, next) => {

    var fileName = req.params.fileName + '_fundConnextOpenAccount.pdf';

    var fileLocation = path.join(DOWNLOAD_PATH,fileName);

      logger.info('/api/download/file  file=' + fileName);

    // Check if the file exists in the current directory.
    fs.access(DOWNLOAD_PATH+fileName, fs.constants.F_OK, (err) => {

      if(err){
        logger.error(DOWNLOAD_PATH + err);
        res.status(422).json({
          message: "Unprocessable Entity"
        });
      }

      res.download(fileLocation, fileName);

    });





}
