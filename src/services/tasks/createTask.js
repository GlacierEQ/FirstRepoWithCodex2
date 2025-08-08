import { PrismaClient } from '@prisma/client';
import { taskSchema } from '../../utils/validationSchema.js';

const prisma = new PrismaClient();

/**
 * Creates a new task in the database
 * @param {string} title - A short title describing the task (e.g., "Fix Leaking Pipe")
 * @param {string} description - Detailed information about the task
 * @param {string} clientEmail - Email of the client (used to look up ID) 🚩
 * @param {string} workerEmail - (Optional) Email of the worker (used to look up ID) 🚩
 * @param {string} category - The category of the task (e.g., "plumbing", "electricity")
 * @param {string} status - The current status of the task ("pending", "in_progress", "completed")
 * @param {number} price - The estimated cost of the task
 * @param {string} dueDate - The deadline for task completion (ISO format)
 * @returns {Promise<Object>} - The newly created task object
 */
const createTask = async (
  title,
  description,
  clientEmail, // 🚩
  workerEmail, // 🚩 optional
  category,
  status,
  price,
  dueDate
) => {
  try {
    // 🚀 Log incoming task data before validation
    console.log('📥 Incoming task data:', {
      title,
      description,
      clientEmail, // 🚩
      workerEmail, // 🚩
      category,
      status,
      price,
      dueDate,
    });

    //✅ Ensure required fields are present
    const missingFields = [];
    if (!clientEmail) missingFields.push('clientEmail'); // 🚩

    if (missingFields.length > 0) {
      const errorMessage = `Missing required fields: ${missingFields.join(', ')}`;
      console.warn(`⚠️ Validation Failed: ${errorMessage}`);
      const validationError = new Error(errorMessage);
      validationError.statusCode = 400;
      throw validationError;
    }

    // 🚩 Look up client ID from email
    const client = await prisma.client.findUnique({
      where: { email: clientEmail },
    });
    if (!client) {
      const error = new Error(`Client with email ${clientEmail} not found.`);
      error.statusCode = 404;
      throw error;
    }

    // 🚩 If workerEmail is provided, look up worker ID
    let workerId = null;
    if (workerEmail) {
      const worker = await prisma.worker.findUnique({
        where: { email: workerEmail },
      });
      if (!worker) {
        const error = new Error(`Worker with email ${workerEmail} not found.`);
        error.statusCode = 404;
        throw error;
      }
      workerId = worker.id;
    }

    // ✅ Validate input using Joi schema in validationSchema.js
    const { error, value } = taskSchema.validate({
      title,
      description,
      category,
      status,
      price,
      dueDate,
    });

    if (error) {
      console.error('❌ Validation failed:', error.details[0].message);
      const joiError = new Error(`Validation error: ${error.details[0].message}`);
      joiError.statusCode = 400;
      throw joiError;
    }

    // 🚀 Log the cleaned and validated data
    console.log('✅ Validated data (after Joi processing):', value);

    // 🚀 Proceed to create new task in the database
    const taskData = {
      title: value.title,
      description: value.description,
      clientId: client.id, // 🚩 Connect via ID
      category: value.category,
      status: value.status,
      price: value.price,
      dueDate: value.dueDate,
      workerId, // 🚩 Set if found, otherwise null
    };

    
    /*The unique id is created automatically by Prisma when you run this:
      const newTask = await prisma.task.create
      because you have this in the schema task model:
      id String @id @default(uuid()) // ✅ Prisma generates this under the hood!
    */
    const newTask = await prisma.task.create({
      data: taskData,
      //⭐️ NEXT: Include client and worker info in the returned response
      include: {
        client: {
          select: { name: true, email: true },
        },
        worker: {
          select: { name: true, email: true },
        },
      },
    });

    console.log('✅ Task created successfully:', newTask);
    return newTask;
  } catch (error) {
    console.error('❌ Error creating task:', error.message);
    if (!error.statusCode) error.statusCode = 500;
    throw error;
  }
};

export default createTask;
