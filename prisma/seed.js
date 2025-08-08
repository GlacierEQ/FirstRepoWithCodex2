/**
 * 🔄 DATABASE SEEDING SCRIPT - seed.js
 * 
 * 📌 PURPOSE:
 * This file is used to populate the PostgreSQL database with initial data during development or testing.
 * It ensures that your database has the essential data (like users, tasks, workers, clients, etc.)
 * every time it's reset, especially after running `prisma migrate reset` or wiping the database.
 * 
 * 🧠 WHY IS THIS USEFUL?
 * - Makes development faster by avoiding manual re-entry of test data.
 * - Provides a consistent data structure for debugging, feature testing, and frontend development.
 * - Ensures that relationships (e.g., tasks assigned to users) are correctly seeded.
 * - Helps simulate realistic application behavior before going live.
 * 
 * ⚠️ NOTE ON PASSWORDS:
 * - For simplicity, all seeded clients are assigned a default password: "changeme123!".
 * - This is only for development purposes and should **NEVER** be used in production.
 * - If your JSON files already include passwords, they will be overridden by this script unless modified.
 * - Passwords in production should be securely hashed and stored only after user signup.
 * 
 * 🧪 HOW TO USE:
 * Run the following command to execute this script:
 * 
 *     npm run seed
 * 
 * or directly via:
 * 
 *     node prisma/seed.js
 * 
 * ✅ This script uses Prisma Client to create or update entries using `upsert`, ensuring no duplicates.
 * 
 */
/**
 * 🔄 DATABASE SEEDING SCRIPT - seed.js
 * 
 * 📌 PURPOSE:
 * This file is used to populate the PostgreSQL database with initial data during development or testing.
 * It ensures that your database has the essential data (like users, tasks, workers, clients, etc.)
 * every time it's reset, especially after running `prisma migrate reset` or wiping the database.
 */

import { PrismaClient } from '@prisma/client';
import clientsData from '../src/data/clients.json' with { type: 'json' };
import workersData from '../src/data/workers.json' with { type: 'json' };
import tasksData from '../src/data/tasks.json' with { type: 'json' };

const { clients } = clientsData;
const { workers } = workersData;
const { tasks } = tasksData;

const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });

async function main() {
  console.log('🧹 Cleaning up the database...');

  await prisma.task.deleteMany();
  await prisma.client.deleteMany();
  await prisma.worker.deleteMany();

  console.log('✅ Database cleaned up!');

  // 🔽🔽🔽 SEED CLIENTS 🔽🔽🔽
  console.log('👤 Seeding clients...');
  for (const client of clients) {
    const isAdmin = client.username === 'jbolivar'; // ⭐ Mark admin by username

    await prisma.client.upsert({
      where: { email: client.email },
      update: {},
      create: {
        ...client,
        role: isAdmin ? 'admin' : 'client', // ⭐ Assign admin role if match
        isAdmin, // ⭐ Set isAdmin true or false
      },
    });
  }

  console.log('✅ Clients seeded!');

  // 🔽🔽🔽 SEED WORKERS 🔽🔽🔽
  console.log('🛠 Seeding workers...');
  for (const worker of workers) {
    await prisma.worker.upsert({
      where: { email: worker.email },
      update: {},
      create: {
        ...worker,
      },
    });
  }
  console.log('✅ Workers seeded!');

  // 🔽🔽🔽 SEED TASKS 🔽🔽🔽
  console.log('📋 Seeding tasks...');
  for (const task of tasks) {
    const { clientEmail, workerEmail, clientId, workerId, ...taskData } = task;

    await prisma.task.create({
      data: {
        ...taskData,
        client: {
          connect: { email: clientEmail },
        },
        worker: workerEmail ? {
          connect: { email: workerEmail },
        } : undefined,
      },
    });
  }
  console.log('✅ Tasks seeded!');
  console.log('🚀 Database seeding complete!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
