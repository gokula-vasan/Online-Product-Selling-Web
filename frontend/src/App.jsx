import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CardPage from './pages/Card'; 
import AdminDashboard from './pages/AdminDashboard';
import ProductPage from './pages/ProductPage'; // Ensure this file exists
import ProfilePage from './pages/ProfilePage'; // Ensure this file exists
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// --- Scroll To Top Helper ---
// Ensures page scrolls to top when navigating
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      
      {/* Wrapper for Sticky Footer */}
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        
        {/* REMOVED 'container' class from main:
            This allows the Home Banner and Auth pages to be Full Width.
            Individual pages (like ProfilePage) use <Container> internally where needed.
        */}
        <main className="flex-grow-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/card" element={<CardPage />} />
            <Route path="/product/:id" element={<ProductPage />} />

            {/* Private / User Routes */}
            <Route path="/profile" element={<ProfilePage />} />
            
            {/* Admin Route */}
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;