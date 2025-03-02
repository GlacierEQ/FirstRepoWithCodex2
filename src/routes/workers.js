import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import NotFoundError from '../errors/NotFoundError.js';

// ✅ Import worker services
import getWorkers from '../services/workers/getWorkers.js';
import getWorkerById from '../services/workers/getWorkerById.js';
import createWorker from '../services/workers/createWorker.js';
import updateWorkerById from '../services/workers/updateWorkerById.js';
import deleteWorkerById from '../services/workers/deleteWorkerById.js';

const workersRouter = express.Router();

/**
 * @route GET /workers
 * @desc Fetch all workers with optional filters
 */
workersRouter.get('/', async (req, res, next) => {
  try {
    const { username, email } = req.query;
    const workers = await getWorkers({ username, email });
    res.status(200).json(workers);
  } catch (error) {
    console.error('❌ Error fetching workers:', error.message);
    next(error);
  }
});

/**
 * @route GET /workers/:id
 * @desc Fetch a worker by ID
 */
workersRouter.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const worker = await getWorkerById(id);

    if (!worker) throw new NotFoundError('Worker', id);

    res.status(200).json(worker);
  } catch (error) {
    console.error('❌ Error fetching worker by ID:', error.message);
    next(error);
  }
});

/**
 * @route POST /workers
 * @desc Create a new worker
 */
workersRouter.post('/', async (req, res, next) => {
  try {
    console.log('📥 Incoming request body:', req.body);

    const { username, password, name, email, phoneNumber, profilePicture, skills, experienceYears, experienceMonths } = req.body;

    const newWorker = await createWorker(username, name, password, email, phoneNumber, profilePicture, skills, experienceYears, experienceMonths);

    res.status(201).json({
      message: '✅ Worker created successfully!',
      worker: newWorker,
    });
  } catch (error) {
    console.error('❌ Error creating worker:', error.message);
    next(error);
  }
});

/**
 * @route PATCH /workers/:id
 * @desc Update a worker by ID
 */
workersRouter.patch('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedFields = req.body;

    const updatedWorker = await updateWorkerById(id, updatedFields);

    if (!updatedWorker) throw new NotFoundError('Worker', id);

    res.status(200).json({
      message: `✅ Worker with ID ${id} successfully updated`,
      worker: updatedWorker,
    });
  } catch (error) {
    console.error('❌ Error updating worker:', error.message);
    next(error);
  }
});

/**
 * @route DELETE /workers/:id
 * @desc Delete a worker by ID
 */
workersRouter.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedWorker = await deleteWorkerById(id);

    if (!deletedWorker) throw new NotFoundError('Worker', id);

    res.status(200).json({
      message: `✅ Worker with ID ${id} successfully deleted`,
      worker: deletedWorker,
    });
  } catch (error) {
    console.error('❌ Error deleting worker:', error.message);
    next(error);
  }
});

export default workersRouter;
