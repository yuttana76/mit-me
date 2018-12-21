/**

pm2 start   ecosystem.config.js --env production

************************************************
pm2 stop
pm2 restart
pm2 delete

# Start all applications
pm2 start ecosystem.config.js

# Start only the app named worker-app
pm2 start ecosystem.config.js --only worker-app

# Stop all
pm2 stop ecosystem.config.js

# Restart all
pm2 start   ecosystem.config.js
## Or
pm2 restart ecosystem.config.js

# Reload all
pm2 reload ecosystem.config.js

# Delete all
pm2 delete ecosystem.config.js
************************************************
 */
module.exports = {
  apps : [{
    name   : "mit-app",
    script : "./backend/server.js",
    instances: 2,
    exec_mode: 'cluster',
    watch       : true,
    env: {
      NODE_ENV: "development",
    },
    env_production : {
       "NODE_ENV":"production",
        "PORT":"3100",
        "JWT_KEY":"secret_this_should_be_longer",
        "AUTH_SRV_USER": "mftsuser",
        "AUTH_SRV_PWD": "P@ssw0rd",
        "AUTH_SRV_IP": "192.168.10.48",
        "AUTH_SRV_db": "MFTS",
        "MAIL_SMTP":"smtp.inetmail.cloud",
        "MAIL_PORT":"587",
        "MAIL_USER":"italert@merchantasset.co.th",
        "MAIL_PASS":"Merchant@2018**",
        apiURL: 'http://192.168.10.58:31000/api',
    }
  }]
}


