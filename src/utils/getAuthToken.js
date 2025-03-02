import axios from 'axios'; // Use axios for HTTP requests

const getAuthToken = async () => {
  try {
    // Make the POST request to Auth0 to get the access token
    const response = await axios.post(
      `https://${process.env.AUTH0_DOMAIN}/oauth/token`, // Auth0 domain from environment variables
      {
        grant_type: 'client_credentials', // Specify the grant type
        client_id: process.env.AUTH0_CLIENT_ID, // Auth0 client ID from environment variables
        client_secret: process.env.AUTH0_CLIENT_SECRET, // Auth0 client secret from environment variables
        audience: process.env.AUTH0_AUDIENCE, // API audience from environment variables
      },
      {
        headers: {
          'Content-Type': 'application/json', // Set the Content-Type header
        },
      }
    );

    // Return the access token from the response
    return response.data.access_token;
  } catch (error) {
    // Log the error and throw a new error with a clear message
    console.error('Error fetching Auth Token:', error.response?.data || error.message);
    throw new Error('Failed to fetch Auth Token');
  }
};

export default getAuthToken;
