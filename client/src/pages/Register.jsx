import React, { useState } from 'react';
import API from '../api'; // Swapping axios for your new API helper
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Using API helper instead of hardcoded localhost URL
            await API.post('/auth/register', formData);
            
            // Using toast for a better user experience
            toast.success("Registration successful! Welcome to the community.");
            navigate('/login');
        } catch (err) {
            console.error(err);
            // Dynamic error message from your server if available
            toast.error(err.response?.data?.message || "Registration failed. Please try a different username or email.");
        }
    };

    // Styling Objects
    const pageStyle = {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        padding: '20px'
    };

    const cardStyle = {
        backgroundColor: '#ffffff',
        padding: '40px',
        borderRadius: '15px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center'
    };

    const inputStyle = {
        width: '100%',
        padding: '12px 15px',
        margin: '8px 0 20px 0',
        display: 'inline-block',
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxSizing: 'border-box',
        fontSize: '16px',
        outline: 'none',
        transition: 'border-color 0.3s'
    };

    const buttonStyle = {
        width: '100%',
        backgroundColor: '#007bff',
        color: 'white',
        padding: '14px 20px',
        margin: '10px 0',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        transition: 'background-color 0.3s'
    };

    return (
        <div style={pageStyle}>
            <div style={cardStyle}>
                <h1 style={{ color: '#333', marginBottom: '10px', fontSize: '28px' }}>Join ReadStack</h1>
                <p style={{ color: '#666', marginBottom: '30px' }}>
                    Create an account to start sharing your favorite books.
                </p>

                <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
                    <label style={{ fontWeight: '600', color: '#555', fontSize: '14px' }}>Username</label>
                    <input 
                        type="text" 
                        placeholder="Enter a unique username"
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        style={inputStyle}
                        required
                    />

                    <label style={{ fontWeight: '600', color: '#555', fontSize: '14px' }}>Email Address</label>
                    <input 
                        type="email" 
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        style={inputStyle}
                        required
                    />

                    <label style={{ fontWeight: '600', color: '#555', fontSize: '14px' }}>Password</label>
                    <input 
                        type="password" 
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        style={inputStyle}
                        required
                    />

                    <button 
                        type="submit" 
                        style={buttonStyle}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
                    >
                        Create Account
                    </button>
                </form>

                <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
                    Already have an account? <Link to="/login" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;