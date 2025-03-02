// ✅ Function to retrieve a client by their ID
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Retrieves a client from the database by their unique ID.
 *
 * How This Works:
 * - The `findUnique` method queries the Client table for a specific record based on the provided ID.
 * - The `where` clause ensures that only the client with the matching ID is returned.
 * - If no matching client is found, `findUnique` returns `null`.
 *
 * @param {string} id - The unique identifier of the client.
 * @throws {Error} If fetching the client fails.
 */
const getClientById = async (id) => {
  try {
    // ✅ Fetch client using Prisma
    const client = await prisma.client.findUnique({
      where: { id }, // Match the ID field in the Client table
    });

    // ✅ Log if client is not found
    if (!client) {
      console.warn(`⚠️ Client with ID ${id} not found.`);
    }

    return client; // ✅ Return client object or null if not found
  } catch (error) {
    console.error('❌ Error fetching client by ID:', error.message);
    throw new Error('Failed to fetch the client by ID.');
  }
};

export default getClientById;

