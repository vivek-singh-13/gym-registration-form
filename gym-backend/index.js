const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Ensure routes are imported correctly
app.use('/students', require('./routes/students'));
app.use('/payments', require('./routes/payments'));
app.use('/student', require('./routes/students'));

// Handle undefined routes


app.use((req, res) => {
    console.log(`Fallback triggered for: ${req.method} ${req.url}`);
    res.status(404).json({ error: 'Route not found' });
});


// Centralized error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong, please try again later' });
});



// Start server
app.listen(3001, () => {
    console.log('Server running on port 3001');
});
