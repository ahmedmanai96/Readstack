import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    const handleLogout = () => {
        localStorage.clear();
        // Force refresh back to login page
        window.location.href = '/login';
    };

    const navStyle = {
        backgroundColor: '#ffffff',
        padding: '15px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        fontFamily: "'Inter', sans-serif"
    };

    const getLinkStyle = (path) => ({
        textDecoration: 'none',
        color: location.pathname === path ? '#007bff' : '#555',
        fontWeight: location.pathname === path ? '700' : '500',
        fontSize: '15px'
    });

    return (
        <nav style={navStyle}>
            <Link to="/" style={{ fontSize: '22px', fontWeight: '800', color: '#007bff', textDecoration: 'none' }}>
                ReadStack.
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                {token ? (
                    <>
                        <Link to="/" style={getLinkStyle('/')}>Explore</Link>
                        <Link to="/feed" style={getLinkStyle('/feed')}>Community</Link>
                        <Link to="/profile" style={getLinkStyle('/profile')}>My Library</Link>
                        <span style={{ fontSize: '14px', color: '#888' }}>Hi, <strong>{username}</strong></span>
                        <button onClick={handleLogout} style={{ padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', border: '1px solid #ffccc7', color: '#ff4d4f', background: '#fff1f0', fontWeight: 'bold' }}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={getLinkStyle('/login')}>Login</Link>
                        <Link to="/register" style={{ backgroundColor: '#007bff', color: 'white', padding: '8px 20px', borderRadius: '20px', textDecoration: 'none', fontWeight: 'bold' }}>
                            Join Free
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;