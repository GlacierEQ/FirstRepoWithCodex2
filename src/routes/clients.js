import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import NotFoundError from '../errors/NotFoundError.js';

// ✅ Import client services
import getClients from '../services/clients/getClients.js';
import getClientById from '../services/clients/getClientById.js';
import createClient from '../services/clients/createClient.js';
import updateClientById from '../services/clients/updateClientById.js';
import deleteClientById from '../services/clients/deleteClientById.js';

const clientsRouter = express.Router();

/**
 * @route GET /clients
 * @desc Fetch all clients with optional filters
 */
clientsRouter.get('/', async (req, res, next) => {
  try {
    const { username, email } = req.query;
    const clients = await getClients({ username, email });
    res.status(200).json(clients);
  } catch (error) {
    console.error('❌ Error fetching clients:', error.message);
    next(error);
  }
});

/**
 * @route GET /clients/:id
 * @desc Fetch a client by ID
 */
clientsRouter.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const client = await getClientById(id);

    if (!client) throw new NotFoundError('Client', id);

    res.status(200).json(client);
  } catch (error) {
    console.error('❌ Error fetching client by ID:', error.message);
    next(error);
  }
});

/**
 * @route POST /clients
 * @desc Create a new client
 */
clientsRouter.post('/', async (req, res, next) => {
  try {
    console.log('📥 Incoming request body:', req.body);

    const { username, password, name, email, phoneNumber } = req.body;

    const newClient = await createClient(username, name, password, email, phoneNumber);

    res.status(201).json({
      message: '✅ Client created successfully!',
      client: newClient,
    });
  } catch (error) {
    console.error('❌ Error creating client:', error.message);
    next(error);
  }
});

/**
 * @route PATCH /clients/:id
 * @desc Update a client by ID
 */
clientsRouter.patch('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedFields = req.body;

    const updatedClient = await updateClientById(id, updatedFields);

    if (!updatedClient) throw new NotFoundError('Client', id);

    res.status(200).json({
      message: `✅ Client with ID ${id} successfully updated`,
      client: updatedClient,
    });
  } catch (error) {
    console.error('❌ Error updating client:', error.message);
    next(error);
  }
});

/**
 * @route DELETE /clients/:id
 * @desc Delete a client by ID
 */
clientsRouter.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedClient = await deleteClientById(id);

    if (!deletedClient) throw new NotFoundError('Client', id);

    res.status(200).json({
      message: `✅ Client with ID ${id} successfully deleted`,
      client: deletedClient,
    });
  } catch (error) {
    console.error('❌ Error deleting client:', error.message);
    next(error);
  }
});

export default clientsRouter;
