
  const mpamConfig = require('../config/mpam-config');

  exports.SMSCompleteURL2 =  function(mobile,msg) {
    var msgEndcode = encodeURI(msg);

    var completeUrl= mpamConfig.SMS_URL+ `User=${mpamConfig.SMS_USER}&Password=${mpamConfig.SMS_PASSWORD}&Sender=${mpamConfig.SMS_SENDER}&Msnlist=${mobile}&Msg=${msgEndcode}`
    return(completeUrl);
  }
