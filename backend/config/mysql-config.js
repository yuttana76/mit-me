const mpamConfig = require('../config/mpam-config');

exports.swan_dbParameters = {
  connectionLimit : 10,
  host            : mpamConfig.MYSQL_SERVER,
  user            : mpamConfig.MYSQL_USER,
  password        : mpamConfig.MYSQL_PASSWORD,
  // database        : 'my_db'
}
