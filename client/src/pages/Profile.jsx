import React, { useState, useEffect } from 'react';
import API from '../api'; // Your smart API helper
import toast from 'react-hot-toast';

const Profile = () => {
    const [myPosts, setMyPosts] = useState([]);
    const [deletingId, setDeletingId] = useState(null); 
    const username = localStorage.getItem('username');

    const fetchMyPosts = async () => {
        try {
            // Using API helper to fetch user-specific recommendations
            const res = await API.get(`/recommendations/user/${username}`);
            setMyPosts(res.data);
        } catch (err) {
            console.error("Error fetching your posts", err);
            toast.error("Could not load your library.");
        }
    };

    useEffect(() => {
        if (username) fetchMyPosts();
    }, [username]);

    const confirmDelete = async (id) => {
        try {
            // No manual headers needed! API helper automatically sends the token
            await API.post(`/recommendations/delete/${id}`);
            toast.success("Book removed from your library.");
            setDeletingId(null);
            fetchMyPosts(); 
        } catch (err) {
            toast.error("Failed to delete.");
        }
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <span key={i} style={{ color: i < rating ? "#ffc107" : "#e4e5e9", fontSize: '16px' }}>
                &#9733;
            </span>
        ));
    };

    const containerStyle = {
        padding: '20px',
        maxWidth: '850px',
        margin: '0 auto',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        backgroundColor: '#f8f9fa',
        minHeight: '100vh'
    };

    const headerCardStyle = {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        marginBottom: '30px',
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
    };

    const avatarStyle = {
        width: '60px',
        height: '60px',
        backgroundColor: '#007bff',
        color: 'white',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        fontWeight: 'bold',
        textTransform: 'uppercase'
    };

    const postCardStyle = {
        backgroundColor: '#ffffff',
        padding: '20px',
        marginBottom: '15px',
        borderRadius: '12px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.02)',
        position: 'relative',
        border: '1px solid #efefef'
    };

    const genreBadgeStyle = {
        position: 'absolute',
        top: '20px',
        right: '20px',
        backgroundColor: '#f0f7ff',
        color: '#007bff',
        padding: '4px 10px',
        borderRadius: '15px',
        fontSize: '10px',
        fontWeight: '700',
        textTransform: 'uppercase'
    };

    return (
        <div style={containerStyle}>
            <div style={headerCardStyle}>
                <div style={avatarStyle}>{username?.charAt(0)}</div>
                <div>
                    <h1 style={{ margin: 0, fontSize: '22px', color: '#333' }}>{username}'s Library</h1>
                    <p style={{ margin: '2px 0 0 0', color: '#666', fontSize: '14px' }}>
                        Curating <strong>{myPosts.length}</strong> recommendations
                    </p>
                </div>
            </div>

            <h2 style={{ fontSize: '16px', color: '#555', marginBottom: '15px' }}>Your Shared Books</h2>
            
            {myPosts.length === 0 ? (
                <div style={{ padding: '40px', background: '#fff', borderRadius: '12px', textAlign: 'center', border: '2px dashed #ccc' }}>
                    <p style={{ color: '#888', fontSize: '15px' }}>You haven't shared any books yet!</p>
                    <a href="/" style={{ color: '#007bff', fontWeight: '600', textDecoration: 'none', fontSize: '14px' }}>Share your first book →</a>
                </div>
            ) : (
                myPosts.map((post) => (
                    <div key={post._id} style={postCardStyle}>
                        <span style={genreBadgeStyle}>{post.genre || "General"}</span>

                        <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#222', paddingRight: '80px' }}>
                            {post.bookTitle}
                        </h3>
                        <p style={{ margin: '0 0 10px 0', color: '#007bff', fontWeight: '500', fontSize: '14px' }}>
                            {post.author}
                        </p>
                        
                        <div style={{ marginBottom: '12px' }}>{renderStars(post.rating)}</div>

                        <div style={{ 
                            backgroundColor: '#fafafa', 
                            padding: '12px', 
                            borderRadius: '8px', 
                            marginBottom: '15px', 
                            borderLeft: '4px solid #007bff',
                            lineHeight: '1.5',
                            color: '#444',
                            fontSize: '14px'
                        }}>
                            <i style={{ fontStyle: 'italic' }}>"{post.review}"</i>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee', paddingTop: '12px' }}>
                            <span style={{ fontSize: '11px', color: '#999' }}>
                                Published: {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                            
                            {deletingId === post._id ? (
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button 
                                        onClick={() => confirmDelete(post._id)}
                                        style={{ background: '#ff4d4d', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                                    >
                                        Confirm
                                    </button>
                                    <button 
                                        onClick={() => setDeletingId(null)}
                                        style={{ background: '#eee', border: 'none', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => setDeletingId(post._id)}
                                    style={{ 
                                        backgroundColor: 'transparent', 
                                        color: '#ff4d4d', 
                                        border: '1px solid #ff4d4d', 
                                        padding: '5px 12px', 
                                        borderRadius: '6px', 
                                        cursor: 'pointer', 
                                        fontWeight: '600', 
                                        fontSize: '11px'
                                    }}
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default Profile;