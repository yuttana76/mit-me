const dbConfig = require('../config/db-config');
var config = dbConfig.dbParameters;
var AdmZip = require('adm-zip');
var fs = require('fs');
const path = require("path");
var logger = require('../config/winston');

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
