import winstonLogger from '../utils/winstonLogger.js';

// Middleware to log requests
const log = (req, res, next) => {
  // Capture the start time of the request
  const start = new Date();

  // Listen for when the response is finished
  res.on('finish', () => {
    // Calculate the duration once the response is sent
    const ms = new Date() - start;

    // Log details about the request and response
    winstonLogger.info(`${req.method} ${req.originalUrl} - Status: ${res.statusCode}, Duration: ${ms} ms`);
  });

  // Call the next middleware or route handler
  next();
};

// Export the middleware function for use in your app
export default log;

//NOTES:
/*
/*
 - Middleware for logging HTTP requests and responses using Winston.
 
 - How it works:
   - This middleware tracks the duration of each HTTP request made to the server.
   - It captures the HTTP method, URL, response status code, and the time it took to process the request.
   - The `winstonLogger` from winstonLogger.js is used to record these details. In development, the logs are displayed in the console.
   - This middleware helps debugging and monitoring by providing visibility into API activity and performance.

 - Why use it:
   - Helps identify slow requests or errors in your application.
   - Logs important information for debugging, performance tracking, and auditing.
   - Can be extended to work with external monitoring tools like Sentry for advanced insights.



 - Usage:
   - Import and attach this middleware in your Express application (`app.use(log);`) in the index.js file.
// Standard Middleware
//---------------------------
app.use(express.json()); // ✅ Parse incoming JSON requests
app.use(logMiddleware); // ✅ Custom logging middleware


   - The logs are automatically generated for every incoming request and completed response.
    - Example log output:
   - `GET /api/users - Status: 200, Duration: 25 ms`
   - `POST /api/bookings - Status: 500, Duration: 120 ms`
 */
