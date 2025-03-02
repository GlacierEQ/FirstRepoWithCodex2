import { PrismaClient } from '@prisma/client'; // Import Prisma Client

const prisma = new PrismaClient(); // Initialize Prisma Client

// List of original property IDs
const originalPropertyIds = [
  'g9012345-67ef-0123-4567-89abcdef0123',
  'h0123456-78f0-1234-5678-9abcdef01234',
  'i1234567-89f0-1234-5678-9abcdef01234',
  'j2345678-90f1-2345-6789-abcdef012345',
  'k3456789-01f2-3456-789a-bcdef0123456',
];

const deleteUnwantedProperties = async () => {
  try {
    // Find all properties in the database
    const allProperties = await prisma.property.findMany({
      select: { id: true }, // Select only the IDs
    });

    // Filter properties to delete (not in the originalPropertyIds array)
    const propertiesToDelete = allProperties.filter((property) => !originalPropertyIds.includes(property.id));

    console.log(`Found ${propertiesToDelete.length} properties to delete.`);

    // Delete properties one by one
    for (const property of propertiesToDelete) {
      await prisma.property.delete({
        where: { id: property.id },
      });
      console.log(`Deleted property with ID: ${property.id}`);
    }

    console.log('Cleanup complete. Only original properties remain.');
  } catch (error) {
    console.error('Error deleting properties:', error.message);
  } finally {
    await prisma.$disconnect(); // Ensure Prisma disconnects from the database
  }
};

deleteUnwantedProperties();
