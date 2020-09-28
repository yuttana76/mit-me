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
const port = normalizePort(process.env.PORT || "3000");
console.log('NODE_ENV =' +process.env.NODE_ENV );
console.log('SQL_SERVER =' +process.env.SQL_SERVER );
console.log('production =' +process.env.production );
console.log('PORT='+port);
app.set("port", port);

/****************************************
 * HTTP
//  */
const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port,function () {
  console.log("Listening on port http://localhost:%s", server.address().port);
})


/****************************************
 * HTTPS Configuratrion
 *
// */
// var os = require('os');
// var ifaces = os.networkInterfaces();
// Object.keys(ifaces).forEach(function (ifname) {
//   var alias = 0;
//   ifaces[ifname].forEach(function (iface) {
//     if ('IPv4' !== iface.family || iface.internal !== false) {
//       return;
//     }

//     if (alias >= 1) {
//       console.log(ifname + ':' + alias, iface.address);
//     } else {
//       console.log(ifname, iface.address);
//     }
//     ++alias;
//   });
// });

// const option = {
//   key: fs.readFileSync(process.env.CA_KEY_PATH),
//   cert: fs.readFileSync(process.env.CA_CERT_PATH),
//   ca: fs.readFileSync(process.env.CA_PATH),
// };

// // logger.info('HTTS config >>' + JSON.stringify(__dirname))
// var server = https.createServer(option, app)
// .listen(port,function () {
//   console.log("Listening on port https://localhost:%s", server.address().port);
// })

