import { PrismaClient } from '@prisma/client'; // Import Prisma Client

const prisma = new PrismaClient(); // Initialize Prisma Client

const fetchProperties = async () => {
  try {
    // Fetch all properties from the database
    const properties = await prisma.property.findMany();

    console.log('Remaining Properties:', properties); // Log the remaining properties
  } catch (error) {
    console.error('Error fetching properties:', error.message); // Log any errors
  } finally {
    await prisma.$disconnect(); // Ensure Prisma disconnects from the database
  }
};

fetchProperties();
