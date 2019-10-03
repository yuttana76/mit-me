/*
https://member.smsmkt.com/SMSLink/SendMsg/index.php?User=merchant&Password=123456&Msnlist=0897765331&Msg=Test MPAMxxx&Sender=MERCHANT
 */

  SMSParameters = {
    url:'https://member.smsmkt.com/SMSLink/SendMsg/index.php?',
    user:'merchant',
    pwd:'123456',
    sender:'MERCHANT'
  }


  exports.SMSCompleteURL2 =  function(mobile,msg) {
    var msgEndcode = encodeURI(msg);

    var completeUrl= SMSParameters.url+ `User=${SMSParameters.user}&Password=${SMSParameters.pwd}&Sender=${SMSParameters.sender}&Msnlist=${mobile}&Msg=${msgEndcode}`
    return(completeUrl);
  }
