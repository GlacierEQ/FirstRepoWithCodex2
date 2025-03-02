import { PrismaClient } from '@prisma/client'; // Import Prisma Client

const prisma = new PrismaClient(); // Initialize Prisma Client

/**
 * Retrieves all clients from the database with optional filters.
 *
 * @param {Object} filters - Optional query filters (username, email).
 * @returns {Promise<Array>} - A list of clients.
 */
const getClients = async (filters) => {
  try {
    // ✅ Destructure filters for clarity
    const { username, email } = filters;

    // ✅ Fetch clients with applied conditional filters (only fetch users with role: "client")
    const clients = await prisma.client.findMany({
      where: {
        // ✅ Applied Conditional Filters
        ...(username && { username }), // Filter by username if provided
        ...(email && { email }), // Filter by email if provided
      },
    });

    console.log('Fetched clients:', clients); // ✅ Debug log for verification
    return clients; // ✅ Return the list of filtered clients
  } catch (error) {
    console.error('❌ Error fetching clients:', error.message);
    throw new Error('Failed to fetch clients.');
  }
};

export default getClients;

/* 
// ✅ Function to retrieve all clients
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


 * Retrieves all clients from the database.
 *
 * How This Works:
 * - Prisma's `findMany` method queries all clients in the `Client` table.
 * - The returned data includes all fields from the Client model in the database.
 * - Filters are optional; if no filters are passed, all clients are returned.
 * - Efficient database querying avoids manual file imports or in-memory operations.
 *
 * throws Error if fetching clients from the database fails.

const getClients = async () => {
  try {
    //  Use Prisma's findMany method to fetch all clients
    const clients = await prisma.client.findMany(); // Retrieves all client records from the database

    console.log('Fetched clients:', clients); // Debug log for verification
    return clients; // Return the array of clients
  } catch (error) {
    console.error(' Error fetching clients from database:', error.message); // Log detailed error
    throw new Error('Failed to fetch clients.'); //  Throw error for upstream handling
  }
};

export default getClients; 
*/
