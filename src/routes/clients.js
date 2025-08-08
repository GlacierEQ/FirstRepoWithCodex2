import express from 'express';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient(); // 🚩 Required to query DB inside this route

import authMiddleware from '../middleware/advancedAuth.js'; // ✅ Import Auth0 Middleware
import NotFoundError from '../errors/NotFoundError.js';

// ✅ Import client services
import getClients from '../services/clients/getClients.js';
import getClientById from '../services/clients/getClientById.js';
import createClient from '../services/clients/createClient.js';
import updateClientById from '../services/clients/updateClientById.js';
import deleteClientById from '../services/clients/deleteClientById.js';

const clientsRouter = express.Router();

//////////////////////////////////////////////////////////
/**
 * @route GET /clients
 * @desc Fetch all clients with optional filters (username, email)
 * @public ✅ No authentication required
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

//////////////////////////////////////////////////////////
/**
 * @route GET /clients/:id
 * @desc Fetch a client by ID
 * @public ✅ No authentication required
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

//////////////////////////////////////////////////
/**
 * @route POST /clients
 * @desc Create a new client (User Registration)
 * @protected 🔒 Now protected: logged-in users cannot create new accounts!
 */
clientsRouter.post('/', authMiddleware, async (req, res, next) => {
  try {
    const userSub = req.auth.payload.sub;
    const currentUser = await prisma.client.findUnique({ where: { auth0Id: userSub } });

    if (!currentUser?.isAdmin) {
      /* if currentUser exists, and if it does, then check if they have admin rights ( their role is admin).
      The expression if (!currentUser?.isAdmin) is using optional chaining (?.) and means:
If currentUser doesn't exist or currentUser.isAdmin property'value is false, then block them from creating new clients
!currentUser >>>> If there is no current user (currentUser is null or undefined)
?. >>>>> is like the OR but this is used to safely check if the property isAdmin has a value or not so it doesnt crash the system if the value is false by returning undefined instead of crashing
isAdmin >>>>> or  the user exists but is not an admin (isAdmin === false)
→ Then block access. If the user has admin right keep going with the code below >>>>>>

Is like this: 

if (
  currentUser === null ||
  currentUser === undefined ||
  currentUser.isAdmin === false
)

*/
      return res.status(403).json({ message: '❌ Only admins can create new client accounts!' });
    }

    const newClient = await createClient(req.body);
    res.status(201).json(newClient);
  } catch (error) {
    console.error('❌ Error creating client:', error.message);
    next(error);
  }
});

////////////////////////////////////////////////////
/**
 * @route PATCH /clients/:id
 * @desc Update a client by ID
 * @protected 🔒 Requires authentication & ownership check (or admin rights)
 */
clientsRouter.patch('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params; // 🚩 Target client ID
    const userSub = req.auth.payload.sub; // 🔐 Authenticated user's Auth0 ID (sub)

    console.log(`🔑 Authenticated User (sub): ${userSub}, Attempting Update for Client ID: ${id}`);

    const currentUser = await prisma.client.findUnique({ where: { auth0Id: userSub } });
    const targetClient = await prisma.client.findUnique({ where: { id } }); // 🟢 Fetch target client

    if (!currentUser) {
      return res.status(403).json({ message: '❌ Unauthorized: No client profile found!' });
    }

    if (!targetClient) {
      return res.status(404).json({ message: '❌ Target client not found!' });
    }

    if (!currentUser.isAdmin && currentUser.id !== targetClient.id) {
      //"If the currently logged-in user is NOT an Admin ❌ AND the ID of the user trying to do the action is different ❌ from the ID of the client profile they are trying to update or delete, then block them (they are NOT allowed)."
      return res
        .status(403)
        .json({ message: '❌ Unauthorized: You can only update your own profile unless you are an Admin!' });
    }

    const updatedFields = req.body;
    const updatedClient = await updateClientById(id, updatedFields);

    res.status(200).json({
      message: `✅ Client with ID ${id} successfully updated`,
      client: updatedClient,
    });
  } catch (error) {
    console.error('❌ Error updating client:', error.message);
    next(error);
  }
});

////////////////////////////////////////////////////
/**
 * @route DELETE /clients/:id
 * @desc Delete a client by ID
 * @protected 🔒 Requires authentication & ownership check (or admin rights)
 */
clientsRouter.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params; // 🚩 Target client ID
    const userSub = req.auth.payload.sub; // 🔐 Authenticated user's Auth0 ID (sub)

    console.log(`🔑 Authenticated User (sub): ${userSub}, Attempting Deletion for Client ID: ${id}`);

    const currentUser = await prisma.client.findUnique({ where: { auth0Id: userSub } });
    const targetClient = await prisma.client.findUnique({ where: { id } }); // 🟢 Fetch target client

    if (!currentUser) {
      return res.status(403).json({ message: '❌ Unauthorized: No client profile found!' });
    }

    if (!targetClient) {
      return res.status(404).json({ message: '❌ Target client not found!' });
    }

    if (!currentUser.isAdmin && currentUser.id !== targetClient.id) {
      return res
        .status(403)
        .json({ message: '❌ Unauthorized: You can only delete your own profile unless you are an Admin!' });
    }

    const deletedClient = await deleteClientById(id);

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
