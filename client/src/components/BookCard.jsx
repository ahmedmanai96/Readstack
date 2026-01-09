import React from 'react';

const BookCard = ({ book, onAdd }) => {
    // Styling Objects
    const cardStyle = {
        backgroundColor: '#fff',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        transition: 'transform 0.2s, boxShadow 0.2s',
        display: 'flex',
        flexDirection: 'column',
        width: '200px',
        cursor: 'pointer'
    };

    const imageContainer = {
        width: '100%',
        height: '260px',
        backgroundColor: '#f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };

    const imageStyle = {
        width: '100%',
        height: '100%',
        objectFit: 'cover'
    };

    const infoStyle = {
        padding: '15px',
        display: 'flex',
        flexDirection: 'column',
        gap: '5px'
    };

    const titleStyle = {
        fontSize: '16px',
        fontWeight: '700',
        margin: 0,
        color: '#333',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    };

    const authorStyle = {
        fontSize: '14px',
        color: '#777',
        margin: 0
    };

    const buttonStyle = {
        marginTop: '10px',
        padding: '8px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background 0.2s'
    };

    return (
        <div 
            style={cardStyle}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
            }}
        >
            <div style={imageContainer}>
                {book.coverImage ? (
                    <img src={book.coverImage} alt={book.title} style={imageStyle} />
                ) : (
                    <span style={{ color: '#ccc' }}>No Cover</span>
                )}
            </div>
            
            <div style={infoStyle}>
                <h3 style={titleStyle} title={book.title}>{book.title}</h3>
                <p style={authorStyle}>{book.author}</p>
                <button 
                    style={buttonStyle}
                    onClick={(e) => {
                        e.stopPropagation();
                        onAdd(book);
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
                >
                    + Add to Library
                </button>
            </div>
        </div>
    );
};

export default BookCard;