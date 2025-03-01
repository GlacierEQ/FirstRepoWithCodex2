import dotenv from 'dotenv';
dotenv.config(); // ✅ Load environment variables

import express from 'express';
import 'dotenv/config';

// ✅ Import Middleware (Make sure folder name matches exactly!)
import logMiddleware from './src/middlewarre/logMiddleware.js';
import errorHandler from './src/middlewarre/errorHandler.js';
import authMiddleware from './src/middlewarre/authMiddleware.js';
import advancedAuth from './src/middlewarre/advancedAuth.js';

// ✅ Import Routes (Corrected path based on `routes/` inside `src/`)
import usersRouter from './src/routes/users.js';
import tasksRouter from './src/routes/tasks.js';

const app = express();

//---------------------------
// Middleware Setup
//---------------------------
app.use(express.json()); // ✅ Parse incoming JSON requests
app.use(logMiddleware); // ✅ Custom logging middleware
app.use(authMiddleware); // ✅ Authentication middleware

//---------------------------
// Routes
//---------------------------
app.use('/users', usersRouter);
app.use('/tasks', tasksRouter);

//---------------------------
// Test Route
//---------------------------
app.get('/', (req, res) => {
  res.send('Welcome to MyTasks2Do API!');
});

//---------------------------
// Error Handling Middleware
//---------------------------
app.use(errorHandler); // ✅ Attach custom error handler

//---------------------------
// Start Server
//---------------------------
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
