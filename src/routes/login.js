import { Router } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client'; // 🛡️ Prisma Client

dotenv.config();

const prisma = new PrismaClient();
const loginRouter = Router();

///////////////////////////////////////////////
/**
 * @route POST /login
 * @desc Authenticate existing users (only if already registered)
 * @public ✅ No authentication required initially
 */
loginRouter.post('/', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    console.log('🔑 Attempting login for user:', username);

    if (!username || !password) {
      return res.status(400).json({ message: '❌ Username and password are required!' });
    }

    // ✅ Check in Prisma DB if the user exists (by email or username)
    const client = await prisma.client.findFirst({
      where: {
        OR: [{ email: username }, { username }],
      },
    });

    if (!client) {
      return res.status(404).json({ message: '❌ User not found! Please register first.' });
    }

    // ✅ Send login request to Auth0
    const authDomain = process.env.AUTH0_DOMAIN;
    const clientId = process.env.AUTH0_CLIENT_ID;
    const clientSecret = process.env.AUTH0_CLIENT_SECRET;
    const audience = process.env.AUTH0_AUDIENCE;

    const response = await axios.post(`https://${authDomain}/oauth/token`, {
      grant_type: 'password',
      username: username,
      password: password,
      client_id: clientId,
      client_secret: clientSecret,
      audience: audience,
      scope: 'openid profile email',
    });

    const { access_token, id_token } = response.data;

    console.log('✅ Login successful for:', username);

    res.status(200).json({
      message: '✅ Successfully logged in!',
      token: access_token,
      idToken: id_token,
    });
  } catch (error) {
    console.error('❌ Error during login:', error.message);

    if (error.response) {
      console.error('⚠️ Auth0 Error Response:', error.response.data);
    }

    return res.status(401).json({
      message: '❌ Invalid login credentials or authentication failed!',
      error: error.response?.data || 'Unknown error occurred',
    });
  }
});

export default loginRouter;
