import dotenv from 'dotenv';
dotenv.config(); // ✅ Load environment variables

import express from 'express';
import 'dotenv/config';

// ✅ Import Middleware
import logMiddleware from './src/middlewarre/logMiddleware.js';
import errorHandler from './src/middlewarre/errorHandler.js';
import authMiddleware from './src/middlewarre/authMiddleware.js';
import advancedAuth from './src/middlewarre/advancedAuth.js';

// ✅ Import Routes (Use Clients and Workers instead of Users)
import clientsRouter from './src/routes/clients.js';
import tasksRouter from './src/routes/tasks.js';
import workersRouter from './src/routes/workers.js'; 

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
app.use('/api/clients', clientsRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/workers', workersRouter);

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
