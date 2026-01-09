import React, { useState, useEffect } from 'react';
import API from '../api'; // Swapped from axios to your new smart helper
import toast from 'react-hot-toast';

const Feed = () => {
    const [posts, setPosts] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); 
    const [selectedGenre, setSelectedGenre] = useState("All"); 
    const [sortBy, setSortBy] = useState("newest");
    
    const [activeCommentId, setActiveCommentId] = useState(null);
    const [commentText, setCommentText] = useState("");
    const [deletingId, setDeletingId] = useState(null);

    const username = localStorage.getItem('username');

    const genres = ["All", "Fiction", "Non-Fiction", "Mystery", "Sci-Fi", "Fantasy", "Biography", "Other"];

    const fetchFeed = async () => {
        try {
            // No full URL needed, API handles the base
            const res = await API.get('/recommendations/feed');
            setPosts(res.data);
        } catch (err) {
            toast.error("Could not load the feed.");
        }
    };

    useEffect(() => {
        fetchFeed();
    }, []);

    const handleLike = async (id) => {
        if (!username) return toast.error("Please login to like posts!");
        try {
            // Token is automatically sent via interceptor in api.js
            await API.post(`/recommendations/${id}/like`, { userId: username });
            fetchFeed(); 
            toast.success("Updated your like!");
        } catch (err) {
            toast.error("Error updating like.");
        }
    };

    const handleCommentSubmit = async (id) => {
        if (!commentText.trim()) return;
        try {
            await API.post(`/recommendations/${id}/comment`, {
                username: username, 
                text: commentText
            });
            
            setCommentText("");
            setActiveCommentId(null);
            fetchFeed(); 
            toast.success("Comment posted!");
        } catch (err) {
            toast.error("Could not post comment.");
        }
    };

    const confirmDelete = async (id) => {
        try {
            await API.post(`/recommendations/delete/${id}`);
            fetchFeed();
            toast.success("Recommendation deleted.");
        } catch (err) {
            toast.error("Delete failed.");
        }
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <span key={i} style={{ color: i < rating ? "#ffc107" : "#e4e5e9", fontSize: '16px' }}>
                &#9733;
            </span>
        ));
    };

    const filteredPosts = posts
        .filter((post) => {
            const matchesSearch = 
                post.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.postedBy.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesGenre = selectedGenre === "All" || post.genre === selectedGenre;
            return matchesSearch && matchesGenre;
        })
        .sort((a, b) => {
            if (sortBy === "highest") return b.rating - a.rating;
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

    const containerStyle = {
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto',
        fontFamily: "'Inter', sans-serif",
        backgroundColor: '#f8f9fa',
        minHeight: '100vh'
    };

    const filterCardStyle = {
        backgroundColor: 'white',
        padding: '12px 20px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        marginBottom: '20px'
    };

    const genreButtonStyle = (g) => ({
        padding: '5px 12px',
        borderRadius: '15px',
        border: 'none',
        cursor: 'pointer',
        backgroundColor: selectedGenre === g ? '#007bff' : '#f0f2f5',
        color: selectedGenre === g ? 'white' : '#555',
        fontWeight: '500',
        fontSize: '12px',
        transition: 'all 0.2s'
    });

    const postCardStyle = {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '15px',
        border: '1px solid #efefef',
        boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
    };

    return (
        <div style={containerStyle}>
            <header style={{ marginBottom: '20px' }}>
                <h1 style={{ margin: 0, fontSize: '24px', color: '#1a1a1a' }}>Community Feed</h1>
                <p style={{ color: '#666', fontSize: '14px' }}>Welcome back, <strong>{username || 'Guest'}</strong>!</p>
            </header>

            <div style={filterCardStyle}>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ flex: 1, padding: '8px 15px', borderRadius: '20px', border: '1px solid #ddd', outline: 'none', fontSize: '14px' }}
                    />
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: '8px', borderRadius: '20px', border: '1px solid #ddd', fontSize: '13px' }}>
                        <option value="newest">Newest</option>
                        <option value="highest">Top Rated</option>
                    </select>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {genres.map((g) => (
                        <button key={g} onClick={() => setSelectedGenre(g)} style={genreButtonStyle(g)}>
                            {g}
                        </button>
                    ))}
                </div>
            </div>

            {filteredPosts.map((post) => {
                const hasLiked = post.likes?.includes(username);
                const isOwner = post.postedBy === username;

                return (
                    <div key={post._id} style={postCardStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h2 style={{ margin: '0', fontSize: '18px' }}>{post.bookTitle}</h2>
                                <p style={{ color: '#007bff', margin: '2px 0', fontSize: '14px' }}>{post.author}</p>
                            </div>
                            <span style={{ backgroundColor: '#eef2ff', color: '#4f46e5', padding: '3px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                {post.genre}
                            </span>
                        </div>

                        <div style={{ margin: '8px 0' }}>{renderStars(post.rating)}</div>
                        <div style={{ background: '#fcfcfc', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #007bff', fontStyle: 'italic', marginBottom: '15px', fontSize: '14px' }}>
                            "{post.review}"
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '12px', color: '#777' }}>By <strong>{post.postedBy}</strong></span>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <button onClick={() => handleLike(post._id)} style={{ padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', border: '1px solid #ddd', background: hasLiked ? '#007bff' : 'white', color: hasLiked ? 'white' : '#333', fontSize: '12px' }}>
                                    👍 {post.likes?.length || 0}
                                </button>
                                
                                <button onClick={() => setActiveCommentId(activeCommentId === post._id ? null : post._id)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #ddd', cursor: 'pointer', background: 'white', fontSize: '12px' }}>
                                    💬 {post.comments?.length || 0}
                                </button>

                                {isOwner && (
                                    deletingId === post._id ? (
                                        <div style={{ display: 'flex', gap: '4px' }}>
                                            <button onClick={() => confirmDelete(post._id)} style={{ color: 'white', background: '#ff4d4f', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>Confirm</button>
                                            <button onClick={() => setDeletingId(null)} style={{ background: '#eee', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>No</button>
                                        </div>
                                    ) : (
                                        <button onClick={() => setDeletingId(post._id)} style={{ color: '#ff4d4f', border: 'none', background: 'none', cursor: 'pointer', textDecoration: 'underline', fontSize: '12px' }}>Delete</button>
                                    )
                                )}
                            </div>
                        </div>

                        {activeCommentId === post._id && (
                            <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                                <input 
                                    type="text" 
                                    placeholder="Add a comment..." 
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '13px' }}
                                />
                                <button onClick={() => handleCommentSubmit(post._id)} style={{ padding: '8px 15px', background: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Post</button>
                            </div>
                        )}

                        {post.comments?.length > 0 && (
                            <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                                {post.comments.map((c, i) => (
                                    <div key={i} style={{ fontSize: '12px', borderBottom: i === post.comments.length - 1 ? 'none' : '1px solid #eee', padding: '4px 0' }}>
                                        <strong style={{ color: '#007bff' }}>{c.username}</strong> {c.text}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default Feed;