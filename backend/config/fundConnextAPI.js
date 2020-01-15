
fundConnextApi_DEMO = {
  FC_API_URI: 'demo.fundconnext.com',
  FC_API_AUTH: {
    "username":"API_MPAM01",
    "password":"nj6c^$QaQPwXreFP"
  }
}

fundConnextApi_STAGE = {
  FC_API_URI: 'stage.fundconnext.com',
  FC_API_AUTH: {
    "username":"api_mpam01",
    "password":"n^4b&g+^jrES-?^j"
  }
}

fundConnextApi_PROD = {
    FC_API_URI: 'www.fundconnext.com',
    FC_API_AUTH: {
      "username":"API_MPAM01",
      "password":"Ea7!d!Kt-)(2*%F3"
    }
  }

exports.FC_API_URI= process.env.FC_API_URI || fundConnextApi_STAGE.FC_API_URI;
exports.FC_API_AUTH= process.env.FC_API_AUTH || fundConnextApi_STAGE.FC_API_AUTH;

// exports.FC_API_URI= fundConnextApi_STAGE.FC_API_URI;
// exports.FC_API_AUTH= fundConnextApi_STAGE.FC_API_AUTH;

exports.FC_API_PATH = {
  AUTH_PATH :"/api/auth",
  DOWNLOAD_PATH :"/api/files/",
  INVEST_PROFILE_PATH :"/api/customer/individual/investor/profile",
  INVEST_INDIVIDUAL :"/api/customer/individual"
}

exports.LOCAL = {
  DOWNLOAD_PATH :'./backend/downloadFiles/fundConnext/'
}

