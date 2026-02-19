import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa'; // Removed FaGoogle

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = location.search ? location.search.split('=')[1] : '/';

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await api.post('/users/login', { email, password });
      
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      window.dispatchEvent(new Event("storage"));

      navigate(redirect);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        
        {/* Left Side Image */}
        <div className="auth-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1570857502809-08184874388e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')" }}>
          <div className="auth-image-text">
            <h2>Welcome Back!</h2>
            <p>Access your orders, wishlist, and recommendations.</p>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="auth-form-wrapper">
          <div className="text-center mb-4">
            <h2 style={{ fontWeight: 'bold', color: '#333' }}>Sign In</h2>
            <p className="text-muted">Please login to continue shopping</p>
          </div>

          {error && <Alert variant="danger" className="text-center">{error}</Alert>}

          <Form onSubmit={submitHandler}>
            
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

            {/* Remember Me Checkbox */}
            <div className="mb-4">
              <Form.Check 
                type="checkbox" 
                label="Remember me" 
                id="custom-checkbox"
                className="text-muted small"
              />
            </div>

            {/* Sign In Button */}
            <Button 
              variant="primary" 
              type="submit" 
              className="w-100 custom-btn text-white rounded-pill d-flex align-items-center justify-content-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                  Signing In...
                </>
              ) : (
                <><FaSignInAlt className="me-2" /> Sign In</>
              )}
            </Button>
          </Form>

          {/* New Customer Registration Link */}
          <div className="text-center mt-4">
            <p className="text-muted">
              New Customer? <Link to="/register" style={{ color: '#764ba2', fontWeight: 'bold' }}>Create an Account</Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;