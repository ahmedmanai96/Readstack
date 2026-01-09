import React, { useState, useEffect } from 'react';
import API from '../api'; // Use your new smart helper
import toast from 'react-hot-toast';

const Home = () => {
    const [user, setUser] = useState('');
    const [query, setQuery] = useState('');
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const [showModal, setShowModal] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [review, setReview] = useState('');
    const [genre, setGenre] = useState('Fiction');
    const [rating, setRating] = useState(5); 
    const [hover, setHover] = useState(0);   

    const genres = ["Fiction", "Non-Fiction", "Mystery", "Sci-Fi", "Fantasy", "Biography", "Other"];

    useEffect(() => {
        const savedName = localStorage.getItem('username');
        if (savedName) setUser(savedName);
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query) return;
        setLoading(true);
        try {
            // Using API helper instead of axios.get('http://localhost:5000...')
            const res = await API.get(`/books/search?q=${query}`);
            setBooks(res.data);
            if (res.data.length === 0) toast.error("No books found.");
        } catch (err) {
            console.error("Search failed", err);
            toast.error("Search failed. Is the server running?");
        } finally {
            setLoading(false);
        }
    };

    const openModal = (book) => {
        const currentUsername = localStorage.getItem('username');
        if (!currentUsername) {
            return toast.error("Please login to recommend books!");
        }
        setSelectedBook(book);
        setShowModal(true);
        setRating(5); 
        setReview('');
    };

    const handleRecommend = async () => {
        const currentUsername = localStorage.getItem('username');

        const recommendationData = {
            bookTitle: selectedBook.title,
            author: selectedBook.authors?.join(', ') || 'Unknown',
            review: review,
            rating: rating,
            username: currentUsername,
            genre: genre,
            thumbnail: selectedBook.thumbnail
        };

        try {
            // No headers needed! API helper automatically attaches the Bearer token
            await API.post('/recommendations/add', recommendationData);
            toast.success("Recommendation shared successfully!");
            setShowModal(false); 
        } catch (err) {
            toast.error("Failed to add recommendation.");
        }
    };

    const containerStyle = {
        padding: '40px 20px',
        maxWidth: '1100px',
        margin: '0 auto',
        fontFamily: "'Inter', sans-serif",
        minHeight: '80vh'
    };

    const searchInputStyle = {
        padding: '15px 25px',
        width: '100%',
        maxWidth: '500px',
        borderRadius: '30px',
        border: '2px solid #eee',
        fontSize: '16px',
        outline: 'none',
        boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
        transition: 'all 0.3s ease'
    };

    return (
        <div style={containerStyle}>
            <header style={{ textAlign: 'center', marginBottom: '50px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#1a1a1a', marginBottom: '10px' }}>
                    Find your next great read, {user || 'Reader'}
                </h1>
                <p style={{ color: '#666', fontSize: '16px' }}>Search thousands of books and share your thoughts with the community.</p>
                
                <form onSubmit={handleSearch} style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <input 
                        type="text" 
                        placeholder="Book title, author, or ISBN..." 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={searchInputStyle}
                    />
                    <button type="submit" style={{ 
                        padding: '15px 30px', 
                        borderRadius: '30px', 
                        backgroundColor: '#007bff', 
                        color: 'white', 
                        border: 'none', 
                        fontWeight: 'bold', 
                        cursor: 'pointer',
                        boxShadow: '0 4px 10px rgba(0,123,255,0.3)'
                    }}>
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </form>
            </header>

            {books.length === 0 && !loading && (
                <div style={{ textAlign: 'center', color: '#999', marginTop: '50px' }}>
                    <p>Start searching to see book results here!</p>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '25px' }}>
                {books.map((book) => (
                    <div key={book.id} style={{ 
                        backgroundColor: 'white', 
                        padding: '15px', 
                        borderRadius: '12px', 
                        textAlign: 'center', 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        transition: 'transform 0.3s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div>
                            <div style={{ height: '200px', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <img 
                                    src={book.thumbnail || 'https://via.placeholder.com/150x220?text=No+Cover'} 
                                    alt={book.title} 
                                    style={{ maxHeight: '100%', borderRadius: '5px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }} 
                                />
                            </div>
                            <h3 style={{ fontSize: '14px', fontWeight: '700', margin: '5px 0', minHeight: '35px', color: '#333', overflow: 'hidden' }}>{book.title}</h3>
                            <p style={{ fontSize: '12px', color: '#777', marginBottom: '10px' }}>{book.authors?.[0] || 'Unknown Author'}</p>
                        </div>
                        <button 
                            onClick={() => openModal(book)}
                            style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
                        >
                            + Recommend
                        </button>
                    </div>
                ))}
            </div>

            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '15px', width: '90%', maxWidth: '450px', boxShadow: '0 15px 30px rgba(0,0,0,0.2)' }}>
                        <h2 style={{ marginTop: 0, fontSize: '20px', color: '#1a1a1a' }}>Reviewing {selectedBook?.title}</h2>
                        
                        <div style={{ margin: '15px 0', textAlign: 'center' }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '5px', color: '#555', fontSize: '14px' }}>Your Rating</p>
                            {[...Array(5)].map((_, index) => {
                                const starValue = index + 1;
                                return (
                                    <button
                                        type="button" key={starValue}
                                        style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '30px', color: starValue <= (hover || rating) ? "#ffc107" : "#e4e5e9" }}
                                        onClick={() => setRating(starValue)}
                                        onMouseEnter={() => setHover(starValue)}
                                        onMouseLeave={() => setHover(rating)}
                                    >
                                        <span>&#9733;</span>
                                    </button>
                                );
                            })}
                        </div>

                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px', fontSize: '13px' }}>Select Genre</label>
                        <select 
                            style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' }}
                            value={genre}
                            onChange={(e) => setGenre(e.target.value)}
                        >
                            {genres.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>

                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px', fontSize: '13px' }}>Your Thoughts</label>
                        <textarea 
                            style={{ width: '100%', height: '80px', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box', outline: 'none', resize: 'none', fontSize: '14px' }}
                            placeholder="Why do you recommend this book?"
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                        />

                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '10px', border: 'none', background: '#f5f5f5', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', color: '#666' }}>Cancel</button>
                            <button onClick={handleRecommend} style={{ flex: 2, padding: '10px', border: 'none', background: '#007bff', color: 'white', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Share with Community</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;