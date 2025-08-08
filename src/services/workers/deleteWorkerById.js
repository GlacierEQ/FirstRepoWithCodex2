import { PrismaClient } from '@prisma/client'; // ⭐ Import Prisma Client

const prisma = new PrismaClient(); // ⭐ Initialize Prisma Client

/**
 * 🛠 Deletes a worker by their ID with proper authorization check.
 *
 * @param {string} id - The ID of the worker to delete.
 * @param {object} currentUser - The user making the request (for auth check).
 * @returns {object|null} - The deleted worker object or null if not found.
 */
const deleteWorkerById = async (id, currentUser) => {
  try {
    // ⭐ Check if the worker exists
    const existingWorker = await prisma.worker.findUnique({
      where: { id },
    });

    if (!existingWorker) {
      console.warn(`⚠️ Worker with ID ${id} not found.`);
      return null;
    }

    // ⭐ Authorization check
    const isSelf = currentUser?.id === existingWorker.id;
    const isAdmin = currentUser?.isAdmin === true;

    if (!isSelf && !isAdmin) {
      const error = new Error('🚫 You are not authorized to delete this worker.');
      error.statusCode = 403;
      throw error;
    }

    // ⭐ Proceed with deletion
    const deletedWorker = await prisma.worker.delete({
      where: { id },
    });

    console.log(`✅ Worker with ID ${id} successfully deleted:`, deletedWorker);
    return deletedWorker;

  } catch (error) {
    console.error(`❌ Error deleting worker with ID ${id}:`, error.message);
    throw error;
  }
};

export default deleteWorkerById;
