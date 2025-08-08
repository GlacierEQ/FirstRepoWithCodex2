import dotenv from 'dotenv'; // The reason we use dotenv in server.js is to load environment variables from a .env file into process.env down below where this is:const port = process.env.PORT || 4000; . This allows us to keep sensitive configurations secure and customizable without hardcoding them directly in our code.
dotenv.config(); // ✅ Load environment variables
/* When dotenv.config() is called:
It reads the .env file.
It loads the variables inside process.env.
You can access them anywhere in your app using process.env.<VARIABLE_NAME>. */

import express from 'express';

// ✅ Import Middleware
import logMiddleware from './src/middleware/logMiddleware.js';
import errorHandler from './src/middleware/errorHandler.js';
//import authMiddleware from './src/middleware/authMiddleware.js';
import advancedAuth from './src/middleware/advancedAuth.js';

// ✅ Import Routes (Use Clients and Workers instead of Users)
import registerRouter from './src/routes/register.js'; // ✅ Import register route
import loginRouter from './src/routes/login.js'; // ✅ Import login route
import clientsRouter from './src/routes/clients.js';
import tasksRouter from './src/routes/tasks.js';
import workersRouter from './src/routes/workers.js';

// ✅ Initialize Express application
const app = express();
/* 
   Express is a lightweight framework that allows us to:
   - Handle HTTP requests (GET, POST, PUT, DELETE)
   - Set up middleware for authentication, logging, security, etc.
   - Create API endpoints for clients and workers
*/

//---------------------------
// Middleware Setup
//---------------------------
app.use(express.json()); // ✅ Parse incoming JSON requests
app.use(logMiddleware); // ✅ Custom logging middleware

//---------------------------
// API Routes
//---------------------------
app.use('/api/register', registerRouter); // ✅ Register register route
app.use('/api/clients', clientsRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/workers', workersRouter);
app.use('/api/login', loginRouter); // ✅ Register login route

//---------------------------
// Entrance Route
//---------------------------
// ---------------------------
// Root Welcome Route
// ---------------------------
app.get('/', (req, res) => {
  res.send('👋 Welcome to MyTasks2Do API!\nVisit /api to see available endpoints.');
});

// ---------------------------
// API Index Route
// ---------------------------
app.get('/api', (req, res) => {
  res.setHeader('Content-Type', 'text/plain'); // ✅ Tell browser to treat this as plain text
  res.send(
    `Here are the available routes:

• /api/login   → Login route
• /api/clients → Clients route
• /api/tasks   → Tasks route
• /api/workers → Workers route`
  );
});

//---------------------------
// Error Handling Middleware
//---------------------------
app.use(errorHandler); // ✅ Attach custom error handler

//---------------------------
// Start Server: ✅ Set the server port
//---------------------------
// ✅ Set the server port (from `.env` or default to 3000)
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
