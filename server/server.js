const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// 1. SIMPLIFIED CORS SETTINGS
// This allows all origins (including your Vercel link) to talk to the server
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// 2. DATABASE CONNECTION
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected: ReadStack Database is Live'))
    .catch(err => console.error('❌ Database Connection Error:', err));

// 3. ROUTES
const authRoute = require('./routes/auth');
const recommendationRoute = require('./routes/recommendations');
const bookRoute = require('./routes/books');

app.use('/api/auth', authRoute);
app.use('/api/recommendations', recommendationRoute);
app.use('/api/books', bookRoute);

// 4. BASIC TEST & HEALTH CHECK ROUTE
app.get('/', (req, res) => {
    res.status(200).send('ReadStack API is Online');
});

// 5. START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server listening on port ${PORT}`);
});