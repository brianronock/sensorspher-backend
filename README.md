# SensoSphere Backend

This is the backend of the **SensoSphere** project, built using **Node.js** and **Express**, and it will handle API requests, manage user authentication, and handle sensor data integration. This checklist will guide you through the development process step-by-step.

## Project Setup

### ✔️ GitHub Setup
- [x] Create a repository on GitHub for the backend (`SensoSphere-Backend`)
- [x] Initialize Git in your local folder
- [x] Link your local folder to the GitHub repository
- [x] Create a `README.md` file
- [x] Make an initial commit and push the code to GitHub

---

## Development Checklist

### 1. **Project Structure Setup**
- [x] Create a `src/` folder to store your backend code
- [x] Create the following subfolders in `src/`:
  - [x] `config/` (for configuration files)
  - [x] `controllers/` (for route handlers)
  - [x] `models/` (for MongoDB models)
  - [x] `routes/` (for API route definitions)
  - [x] `middleware/` (for authentication and other middleware)
  - [x] `services/` (for external services like WebSocket or MQTT)
  - [x] `utils/` (for helper functions)
- [x] Set up `server.js` as the entry point of the application

---

### 3. **Package Installation**
- [x] Install essential packages:
  - [x] `express` (for the backend framework)
  - [x] `mongoose` (for MongoDB integration)
  - [x] `jsonwebtoken` (for JWT authentication)
  - [x] `bcryptjs` (for password hashing)
  - [x] `cors` (to handle cross-origin requests)
  ```bash
  npm install express mongoose jsonwebtoken bcryptjs cors
  ```

---

### 4. **Environment Configuration**
- [x] Create a `.env` file for environment variables (e.g., MongoDB URI, JWT secret)
- [x] Install the `dotenv` package:
  ```bash
  npm install dotenv
  ```
- [ ] Configure **MongoDB connection** in `src/config/db.js`

---

### 5. **User Authentication**
- [ ] Set up the **User model** in `src/models/User.js` to handle user data (e.g., name, email, password)
- [ ] Implement **register** and **login** controllers in `src/controllers/authController.js`:
  - [ ] `registerUser()` to create new users
  - [ ] `loginUser()` to authenticate users and return a JWT token
- [ ] Set up routes for authentication in `src/routes/authRoutes.js`:
  - [ ] User registration (`/api/auth/register`)
  - [ ] User login (`/api/auth/login`)
  - [ ] User profile retrieval (`/api/auth/profile`)
- [ ] Implement **JWT authentication middleware** in `src/middleware/authMiddleware.js` to protect routes
- [ ] Test the authentication routes using **Postman** or a similar tool

---

### 6. **API Routes**
- [ ] Set up basic API routes:
  - [ ] Create `src/routes/authRoutes.js` for authentication
  - [ ] Create `src/routes/sensorRoutes.js` for managing sensor data
  - [ ] Create `src/routes/feedRoutes.js` for handling live feed posts and comments
- [ ] Implement route handlers in the respective controllers (`authController.js`, `sensorController.js`, `feedController.js`)
- [ ] Test API endpoints using Postman to ensure they work as expected

---

### 7. **Sensor Data Integration**
- [ ] Set up the **Sensor model** in `src/models/Sensor.js` to store sensor information
- [ ] Implement **CRUD operations** for sensor data in `src/controllers/sensorController.js`:
  - [ ] Create sensor data
  - [ ] Read sensor data
  - [ ] Update sensor data
  - [ ] Delete sensor data
- [ ] Set up routes for sensor data in `src/routes/sensorRoutes.js`
- [ ] Integrate MQTT for real-time sensor data streaming in `src/services/mqttService.js`
- [ ] Test sensor data endpoints using Postman

---

### 8. **Real-time Features**
- [ ] Set up **WebSocket** integration for real-time updates in `src/services/websocketService.js`
  - [ ] Implement WebSocket connections for sending real-time sensor data
  - [ ] Send real-time notifications to the frontend for new sensor data or alerts
- [ ] Integrate WebSocket functionality with existing routes
- [ ] Test WebSocket connections using WebSocket tools (e.g., `wscat` or an online WebSocket tester)

---

### 9. **Error Handling**
- [ ] Implement global error handling middleware in `src/middleware/errorHandler.js`:
  - [ ] Catch common errors such as missing fields, invalid inputs, or authentication failures
  - [ ] Return user-friendly error messages from the API
  - [ ] Test error handling by sending invalid requests and ensuring proper error responses

---

### 10. **Deployment Preparation**
- [ ] Add a `.gitignore` file to ignore unnecessary files such as `node_modules/` and `.env`:
  ```bash
  # Node modules
  node_modules/
  
  # Environment variables
  .env

  # Logs
  logs/
  *.log
  ```
- [ ] Ensure that all code is committed and pushed to GitHub:
  ```bash
  git add .
  git commit -m "Prepare for deployment"
  git push
  ```

---

## Deployment Checklist

- [ ] Clean up the project by removing unused files or code
- [ ] Prepare a production environment for deployment (e.g., on Heroku, AWS, or another platform)
- [ ] Ensure environment variables are properly configured for production (e.g., MongoDB URI, JWT secret)
- [ ] Deploy the backend and test it in a live environment

---

## Technologies Used

- **Node.js**: JavaScript runtime for building the backend.
- **Express**: Web framework for building APIs.
- **MongoDB**: NoSQL database for storing sensor and user data.
- **Mongoose**: ODM for MongoDB.
- **JWT**: For user authentication.
- **BcryptJS**: For password hashing.
- **WebSockets**: For real-time updates.
- **MQTT**: For handling sensor data communication.

---

## How to Run the Project

1. Clone the repository:
   ```bash
   git clone git@github.com:brianronock/sensorspher-backend.git
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Set up the `.env` file with your configuration:
   ```
   MONGODB_URI=<your_mongodb_uri>
   JWT_SECRET=<your_jwt_secret>
   MQTT_BROKER_URL=<your_mqtt_broker_url>
   ```

4. Run the project:
   ```bash
   npm start
   ```

---
