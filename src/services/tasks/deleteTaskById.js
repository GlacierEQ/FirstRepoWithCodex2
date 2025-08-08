import { PrismaClient } from '@prisma/client'; // ⭐ Import the Prisma Client

const prisma = new PrismaClient(); // ⭐ Initialize Prisma Client

/**
 * 🛠 Function to update an existing task by its ID.
 * 
 * ⭐ NOW INCLUDES:
 * - Authorization: only the task owner or an admin can update the task.
 * - Field validation to prevent unwanted changes.
 *
 * @param {string} id - The ID of the task to update.
 * @param {object} updatedFields - Fields sent by the user to update.
 * @param {object} currentUser - The user making the request (used for auth check).
 * @returns {object|null} - The updated task object or null if not found.
 */
const updateTaskById = async (id, updatedFields, currentUser) => {
  try {
    // ⭐ Step 1: Fetch the task (and owner info)
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        client: { select: { id: true, name: true } }, // ⭐ Needed for ownership check
        worker: { select: { name: true, email: true } },
      },
    });

    if (!task) {
      console.warn(`⚠️ Task with ID ${id} not found.`);
      return null;
    }

    // ⭐ Step 2: Authorization check
    const isTaskOwner = currentUser?.id === task.client.id;
    const isAdmin = currentUser?.isAdmin === true;

    if (!isTaskOwner && !isAdmin) {
      const error = new Error('🚫 You are not authorized to update this task.');
      error.statusCode = 403; // ⭐ Forbidden
      throw error;
    }

    // ⭐ Step 3: Filter allowed fields
    const allowedFields = ['title', 'description', 'category', 'status', 'price', 'dueDate', 'workerId'];
    const filteredFields = Object.keys(updatedFields)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updatedFields[key];
        return obj;
      }, {});

    if (Object.keys(filteredFields).length === 0) {
      throw new Error('No valid fields provided for update.');
    }

    // ⭐ Step 4: Perform the update
    const updatedTask = await prisma.task.update({
      where: { id },
      data: filteredFields,
      include: {
        client: { select: { name: true, email: true } },
        worker: { select: { name: true, email: true } },
      },
    });

    console.log('✅ Task successfully updated:', updatedTask);
    return updatedTask;

  } catch (error) {
    if (error.code === 'P2025') {
      console.warn(`⚠️ Task with ID ${id} not found.`);
      return null;
    }
    console.error('❌ Error updating task:', error.message);
    throw error;
  }
};

export default updateTaskById;
