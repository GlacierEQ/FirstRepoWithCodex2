import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deleteBooking() {
  try {
    const bookingId = 'e6020744-4be9-473f-9f4c-850318df499a'; // The incorrect booking ID

    const deletedBooking = await prisma.booking.delete({
      where: { id: bookingId },
    });

    console.log('Deleted Booking:', deletedBooking);
  } catch (error) {
    console.error('Error deleting booking:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

deleteBooking();
