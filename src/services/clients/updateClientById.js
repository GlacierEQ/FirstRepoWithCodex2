import { PrismaClient } from '@prisma/client'; // Import Prisma Client

const prisma = new PrismaClient(); // Initialize Prisma Client

/**
 * Updates a client by their ID.
 * @param {string} id - The ID of the client to update.
 * @param {object} updatedFields - The fields to update (e.g., { name: "New Name" }).
 * @returns {object|null} - The updated client object or null if not found.
 */
const updateClientById = async (id, updatedFields) => {
  try {
    // ✅ Define allowed fields to update
    const allowedFields = ["username", "name", "password", "email", "phoneNumber"];
    const filteredFields = Object.keys(updatedFields)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updatedFields[key];
        return obj;
      }, {});

    if (Object.keys(filteredFields).length === 0) {
      throw new Error("No valid fields provided for update.");
    }

    // ✅ Check if the client exists in the database
    const existingClient = await prisma.client.findUnique({ where: { id } });
    if (!existingClient) {
      console.warn(`⚠️ Client with ID ${id} not found.`);
      return null;
    }

    // ✅ Update the client with only the allowed fields
    const updatedClient = await prisma.client.update({
      where: { id },
      data: filteredFields,
    });

    console.log(`✅ Client with ID ${id} successfully updated:`, updatedClient);
    return updatedClient;
  } catch (error) {
    // 🚩 Handle Unique Constraint Error (e.g., duplicate email or username)
    if (error.code === "P2002") {
      console.error(`⚠️ Unique constraint error:`, error.meta.target);
      throw new Error(`A client with this ${error.meta.target} already exists.`);
    }

    console.error(`❌ Error updating client with ID ${id}:`, error.message);
    throw new Error("Failed to update client.");
  }
};

export default updateClientById;
