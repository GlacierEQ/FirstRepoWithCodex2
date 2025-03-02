import { PrismaClient } from '@prisma/client'; // Import Prisma Client

const prisma = new PrismaClient(); // Initialize Prisma Client

/**
 * Updates a worker by their ID.
 * @param {string} id - The ID of the worker to update.
 * @param {object} updatedFields - The fields to update (e.g., { name: "New Name" }).
 * @returns {object|null} - The updated worker object or null if not found.
 */
const updateWorkerById = async (id, updatedFields) => {
  try {
    // ✅ Define allowed fields to update for workers
    const allowedFields = [
      "username",
      "name",
      "password",
      "email",
      "phoneNumber",
      "profilePicture",
      "skills",
      "experienceYears",
      "experienceMonths"
    ];
    
    const filteredFields = Object.keys(updatedFields)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updatedFields[key];
        return obj;
      }, {});

    if (Object.keys(filteredFields).length === 0) {
      throw new Error("No valid fields provided for update.");
    }

    // ✅ Check if the worker exists in the database
    const existingWorker = await prisma.worker.findUnique({ where: { id } });
    if (!existingWorker) {
      console.warn(`⚠️ Worker with ID ${id} not found.`);
      return null;
    }

    // ✅ Update the worker with only the allowed fields
    const updatedWorker = await prisma.worker.update({
      where: { id },
      data: filteredFields,
    });

    console.log(`✅ Worker with ID ${id} successfully updated:`, updatedWorker);
    return updatedWorker;
  } catch (error) {
    // 🚩 Handle Unique Constraint Error (e.g., duplicate email or username)
    if (error.code === "P2002") {
      console.error(`⚠️ Unique constraint error:`, error.meta.target);
      throw new Error(`A worker with this ${error.meta.target} already exists.`);
    }

    console.error(`❌ Error updating worker with ID ${id}:`, error.message);
    throw new Error("Failed to update worker.");
  }
};

export default updateWorkerById;
