import { auth } from 'express-oauth2-jwt-bearer';

// ✅ Auth middleware for validating JWTs and enforcing access control
const authMiddleware = auth({
  audience: process.env.AUTH0_AUDIENCE, // ✅ Dynamically load the audience from .env
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`, // ✅ Use the domain from .env
  tokenSigningAlg: 'RS256', // ✅ Specify the token signing algorithm for enhanced security
  scopes: ['write:booking', 'delete:booking'], // ✅ Include required scopes for fine-grained access control
});

export default authMiddleware;
