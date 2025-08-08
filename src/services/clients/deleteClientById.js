import { PrismaClient } from '@prisma/client'; // ⭐ Import Prisma Client

const prisma = new PrismaClient(); // ⭐ Initialize Prisma Client

/**
 * ❌ Deletes a client by their ID, with proper authorization check.
 * 
 * @param {string} id - The ID of the client to delete.
 * @param {object} currentUser - The authenticated user (used for permission check).
 * @returns {object|null} - The deleted client object or null if not found.
 */
const deleteClientById = async (id, currentUser) => {
  try {
    // ⭐ Step 1: Fetch the client by ID
    const existingClient = await prisma.client.findUnique({
      where: { id },
    });

    if (!existingClient) {
      console.warn(`⚠️ Client with ID ${id} not found.`);
      return null;
    }

    // ⭐ Step 2: Authorization check
    const isSelf = currentUser?.id === existingClient.id;
    const isAdmin = currentUser?.isAdmin === true;

    if (!isSelf && !isAdmin) {
      const error = new Error('🚫 You are not authorized to delete this client.');
      error.statusCode = 403;
      throw error;
    }

    // ⭐ Step 3: Delete the client
    const deletedClient = await prisma.client.delete({
      where: { id },
    });

    console.log(`✅ Client with ID ${id} successfully deleted:`, deletedClient);
    return deletedClient;

  } catch (error) {
    console.error(`❌ Error deleting client with ID ${id}:`, error.message);
    throw error;
  }
};

export default deleteClientById;
