import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config(); // ✅ Load environment variables

const JWT_SECRET = process.env.JWT_SECRET || 'my-secret-key'; // ✅ Secret key

const authMiddleware = (req, res, next) => {
  let token = req.headers.authorization; // ✅ Retrieve token from headers

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided!' });
  }

  // ✅ Allow both "Bearer <token>" and "<token>" formats
  if (token.startsWith('Bearer ')) {  
    token = token.split(' ')[1];  // ✅ Remove "Bearer " and keep only the token
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // ✅ Verify JWT token
    req.user = decoded; // ✅ Attach user data to request object
    next(); // ✅ Proceed to the next middleware
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token!' });
  }
};

export default authMiddleware;

