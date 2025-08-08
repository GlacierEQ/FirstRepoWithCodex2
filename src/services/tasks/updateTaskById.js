import { PrismaClient } from '@prisma/client'; // Import the Prisma Client

const prisma = new PrismaClient(); // Initialize the Prisma Client

/**
 * Function to update an existing task by its ID in the database.
 *
 * How This Works:
 * - The function accepts the `id` of the task to be updated and the new fields (`updatedFields`).
 * - Prisma's `update` method is used to modify the task's details directly in the database.
 * - If the task does not exist, Prisma throws an error, which we handle.
 * - Updated fields are passed as a dynamic object, ensuring flexibility and clean updates.
 * 
 * id 🔑 → comes from the URL parameter, like /tasks/:id

updatedFields ✍️ → comes from the request body (req.body)
 */
const updateTaskById = async (id, updatedFields) => {
  try {
    // 🚩 Define allowed fields for updating
    const allowedFields = ['title', 'description', 'category', 'status', 'price', 'dueDate','workerId'];

    // 🚩 Filter out any invalid fields before updating
    const filteredFields = Object.keys(updatedFields)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updatedFields[key];
        return obj;
      }, {});

    // 🚩 If no valid fields are provided, return an error
    if (Object.keys(filteredFields).length === 0) {
      throw new Error('No valid fields provided for update.');
    }

    // 🚩 Update the task with only valid fields
    const updatedTask = await prisma.task.update({
      where: { id },
      data: filteredFields,
      include: {
        client: { select: { name: true, email: true } },
        worker: { select: { name: true, email: true  } },
      },
    });

    console.log('✅ Task successfully updated:', updatedTask);
    return updatedTask;
  } catch (error) {
    if (error.code === 'P2025') {
      console.warn(`⚠️ Task with ID ${id} not found.`);
      return null;
    }
    console.error('❌ Error updating booking:', error.message);
    throw new Error('Failed to update task.');
  }
};

export default updateTaskById;