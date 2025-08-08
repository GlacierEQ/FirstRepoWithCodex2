import { Router } from 'express';
import axios from 'axios'; // ⭐ Needed to call Auth0 Management API
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { clientSchema } from '../utils/validationSchema.js'; // ⭐ Correct path!

dotenv.config();

const router = Router();
const prisma = new PrismaClient();

// ⭐ Load Auth0 Management API credentials
const auth0Domain = process.env.AUTH0_DOMAIN;
const auth0ManagementClientId = process.env.AUTH0_MGMT_CLIENT_ID;
const auth0ManagementClientSecret = process.env.AUTH0_MGMT_CLIENT_SECRET;
const auth0Audience = `https://${auth0Domain}/api/v2/`; // ⭐ Target Management API

///////////////////////////////////////////////
/**
 * @route POST /register
 * @desc Public registration route for NEW clients OR workers (no token needed)
 * @public ✅ Anyone can create an account here
 */
router.post('/', async (req, res, next) => {
  try {
    console.log('📥 Incoming registration request:', req.body);

    const { username, password, name, email, phoneNumber, role } = req.body;

    // ⭐ Basic Validation
    const { error } = clientSchema.validate({ username, password, name, email, phoneNumber });
    if (error) {
      return res.status(400).json({ message: `❌ Validation Error: ${error.details[0].message}` });
    }

    // ⭐ Check if role is valid (client or worker)
    if (role !== 'client' && role !== 'worker') {
      return res.status(400).json({ message: '❌ Role must be either "client" or "worker".' });
    }

    // ⭐ Get a Management API Access Token (M2M Token)
    const tokenResponse = await axios.post(`https://${auth0Domain}/oauth/token`, {
      client_id: auth0ManagementClientId,
      client_secret: auth0ManagementClientSecret,
      audience: auth0Audience,
      grant_type: 'client_credentials',
    });

    const managementAccessToken = tokenResponse.data.access_token; // ⭐ Save Management Token
    console.log('⭐ Got Management API token');

    // ⭐ Create a new user inside Auth0 Database
    const auth0UserResponse = await axios.post(
      `https://${auth0Domain}/api/v2/users`,
      {
        email,
        username,
        password,
        connection: 'Username-Password-Authentication', // ⭐ Correct connection name
        email_verified: false,
        app_metadata: {
          role: role, // ⭐ Save role info inside Auth0 metadata
        },
      },
      {
        headers: {
          Authorization: `Bearer ${managementAccessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const auth0User = auth0UserResponse.data;
    console.log('⭐ Successfully created user in Auth0:', auth0User.user_id);

    // ⭐ Hash password before storing it in our Prisma database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ⭐ Save the new client inside our local database
    const newClient = await prisma.client.create({
      data: {
        auth0Id: auth0User.user_id, // ⭐ Link to Auth0 user id
        username,
        email,
        password: hashedPassword,
        name,
        phoneNumber,
        role: role, // ⭐ Save user selected role (client or worker)
      },
    });

    res.status(201).json({
      message: '✅ User registered successfully!',
      client: {
        id: newClient.id,
        username: newClient.username,
        email: newClient.email,
        role: newClient.role,
      },
    });
  } catch (error) {
    console.error('❌ Error during client registration:', error.message);

    if (error.response) {
      console.error('⚠️ Auth0 Response Data:', error.response.data);
    }

    next(error);
  }
});

export default router;
