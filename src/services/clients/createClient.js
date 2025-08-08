import { PrismaClient } from '@prisma/client';
import { clientSchema } from '../../utils/validationSchema.js';

const prisma = new PrismaClient();

/**
 * Creates a new client in the database
 * @param {string} username - The unique username of the client
 * @param {string} name - The full name of the client
 * @param {string} password - The client's password (should be hashed in production)
 * @param {string} email - The email address of the client
 * @param {string} phoneNumber - The client's contact number
 * @returns {Promise<Object>} - The newly created client object
 */
const createClient = async (username, name, password, email, phoneNumber) => {
  try {
    // 🚀 Log incoming request data before validation
    console.log('📥 Incoming client data:', { username, name, password, email, phoneNumber });

    // ✅ Ensure required fields are present
    const missingFields = [];
    if (!username) missingFields.push('username');
    if (!password) missingFields.push('password');
    if (!email) missingFields.push('email');
    if (!name) missingFields.push('name');
    if (!phoneNumber) missingFields.push('phoneNumber');

    if (missingFields.length > 0) {
      const errorMessage = `Missing required fields: ${missingFields.join(', ')}`;
      console.warn(`⚠️ Validation Failed: ${errorMessage}`);
      const validationError = new Error(errorMessage);
      validationError.statusCode = 400;
      throw validationError;
    }

    // ✅ Validate input using Joi schema
    // This ensures that the provided client data meets the required format and rules
    // If any field is invalid (e.g., email is not properly formatted, username too short), Joi will return an error
    // Joi.validate() returns an object with two properties:
    //  - `error`: If validation fails, this contains details about what went wrong
    //  - `value`: The validated and sanitized data (e.g., trimmed strings, applied default values)
    const { error, value } = clientSchema.validate({ username, password, name, email, phoneNumber });

    /* EXAMPLE OF IT USE:
    const { error, value } = clientSchema.validate({
        username: "JohnDoe",
        password: "securePass123",
        name: "John Doe",
        email: "johndoe@email.com",
        phoneNumber: "+1234567890"
      });
    
    console.log(error); // ❌ undefined (no errors)
    console.log(value); // ✅ { username: "JohnDoe", password: "securePass123", name: "John Doe", email: "johndoe@email.com", phoneNumber: "+1234567890" }
    */

    if (error) {
      console.error('❌ Validation failed:', error.details[0].message);
      const joiError = new Error(`Validation error: ${error.details[0].message}`);
      joiError.statusCode = 400;
      throw joiError;
    }

    // 🚀 Log the cleaned and validated data
    console.log('✅ Validated data (after Joi processing):', value);

    // ✅ Check if client already exists (check email, username, and phoneNumber)
    const existingClient = await prisma.client.findFirst({
      where: {
        OR: [{ email: value.email }, { username: value.username }, { phoneNumber: value.phoneNumber }],
      },
    });

    if (existingClient) {
      const duplicateError = new Error('A client with this email, username, or phone number already exists.');
      duplicateError.statusCode = 400;
      throw duplicateError;
    }

    // 🚀 Prepare client data for insertion (No profilePicture included)
    const clientData = {
      username: value.username,
      name: value.name,
      password: value.password, // 🚩Make sure to hash this in production
      email: value.email,
      phoneNumber: value.phoneNumber,
    };

    // 🚀 Proceed to create new client in the database (Prisma will auto-assign `role`)
    const newClient = await prisma.client.create({ data: clientData });

    console.log('✅ New client created successfully:', newClient);
    return newClient;
  } catch (error) {
    console.error('❌ Error creating client:', error.message);
    if (!error.statusCode) error.statusCode = 500;
    throw error;
  }
};

export default createClient;

/* ✅ Key Fixes & Explanations:
1️⃣ **Preserved ALL comments** from previous code.
2️⃣ **Ensured Proper Joi Validation** before saving to database.
3️⃣ **Removed unnecessary profilePicture checks** as it is not required at creation.
4️⃣ **Implemented Prisma Query to prevent duplicate clients** before insertion.

🚀 **Next Steps:**
1️⃣ Update Prisma schema to allow profilePicture as NULL for clients.
2️⃣ Test API calls without profile pictures to confirm everything works.
3️⃣ Implement "Update Profile" feature where clients can add a profile picture later.
*/
