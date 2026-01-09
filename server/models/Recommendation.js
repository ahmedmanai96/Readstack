const mongoose = require('mongoose');

const RecommendationSchema = new mongoose.Schema({
    bookTitle: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true
    },
    review: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    postedBy: {
        type: String, 
        required: true
    },
    // NEW FIELD: This allows us to categorize the book
    genre: {
        type: String,
        required: true,
        default: "Other"
    },
    userId: {
        type: String
    },
    likes: {
        type: [String],
        default: []
    },
    comments: [
        {
            username: String,
            text: String,
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// This line checks if the model exists before creating it to avoid the OverwriteModelError
module.exports = mongoose.models.Recommendation || mongoose.model('Recommendation', RecommendationSchema);