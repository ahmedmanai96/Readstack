import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    // Styling Objects - Tightened padding and margins
    const footerStyle = {
        backgroundColor: '#f8f9fa',
        padding: '30px 20px 20px 20px', // Reduced from 60px
        borderTop: '1px solid #eee',
        marginTop: 'auto',
        fontFamily: "'Inter', sans-serif",
        color: '#555'
    };

    const contentStyle = {
        maxWidth: '1100px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: '20px' // Reduced gap
    };

    const brandSection = {
        flex: '1',
        minWidth: '200px'
    };

    const linksSection = {
        display: 'flex',
        gap: '40px' // Tightened gap between columns
    };

    const linkColumn = {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px' // Reduced vertical gap between links
    };

    const footerLinkStyle = {
        textDecoration: 'none',
        color: '#777',
        fontSize: '13px', // Slightly smaller text for compactness
        transition: 'color 0.2s'
    };

    const copyrightStyle = {
        textAlign: 'center',
        marginTop: '25px', // Reduced from 50px
        paddingTop: '15px',
        borderTop: '1px solid #eaeaea',
        fontSize: '12px',
        color: '#999'
    };

    return (
        <footer style={footerStyle}>
            <div style={contentStyle}>
                <div style={brandSection}>
                    <h2 style={{ color: '#007bff', margin: '0 0 8px 0', fontSize: '20px', fontWeight: '800' }}>
                        ReadStack<span style={{ color: '#333' }}>.</span>
                    </h2>
                    <p style={{ lineHeight: '1.4', fontSize: '13px', maxWidth: '280px', margin: 0 }}>
                        The community for readers to share and discover their next adventures.
                    </p>
                </div>

                <div style={linksSection}>
                    <div style={linkColumn}>
                        <h4 style={{ color: '#333', marginBottom: '5px', fontSize: '14px' }}>Platform</h4>
                        <Link to="/" style={footerLinkStyle}>Explore</Link>
                        <Link to="/feed" style={footerLinkStyle}>Community</Link>
                        <Link to="/profile" style={footerLinkStyle}>Library</Link>
                    </div>

                    <div style={linkColumn}>
                        <h4 style={{ color: '#333', marginBottom: '5px', fontSize: '14px' }}>Support</h4>
                        <Link to="#" style={footerLinkStyle}>Help</Link>
                        <Link to="#" style={footerLinkStyle}>Privacy</Link>
                        <Link to="#" style={footerLinkStyle}>Terms</Link>
                    </div>
                </div>
            </div>

            <div style={copyrightStyle}>
                © {new Date().getFullYear()} ReadStack Project. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;