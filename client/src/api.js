import axios from 'axios';

const API = axios.create({
    // Replace the old localhost URL with your new Render URL
    baseURL: 'https://readstack-onv6.onrender.com/api', 
});

// This part keeps your user logged in by sending the token automatically
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;