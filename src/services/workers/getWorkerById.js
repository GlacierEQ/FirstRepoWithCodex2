// ✅ Function to retrieve a worker by their ID
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Retrieves a worker from the database by their unique ID.
 *
 * How This Works:
 * - The `findUnique` method queries the Worker table for a specific record based on the provided ID.
 * - The `where` clause ensures that only the worker with the matching ID is returned.
 * - If no matching worker is found, `findUnique` returns `null`.
 *
 * @param {string} id - The unique identifier of the worker.
 * @throws {Error} If fetching the worker fails.
 */
const getWorkerById = async (id) => {
  try {
    // ✅ Fetch worker using Prisma
    const worker = await prisma.worker.findUnique({
      where: { id }, // Match the ID field in the Worker table
    });

    // ✅ Log if worker is not found
    if (!worker) {
      console.warn(`⚠️ Worker with ID ${id} not found.`);
    }

    return worker; // ✅ Return worker object or null if not found
  } catch (error) {
    console.error('❌ Error fetching worker by ID:', error.message);
    throw new Error('Failed to fetch the worker by ID.');
  }
};

export default getWorkerById;
