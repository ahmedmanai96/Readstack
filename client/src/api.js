import axios from 'axios';

// This logic automatically detects if you are running locally or on the web
const isProduction = window.location.hostname !== 'localhost';

const API = axios.create({
    baseURL: isProduction 
        ? 'https://your-backend-name.onrender.com/api'  // We will update this soon
        : 'http://localhost:5000/api'
});

// This automatically attaches your token to every request so you don't have to
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;