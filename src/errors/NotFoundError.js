// Custom error class for 404 errors
class NotFoundError extends Error {
    constructor(resourceType, id) {
      super(`${resourceType} with id ${id} was not found!`); // This line sets the error message when new NotFoundError('User', id) is created: "User with id abcd1234-non-existent-5678 was not found!"

      this.name = 'NotFoundError'; // Set error name to 'NotFoundError' for debugging
      this.statusCode = 404; // HTTP status code for "Not Found"
    }
  }
  
  export default NotFoundError;
  