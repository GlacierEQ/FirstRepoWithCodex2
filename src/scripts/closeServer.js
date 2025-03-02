import { exec } from 'child_process'; // Use ES module import

// Function to find and kill the process running on port 3000
const closeServer = () => {
  exec('netstat -ano | findstr :3000', (err, stdout, stderr) => {
    if (err) {
      console.error('Error finding process on port 3000:', err.message);
      return;
    }

    console.log('Netstat Output:', stdout); // Debugging: Log the raw output

    // Extract PID from the netstat output
    const lines = stdout.trim().split('\n');
    const listeningLine = lines.find((line) => line.includes('LISTENING')); // Look for a line with LISTENING
    console.log('Filtered Line:', listeningLine); // Debugging: Log the filtered line

    // Adjusted parsing logic to isolate PID
    const pid = listeningLine?.trim().split(/\s+/).pop(); // Extract PID as the last value in the line
    console.log('Extracted PID:', pid); // Debugging: Log the extracted PID

    if (!pid || isNaN(pid)) {
      console.log('No valid process found running on port 3000.');
      return;
    }

    // Kill the process
    exec(`taskkill /PID ${pid} /F`, (killErr, killStdout, killStderr) => {
      if (killErr) {
        console.error('Error killing process:', killErr.message);
        return;
      }

      console.log(`Successfully killed the process running on port 3000 (PID: ${pid}).`);
    });
  });
};

// Execute the function
closeServer();
