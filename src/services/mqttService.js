/***********************************************************
    src/services/mqttService.js
                This service handles communication with
                the MQTT broker for real-time sensor data.
***********************************************************/

const mqtt = require('mqtt')
const client = mqtt.connect(process.env.MQTT_BROKER_URL)

client.on('connect', () => {
  console.log('Connected to MQTT broker')
})

const publishData = (topic, message) => {
  client.publish(topic, message, () => {
    console.log(`Message sent to topic ${topic}`)
  })
}

const subscribeToTopic = (topic) => {
  client.subscribe(topic, () => {
    console.log(`Subscribed to topic ${topic}`)
  })
}

client.on('message', (topic, message) => {
  console.log(`Received message from ${topic}: ${message}`)
})

module.exports = { publishData, subscribeToTopic }