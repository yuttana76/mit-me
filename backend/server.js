const app = require("./app");
const debug = require("debug")("node-angular");
const http = require("http");
const https = require('https');
const fs = require('fs');

var logger = require('./config/winston');
const mpamConfig = require('./config/mpam-config');

const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  debug("Listening on " + bind);
};

//Lode global environment
const dotenv = require('dotenv');
dotenv.config();

const port = normalizePort(process.env.PORT || "3009");
console.log('NODE_ENV=' +process.env.NODE_ENV );
console.log('PORT='+port);

app.set("port", port);

// ************************************** HTTP
/*
const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port,function () {
  console.log("Listening on port http://localhost:%s", server.address().port);
})
*/

// ************************************** HTTPS Configuratrion

// var intermediateCertificate = fs.readFileSync('intermediate.pem', 'utf8');
// https.createServer({
//     key: privateKey,
//     cert: certificate,
//     ca: [ intermediateCertificate ]
// }, app).listen(port);

// console.log('DIR>' + __dirname);
// ************************************** GET IP address

var os = require('os');
// const { logger } = require("handlebars");
var ifaces = os.networkInterfaces();
Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;
  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      return;
    }

    if (alias >= 1) {
      console.log(ifname + ':' + alias, iface.address);
    } else {
      console.log(ifname, iface.address);
    }
    ++alias;
  });

});

key_path= mpamConfig.key_path? mpamConfig.key_path:__dirname+'/merchantasset_CA/key.pem';
cert_path= mpamConfig.cert_path? mpamConfig.cert_path:__dirname+'/merchantasset_CA/cert.pem';
ca_path= mpamConfig.ca_path? mpamConfig.ca_path:__dirname+'/merchantasset_CA/inter.pem';

const option = {
  key: fs.readFileSync('/home/api/self-signed-cert/server.key'),
  cert: fs.readFileSync('/home/api/self-signed-cert/server.cert')
};

// const option = {
//   key: fs.readFileSync(key_path),
//   cert: fs.readFileSync(cert_path),
//   ca: fs.readFileSync(ca_path),
//   passphrase: mpamConfig.cert_passphrase
// };

// const option = {
//   key: fs.readFileSync(key_path),
//   cert: fs.readFileSync(cert_path),
//   passphrase: mpamConfig.cert_passphrase
// };
// if(ca_path)
//   option.ca=fs.readFileSync(ca_path);



logger.info('HTTS config >>' + JSON.stringify(__dirname))

var server = https.createServer(option, app)
.listen(port,function () {
  console.log("Listening on port https://localhost:%s", server.address().port);
})

