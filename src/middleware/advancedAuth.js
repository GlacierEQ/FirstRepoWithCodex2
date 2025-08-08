import dotenv from 'dotenv';
dotenv.config(); // ⭐️ Load env vars right here!

import { auth } from 'express-oauth2-jwt-bearer';

// ✅ Auth middleware for validating JWTs and enforcing access control
const authMiddleware = auth({
  audience: process.env.AUTH0_AUDIENCE, // ✅ Dynamically load the audience from .env
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`, // ✅ Use the domain from .env
  tokenSigningAlg: 'RS256', // ✅ Specify the token signing algorithm for enhanced security
});

export default authMiddleware;

/* 🔐 Why Do You Need an API in Auth0?
Your backend (Express API) needs secure authentication. Instead of handling tokens and passwords manually, Auth0 provides an API that:

Issues secure JWT tokens when users log in.
Validates those tokens when users make requests to your API.
Ensures only authorized users can access certain routes depending on their roles (e.g., updating/deleting their own profile).
🛠 How Do You Secure Your API with Auth0?
🔹 You created an Auth0 API called "MyTasks2Do API" inside the APIs section in Auth0. There you give roles and permission to the users: Clients and Workers
🔹 This API will only accept requests that include a valid token issued by Auth0.
🔹 Your backend uses the .env file to tell it which Auth0 API it should trust.
🔹 The advancedAuth.js middleware will validate incoming JWT tokens before allowing access.

⚡ How Your Express API Uses Auth0
1️⃣ A client logs in via Auth0 and receives a JWT token (Auth0 does this automatically).
2️⃣ The client sends a request to your Express API, attaching that token in the header (Authorization: Bearer <token>).
3️⃣ Your API checks if the token is valid using advancedAuth.js.
4️⃣ If the token is valid, the API allows access.
5️⃣ If invalid, the API denies access (401 Unauthorized).

How the Authentication Flow Works in Your Case
Let’s break it down step by step:

1️⃣ User Visits Your React App (SPA)
The user either registers or logs in using Auth0.
The React app redirects them to Auth0’s Hosted Login Page (via the Auth0 Application → MyTasks2Do App).

2️⃣ Auth0 Application (MyTasks2Do App) Handles Login
The Application (MyTasks2Do App) verifies the user’s credentials.
If successful, it generates:
Access Token → Used for API access (backend authentication).
ID Token → Contains user details (name, email, etc.) for frontend use.

3️⃣ React App Gets the Access Token
After successful login, the React app receives the Access Token.
This token is stored (either in local storage, session storage, or memory).
Every future request to the backend includes this token in the Authorization header.

4️⃣ Backend (Express API) Receives Token
The user (client or worker) makes a request via the React frontend to the Express API backend (e.g., /api/clients).
The token is included in the request Authorization header:

Authorization: Bearer <access_token>
The backend (Express API) extracts and verifies the token using Auth0’s API.

5️⃣ Auth0 API Validates & Authorizes
The backend checks if the token is valid using advancedAuth.js.
If valid ✅:
The user gains access to protected resources (registering, updating profile, posting tasks, etc.).
If invalid ❌:
The request is denied with a 401 Unauthorized error.


*/
