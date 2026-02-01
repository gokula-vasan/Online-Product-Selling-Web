import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { FaUser, FaEnvelope, FaLock, FaGoogle, FaUserPlus } from 'react-icons/fa';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');

    // 1. Client-side Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    
    try {
      const { data } = await api.post('/users/register', { name, email, password });
      
      // Save user to storage
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      // 2. Force Navbar to update instantly
      window.dispatchEvent(new Event("storage"));
      
      // 3. Smooth Redirect
      navigate('/');
      
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        
        {/* Left Side - Image Section */}
        <div className="auth-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')" }}>
          <div className="auth-image-text">
            <h2>Join EliteShop</h2>
            <p>Create an account to track orders, save items, and get exclusive offers.</p>
          </div>
        </div>

        {/* Right Side - Form Section */}
        <div className="auth-form-wrapper">
          <div className="text-center mb-4">
            <h2 style={{ fontWeight: 'bold', color: '#333' }}>Create Account</h2>
            <p className="text-muted">It's free and takes 1 minute</p>
          </div>

          {error && <Alert variant="danger" className="text-center">{error}</Alert>}

          <Form onSubmit={submitHandler}>
            
            {/* Name Input */}
            <Form.Group className="mb-3 position-relative">
              <Form.Control 
                type="text" 
                placeholder="Full Name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
                style={{ paddingLeft: '40px', height: '50px' }}
              />
              <FaUser style={{ position: 'absolute', top: '18px', left: '15px', color: '#aaa' }} />
            </Form.Group>

            {/* Email Input */}
            <Form.Group className="mb-3 position-relative">
              <Form.Control 
                type="email" 
                placeholder="Email Address" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                style={{ paddingLeft: '40px', height: '50px' }}
              />
              <FaEnvelope style={{ position: 'absolute', top: '18px', left: '15px', color: '#aaa' }} />
            </Form.Group>

            {/* Password Input */}
            <Form.Group className="mb-3 position-relative">
              <Form.Control 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                style={{ paddingLeft: '40px', height: '50px' }}
              />
              <FaLock style={{ position: 'absolute', top: '18px', left: '15px', color: '#aaa' }} />
            </Form.Group>

            {/* Confirm Password Input (New) */}
            <Form.Group className="mb-3 position-relative">
              <Form.Control 
                type="password" 
                placeholder="Confirm Password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
                style={{ paddingLeft: '40px', height: '50px' }}
              />
              <FaLock style={{ position: 'absolute', top: '18px', left: '15px', color: '#aaa' }} />
            </Form.Group>

            {/* Terms Checkbox */}
            <Form.Group className="mb-4">
              <Form.Check 
                required
                label={<span className="small text-muted">I agree to the <a href="#" style={{textDecoration:'none', color: '#764ba2'}}>Terms & Conditions</a></span>}
                feedback="You must agree before submitting."
                feedbackType="invalid"
              />
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit" 
              className="w-100 custom-btn text-white rounded-pill d-flex align-items-center justify-content-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                  Creating Account...
                </>
              ) : (
                <><FaUserPlus className="me-2" /> Sign Up</>
              )}
            </Button>
          </Form>

          <div className="d-flex align-items-center my-4">
            <hr className="flex-grow-1" />
            <span className="mx-2 text-muted">OR</span>
            <hr className="flex-grow-1" />
          </div>

          <Button variant="outline-dark" className="w-100 rounded-pill mb-3 d-flex align-items-center justify-content-center">
            <FaGoogle className="me-2" /> Sign up with Google
          </Button>

          <div className="text-center mt-3">
            <p className="text-muted">Already have an account? <Link to="/login" style={{ color: '#764ba2', fontWeight: 'bold' }}>Log In</Link></p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;