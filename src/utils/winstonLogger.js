import winston from 'winston';
/* Create a Winston logger instance with these configurations. This file initializes a logger using the Winston library to capture events such as API CRUD calls, errors, and warnings. The logger outputs these events to the console during development, and it can also be configured to log to files or integrate with systems like Sentry.
 */

const winstonLogger = winston.createLogger({
  level: 'info', // Set the default log level to "info" (can be adjusted)

  // Format the logs in JSON format for structured logging
  format: winston.format.json(),

  // Meta information to add to each log message
  defaultMeta: { service: 'booking-api' }, // Updated for the Booking API
});

// Add console logging during development
if (process.env.NODE_ENV !== 'production') {
  winstonLogger.add(
    new winston.transports.Console({
      // Use a simple, readable format for console logs during development
      format: winston.format.simple(),
    })
  );
}

// Export the winstonLogger instance for use throughout the application by importing it in the logMiddleware.js file.
export default winstonLogger;
