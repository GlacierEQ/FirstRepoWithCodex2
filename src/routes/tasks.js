import express from 'express';
import getTasks from '../services/tasks/getTasks.js';
import updateTaskById from '../services/tasks/updateTaskById.js';
import deleteTaskById from '../services/tasks/deleteTaskById.js'; // ✅ You forgot to import this!
import createTask from '../services/tasks/createTask.js'; // ✅ Optional: if you want to support POST
import advancedAuth from '../middleware/advancedAuth.js'; // ⭐ Import the auth middleware

const tasksRouter = express.Router(); // ✅ Create a router for tasks

/* 
==============================
🔍 GET /tasks
Fetch all tasks (optionally filtered by clientId, status, etc.)
==============================
Example: /tasks?clientId=abc123&status=completed
This becomes: { clientId: 'abc123', status: 'completed' }
*/
tasksRouter.get('/', async (req, res, next) => {
  try {
    const filters = req.query;
    const tasks = await getTasks(filters);
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error.message);
    next(error);
  }
});

/* 
==============================
➕ POST /tasks
Create a new task
==============================
OPTIONAL: Only include if createTask is ready.
*/
tasksRouter.post('/', advancedAuth, async (req, res, next) => {
  try {
    const { title, description, clientEmail, workerEmail, category, status, price, dueDate } = req.body;
    const newTask = await createTask(title, description, clientEmail, workerEmail, category, status, price, dueDate);
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error.message);
    next(error);
  }
});

/* 
==============================
📝 PATCH /tasks/:id
Update a specific task
==============================
The `id` comes from the URL. The new fields come from the body.
*/
tasksRouter.patch('/:id', advancedAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedFields = req.body;
    const updatedTask = await updateTaskById(id, updatedFields);

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error.message);
    next(error);
  }
});

/* 
==============================
❌ DELETE /tasks/:id
Remove a task by ID
==============================
*/
tasksRouter.delete('/:id', advancedAuth, async (req, res, next) => {
  try {
    const { id } = req.params;

    // ⭐ Extract client ID from authenticated user
    //  Auth0 uses `req.auth.payload.sub` as the unique user ID (called "sub")
//    This ID should match the `auth0Id` in your database.

    const requestingClientId = req.auth?.payload?.sub;//👉 This sub is the unique user ID from Auth0 (typically used as auth0Id in your DB before it was like this: const requestingClientId = req.user.id;>>>> the middleware should populate req.auth, not req.user.



    // ⭐ Pass it into deleteTaskById for authorization check
    const deletedTask = await deleteTaskById(id, requestingClientId);

    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully', deletedTask });
  } catch (error) {
    // ⭐ Respond with 403 if unauthorized
    if (error.statusCode === 403) {
      return res.status(403).json({ message: error.message });
    }

    console.error('Error deleting task:', error.message);
    next(error);
  }
});

export default tasksRouter;
