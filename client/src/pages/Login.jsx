import React, { useState } from 'react';
import API from '../api'; // Use your new smart helper
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Using API helper instead of axios.post('http://localhost:5000...')
            const res = await API.post('/auth/login', formData);
            
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('username', res.data.username);
            
            toast.success(`Welcome back, ${res.data.username}!`);
            
            // Navigate to home page after a brief delay
            setTimeout(() => {
                navigate('/');
                window.location.reload(); // Ensures the UI updates with logged-in state
            }, 1000);
            
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Login failed! Check your email and password.");
        }
    };

    // Styling Objects
    const pageStyle = {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
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

    const inputGroupStyle = {
        textAlign: 'left',
        marginBottom: '20px'
    };

    const labelStyle = {
        display: 'block',
        fontWeight: '600',
        color: '#555',
        fontSize: '14px',
        marginBottom: '8px'
    };

    const inputStyle = {
        width: '100%',
        padding: '12px 15px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxSizing: 'border-box',
        fontSize: '16px',
        outline: 'none',
        transition: 'border-color 0.3s'
    };

    const buttonStyle = {
        width: '100%',
        backgroundColor: '#28a745',
        color: 'white',
        padding: '14px 20px',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        transition: 'background-color 0.3s',
        marginTop: '10px'
    };

    return (
        <div style={pageStyle}>
            <div style={cardStyle}>
                <h1 style={{ color: '#333', marginBottom: '10px', fontSize: '28px' }}>ReadStack Login</h1>
                <p style={{ color: '#666', marginBottom: '30px' }}>Enter your details to continue your reading journey.</p>
                
                <form onSubmit={handleLogin}>
                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Email Address</label>
                        <input 
                            type="email" 
                            placeholder="yourname@email.com"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            style={inputStyle}
                            required
                        />
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            style={inputStyle}
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        style={buttonStyle}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
                    >
                        Login
                    </button>
                </form>

                <p style={{ marginTop: '25px', fontSize: '14px', color: '#666' }}>
                    New to ReadStack? <Link to="/register" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>Create an account</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;