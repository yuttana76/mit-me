const app = require("./app");
const debug = require("debug")("node-angular");
const http = require("http");
const https = require('https');
const fs = require('fs');

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

// // HTTP
// const server = http.createServer(app);
// server.on("error", onError);
// server.on("listening", onListening);
// server.listen(port,function () {
//   console.log("Listening on port http://localhost:%s", server.address().port);
// })

// HTTPS

// var intermediateCertificate = fs.readFileSync('intermediate.pem', 'utf8');
// https.createServer({
//     key: privateKey,
//     cert: certificate,
//     ca: [ intermediateCertificate ]
// }, app).listen(port);

// console.log('DIR>' + __dirname);
// ************************************** GET IP address
var os = require('os');
var ifaces = os.networkInterfaces();

Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;

  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }

    if (alias >= 1) {
      // this single interface has multiple ipv4 addresses
      console.log(ifname + ':' + alias, iface.address);
    } else {
      // this interface has only one ipv4 adress
      console.log(ifname, iface.address);
    }
    ++alias;
  });

});
// ************************************** HTTPS
const option = {
  key: fs.readFileSync(__dirname+'/merchantasset_CA/key.pem'),
  cert: fs.readFileSync(__dirname+'/merchantasset_CA/cert.pem'),
  ca: fs.readFileSync(__dirname+'/merchantasset_CA/inter.pem'),
    passphrase: 'mpam@2019'
};
var server = https.createServer(option, app)
.listen(port,function () {
  console.log("Listening on port https://localhost:%s", server.address().port);
})
