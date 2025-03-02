import { PrismaClient } from '@prisma/client'; // Import Prisma Client

const prisma = new PrismaClient(); // Initialize Prisma Client

/**
 * Retrieves all workers from the database with optional filters.
 *
 * @param {Object} filters - Optional query filters (username, email).
 * @returns {Promise<Array>} - A list of workers.
 */
const getWorkers = async (filters) => {
  try {
    // ✅ Destructure filters for clarity
    const { username, email } = filters;

    // ✅ Fetch workers with applied conditional filters (only fetch users with role: "worker")
    const workers = await prisma.worker.findMany({
      where: {
        // ✅ Applied Conditional Filters
        ...(username && { username }), // Filter by username if provided
        ...(email && { email }), // Filter by email if provided
      },
    });

    console.log('Fetched workers:', workers); // ✅ Debug log for verification
    return workers; // ✅ Return the list of filtered workers
  } catch (error) {
    console.error('❌ Error fetching workers:', error.message);
    throw new Error('Failed to fetch workers.');
  }
};

export default getWorkers;

/* 
// ✅ Function to retrieve all workers
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


 * Retrieves all workers from the database.
 *
 * How This Works:
 * - Prisma's `findMany` method queries all workers in the `Worker` table.
 * - The returned data includes all fields from the Worker model in the database.
 * - Filters are optional; if no filters are passed, all workers are returned.
 * - Efficient database querying avoids manual file imports or in-memory operations.
 *
 * throws Error if fetching workers from the database fails.

const getWorkers = async () => {
  try {
    //  Use Prisma's findMany method to fetch all workers
    const workers = await prisma.worker.findMany(); // Retrieves all worker records from the database

    console.log('Fetched workers:', workers); // Debug log for verification
    return workers; // Return the array of workers
  } catch (error) {
    console.error(' Error fetching workers from database:', error.message); //  Log detailed error
    throw new Error('Failed to fetch workers.'); // Throw error for upstream handling
  }
};

export default getWorkers;

 */
