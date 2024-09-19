/***********************************************************
    src/config/config.js
                This file stores the configuration settings 
                for different environments.
***********************************************************/

const dotenv = require('dotenv')

// Load environment variables from .env file
dotenv.config()

// Configuration object
const config = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET,
  //mongoURI: process.env.MONGODB_URI,
  mongoURI: process.env.LOCAL_MONGODB_URI,
  mqttBrokerURL: process.env.MQTT_BROKER_URL,
  websocketPort: process.env.WEBSOCKET_PORT || 8080,
}

module.exports = config