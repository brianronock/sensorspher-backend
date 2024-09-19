/***********************************************************
    src/server.js
                This file starts the Express app, 
                and listens for incoming requests

***********************************************************/

const connectDB = require('./config/db')
const app = require('./app')

// Connect to MongoDB
connectDB()

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});