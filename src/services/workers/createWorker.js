import { PrismaClient } from '@prisma/client';
import { workerSchema } from '../../utils/validationSchema.js';

const prisma = new PrismaClient();

/**
 * Creates a new worker in the database with full validation.
 * Prevents duplicate records and ensures required fields are present.
 * @param {string} username - The unique username of the worker
 * @param {string} name - The full name of the worker
 * @param {string} password - The worker's password (should be hashed in production)
 * @param {string} email - The email address of the worker
 * @param {string} phoneNumber - The worker's contact number
 * @param {string} profilePicture - The worker's profile picture (Required)
 * @param {Array<string>} skills - The worker's list of skills (At least 1 required)
 * @param {number} experienceYears - Worker’s experience in years (Optional, exclusive with experienceMonths)
 * @param {number} experienceMonths - Worker’s experience in months (Optional, exclusive with experienceYears, 0-11)
 * @returns {Promise<Object>} - The newly created worker object
 */
const createWorker = async (
  username, name, password, email, phoneNumber, profilePicture, skills, experienceYears, experienceMonths
) => {
  try {
    console.log('📥 Incoming worker data:', { username, name, password, email, phoneNumber, profilePicture, skills, experienceYears, experienceMonths });

    // ✅ Ensure required fields are present
    const missingFields = [];
    if (!username) missingFields.push('username');
    if (!password) missingFields.push('password');
    if (!email) missingFields.push('email');
    if (!name) missingFields.push('name');
    if (!phoneNumber) missingFields.push('phoneNumber');
    if (!profilePicture) missingFields.push('profilePicture');
    if (!skills || skills.length === 0) missingFields.push('skills');

    // ✅ Ensure only one experience field is provided (MANDATORY RULE!)
    if ((experienceYears !== undefined && experienceMonths !== undefined) || (experienceYears === undefined && experienceMonths === undefined)) {
      missingFields.push('Only one of experienceYears or experienceMonths should be provided');
    }

    if (missingFields.length > 0) {
      const errorMessage = `Missing required fields: ${missingFields.join(', ')}`;
      console.warn(`⚠️ Validation Failed: ${errorMessage}`);
      throw new Error(errorMessage);
    }

    // ✅ Validate input using Joi schema
    const { error, value } = workerSchema.validate({ 
      username, password, name, email, phoneNumber, profilePicture, skills, experienceYears, experienceMonths 
    });

    if (error) {
      console.error('❌ Validation failed:', error.details[0].message);
      throw new Error(`Validation error: ${error.details[0].message}`);
    }

    console.log('✅ Validated data (after Joi processing):', value);

    // ✅ Check for duplicate worker (email, username, phoneNumber must be unique)
    const existingWorker = await prisma.worker.findFirst({
      where: {
        OR: [
          { email: value.email },
          { username: value.username },
          { phoneNumber: value.phoneNumber },
        ],
      },
    });

    if (existingWorker) {
      throw new Error('A worker with this email, username, or phone number already exists.');
    }

    // 🚀 Prepare worker data for insertion
    const workerData = {
      username: value.username,
      name: value.name,
      password: value.password, // 🚩 Make sure to hash this in production
      email: value.email,
      phoneNumber: value.phoneNumber,
      profilePicture: value.profilePicture,
      skills: value.skills,
      experienceYears: value.experienceYears,
      experienceMonths: value.experienceMonths,
    };

    // 🚀 Insert into the database
    const newWorker = await prisma.worker.create({ data: workerData });
    console.log('✅ New worker created successfully:', newWorker);
    return newWorker;
  } catch (error) {
    console.error('❌ Error creating worker:', error.message);
    throw error;
  }
};

export default createWorker;
