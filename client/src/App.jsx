import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // Import the Toaster container
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import Footer from './components/Footer.jsx';

function App() {
  // Read token from storage once per page load
  const token = localStorage.getItem('token');

  return (
    <Router>
      {/* The Toaster component must be here to show notifications globally. 
        I've set the duration to 3000ms (3 seconds).
      */}
      <Toaster 
        position="top-center" 
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: "'Inter', sans-serif",
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }} 
      />

      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        
        <Navbar /> 

        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/feed" element={<Feed />} />
            
            <Route 
              path="/profile" 
              element={token ? <Profile /> : <Navigate to="/login" />} 
            />
            
            <Route 
              path="/login" 
              element={token ? <Navigate to="/" /> : <Login />} 
            />
            
            <Route 
              path="/register" 
              element={token ? <Navigate to="/" /> : <Register />} 
            />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;