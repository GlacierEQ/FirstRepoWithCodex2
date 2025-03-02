import { PrismaClient } from '@prisma/client'; // Import Prisma Client

const prisma = new PrismaClient(); // Initialize Prisma Client

/**
 * Deletes a client by their ID.
 * @param {string} id - The ID of the client to delete.
 * @returns {object|null} - The deleted client object or null if not found.
 */
const deleteClientById = async (id) => {
  try {
    // ✅ Check if the client exists in the database
    const existingClient = await prisma.client.findUnique({
      where: { id }, // Look up the client by ID
    });

    if (!existingClient) {
      console.warn(`⚠️ Client with ID ${id} not found.`);
      return null; // Return null if client does not exist
    }

    // ✅ Delete the client from the database
    const deletedClient = await prisma.client.delete({
      where: { id }, // Specify the client to delete by ID
    });

    console.log(`✅ Client with ID ${id} successfully deleted:`, deletedClient);
    return deletedClient;
  } catch (error) {
    console.error(`❌ Error deleting client with ID ${id}:`, error.message);
    throw new Error('Failed to delete client.');
  }
};

export default deleteClientById;
