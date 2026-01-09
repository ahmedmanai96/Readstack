const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// 1. DYNAMIC CORS SETTINGS
// This allows your local testing AND your future live website to talk to the server
const allowedOrigins = [
    "http://localhost:3000",
    process.env.FRONTEND_URL // We will add your Vercel URL here later
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

app.use(express.json());

// 2. DATABASE CONNECTION
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected: ReadStack Database is Live'))
    .catch(err => console.error('❌ Database Connection Error:', err));

// 3. ROUTES (Defined before the server starts)
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