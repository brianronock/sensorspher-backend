/********************************************************************************************************
    src/config/config.js
            This file stores the configuration settings for different environments.
** Variables:
- `dotenv`: A package used to load environment variables from a `.env` file into `process.env`.
- `config`: An object that holds environment variables like the port number, MongoDB URI, 
            JWT secret, MQTT Broker URL, and WebSocket port.
** Functions: 
- `dotenv.config()`: This function loads the environment variables from the `.env` file into
                     `process.env`, making them accessible throughout the app
                
********************************************************************************************************/

const dotenv = require('dotenv')

// Load environment variables from .env file
dotenv.config()

// Configuration object
const config = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET,
  mongoURI: process.env.MONGODB_URI,
  //mongoURI: process.env.LOCAL_MONGODB_URI,
  mqttBrokerURL: process.env.MQTT_BROKER_URL,
  websocketPort: process.env.WEBSOCKET_PORT || 8080,
}

module.exports = config