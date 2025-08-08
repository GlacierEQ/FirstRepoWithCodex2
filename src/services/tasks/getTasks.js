import { PrismaClient } from '@prisma/client'; // Import Prisma Client

const prisma = new PrismaClient(); // Initialize Prisma Client

/*
 * Function to get a task by its unique ID from the database.
 *
 * How This Works:
 * - The function uses Prisma's `findMany` method to query the database for a specific task.
 * - Relationships (`client` and `worker`) are included to fetch associated data for convenience.
 *
 */

// Function to fetch all bookings from the database with optional filters
//The following line just means: “When someone calls me and gives me a filters object, I’ll use it like this.The file getTasks.js does not "know" about the filters object until it’s passed in when the function is called from somewhere else — like the route.>>>>const filters = req.query;

const getTasks = async (filters) => {
  try {
    // Destructure filters for clarity
    const { clientId, id, status } = filters;
    // Fetch bookings with applied conditional filters ✅
    const tasks = await prisma.task.findMany({
      where: {
        // ✅ Applied Conditional Filters
        ...(clientId && { clientId }), // Filter by user ID: "Only add the clientId filter to the query if clientId exists."
        /* This line is using  short-circuiting with the spread operator.
        If clientId exists (i.e., is truthy), then return { clientId: clientId }
        If clientId is undefined or null (falsy), return false
        If you use ...{ clientId }, it adds clientId to the where object.
        */
        ...(id && { id }), // Filter by task ID
        ...(status && { status }), // Filter by task status
      },
      include: {
        client: {
          select: {
            name: true,
            email: true,
          },
        },
        worker: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
    // Return the list of filtered bookings
    return tasks;
  } catch (error) {
    console.error('Error fetching tasks:', error.message);
    throw new Error('Failed to fetch tasks.');
  }
};
export default getTasks;
