import { PrismaClient } from '@prisma/client'; // Import Prisma Client

const prisma = new PrismaClient(); // Initialize Prisma Client

/**
 * Deletes a worker by their ID.
 * @param {string} id - The ID of the worker to delete.
 * @returns {object|null} - The deleted worker object or null if not found.
 */
const deleteWorkerById = async (id) => {
  try {
    // ✅ Check if the worker exists in the database
    const existingWorker = await prisma.worker.findUnique({
      where: { id }, // Look up the worker by ID
    });

    if (!existingWorker) {
      console.warn(`⚠️ Worker with ID ${id} not found.`);
      return null; // Return null if worker does not exist
    }

    // ✅ Delete the worker from the database
    const deletedWorker = await prisma.worker.delete({
      where: { id }, // Specify the worker to delete by ID
    });

    console.log(`✅ Worker with ID ${id} successfully deleted:`, deletedWorker);
    return deletedWorker;
  } catch (error) {
    console.error(`❌ Error deleting worker with ID ${id}:`, error.message);
    throw new Error('Failed to delete worker.');
  }
};

export default deleteWorkerById;
