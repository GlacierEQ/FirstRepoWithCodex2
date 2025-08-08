import { PrismaClient } from '@prisma/client'; // ⭐ Import Prisma Client

const prisma = new PrismaClient(); // ⭐ Initialize Prisma Client

/**
 * ✍️ Updates a client by their ID with authorization checks.
 * 
 * @param {string} id - The ID of the client to update.
 * @param {object} updatedFields - The fields to update.
 * @param {object} currentUser - The authenticated user (used for permission check).
 * @returns {object|null} - The updated client object or null if not found.
 */
const updateClientById = async (id, updatedFields, currentUser) => {
  try {
    // ⭐ Authorization: Only self or admin
    const isSelf = currentUser?.id === id;
    const isAdmin = currentUser?.isAdmin === true;

    if (!isSelf && !isAdmin) {
      const error = new Error('🚫 You are not authorized to update this client.');
      error.statusCode = 403;
      throw error;
    }

    // ⭐ Define allowed fields to update
    const allowedFields = ['username', 'name', 'password', 'email', 'phoneNumber'];
    const filteredFields = Object.keys(updatedFields)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updatedFields[key];
        return obj;
      }, {});

    if (Object.keys(filteredFields).length === 0) {
      throw new Error('No valid fields provided for update.');
    }

    // ⭐ Check if client exists
    const existingClient = await prisma.client.findUnique({ where: { id } });
    if (!existingClient) {
      console.warn(`⚠️ Client with ID ${id} not found.`);
      return null;
    }

    // ⭐ Update client
    const updatedClient = await prisma.client.update({
      where: { id },
      data: filteredFields,
    });

    console.log(`✅ Client with ID ${id} successfully updated:`, updatedClient);
    return updatedClient;

  } catch (error) {
    // ⭐ Handle Unique Constraint Error
    if (error.code === 'P2002') {
      console.error(`⚠️ Unique constraint error:`, error.meta.target);
      throw new Error(`A client with this ${error.meta.target} already exists.`);
    }

    console.error(`❌ Error updating client with ID ${id}:`, error.message);
    throw error;
  }
};

export default updateClientById;
