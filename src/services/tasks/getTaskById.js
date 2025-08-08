import { PrismaClient } from '@prisma/client'; // Import the Prisma Client

const prisma = new PrismaClient(); // Initialize the Prisma Client

/**
 * Function to get a task by its unique ID from the database.
 *
 * How This Works:
 * - The function uses Prisma's `findUnique` method to query the database for a specific task.
 * - Relationships (`client` and `worker`) are included to fetch associated data for convenience.
 * - If no task is found with the given ID, the function returns `null`.
 */
/**
 * Function to get a task by its unique ID from the database.
 */
const getTaskById = async (id) => {
  try {     // Use Prisma to find the task by its unique ID
    const task = await prisma.task.findUnique({
      where: { id },// Match the task's ID to the one provided in the argument
      include: {
        client: {
          select: { name: true, email: true }, // ✅ Show client's name and email
        },
        worker: {
          select: { name: true, email: true }, // ✅ Show worker's name
        },
      },
    });

    return task;
  } catch (error) {
    console.error('❌ Error fetching task by ID:', error.message);
    throw error;
  }
};

export default getTaskById;
