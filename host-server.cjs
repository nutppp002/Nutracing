const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 80;

// Path to store data locally alongside the executable
const dataFilePath = path.join(process.cwd(), 'motofix_data.json');

// Helper to read data
function readData() {
  if (fs.existsSync(dataFilePath)) {
    try {
      return JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    } catch (e) {
      console.error("Error reading data file:", e);
      return {};
    }
  }
  return {};
}

// Helper to write data
function writeData(data) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error("Error writing data file:", e);
  }
}

// Middleware
app.use(express.json({ limit: '10mb' }));

// ----- API ENDPOINTS FOR DATA SYNC ----- //

// Get data for a specific key
app.get('/api/data/:key', (req, res) => {
  const db = readData();
  const value = db[req.params.key];
  if (value !== undefined) {
    res.json({ value });
  } else {
    res.json({}); // Not found, frontend will fallback to initialValue
  }
});

// Save data for a specific key
app.post('/api/data/:key', (req, res) => {
  const db = readData();
  db[req.params.key] = req.body.value;
  writeData(db);
  res.json({ success: true });
});

// --------------------------------------- //

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`MotoFix Host System is running!`);
  console.log(`====================================================`);
  console.log(`Server is listening on port: ${port}`);
  console.log(`Local Access: http://localhost${port == 80 ? '' : ':' + port}`);
  console.log(`Network Access: Go to http://<THIS-MACHINE-IP>${port == 80 ? '' : ':' + port} from other devices`);
  console.log(`Data Storage: ${dataFilePath}`);
  console.log(`====================================================`);
});
