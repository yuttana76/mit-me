const mpamConfig = require('../config/mpam-config');
const fs = require('fs');
const path = require('path');
var config = mpamConfig.dbParameters;
const https = require('https')
const crypto = require('crypto');
var logger = require("../config/winston");

exports.saveFcOpenAccount = (req, res, next) => {

  logger.info("saveFcOpenAccount" + JSON.stringify(req.body));

  res.status(200).json({
    result:"saveFcOpenAccount successful"
  });
}
