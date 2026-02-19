import React from 'react';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="text-light pt-5 mt-auto" style={{ background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)' }}>
      <Container>
        <Row className="py-4">
          
          
          <Col lg={4} md={6} className="mb-4 pe-lg-5">
            <div className="d-flex align-items-center mb-3">
               <div className="bg-white text-primary rounded-circle d-flex justify-content-center align-items-center me-2" style={{ width: '40px', height: '40px', fontSize: '1.2rem', fontWeight: 'bold' }}>E</div>
               <h4 className="fw-bold mb-0 text-white">EliteShop</h4>
            </div>
            <p className="text-white-50 small" style={{ lineHeight: '1.8' }}>
              Your premium destination for the latest trends in electronics, fashion, and lifestyle. 
              We believe in quality, speed, and exceptional customer service.
            </p>
            <div className="d-flex gap-3 mt-4">
              {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, index) => (
                <a key={index} href="#" className="text-white bg-white bg-opacity-10 rounded-circle d-flex justify-content-center align-items-center hover-lift" style={{ width: '36px', height: '36px', transition: '0.3s' }}>
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </Col>

        
          <Col lg={2} md={6} className="mb-4">
            <h6 className="text-uppercase fw-bold mb-4 text-warning" style={{ letterSpacing: '1px', fontSize: '0.9rem' }}>Shop</h6>
            <ul className="list-unstyled text-white-50 small d-flex flex-column gap-2">
              <li><Link to="/" className="text-decoration-none text-white-50 hover-text-white">Home</Link></li>
              <li><Link to="/card" className="text-decoration-none text-white-50 hover-text-white">Shopping Cart</Link></li>
              <li><Link to="/profile" className="text-decoration-none text-white-50 hover-text-white">My Account</Link></li>
              <li><Link to="/login" className="text-decoration-none text-white-50 hover-text-white">Login / Register</Link></li>
              
             
              <li>
                <Link to="/admin" className="text-decoration-none text-warning fw-bold hover-text-white">
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </Col>

          
          <Col lg={3} md={6} className="mb-4">
            <h6 className="text-uppercase fw-bold mb-4 text-warning" style={{ letterSpacing: '1px', fontSize: '0.9rem' }}>Contact</h6>
            <ul className="list-unstyled text-white-50 small d-flex flex-column gap-3">
              <li className="d-flex align-items-start">
                <FaMapMarkerAlt className="me-2 text-warning mt-1" /> 
                <span>123 Innovation Dr,<br />Tech Valley, CA 94043</span>
              </li>
              <li className="d-flex align-items-center">
                <FaEnvelope className="me-2 text-warning" /> support@eliteshop.com
              </li>
              <li className="d-flex align-items-center">
                <FaPhone className="me-2 text-warning" /> +1 (800) 123-4567
              </li>
            </ul>
          </Col>

          
          <Col lg={3} md={6} className="mb-4">
            <h6 className="text-uppercase fw-bold mb-4 text-warning" style={{ letterSpacing: '1px', fontSize: '0.9rem' }}>Stay Updated</h6>
            <p className="small text-white-50 mb-3">Subscribe to get 10% off your first order.</p>
            <Form>
              <InputGroup className="mb-3">
                <Form.Control
                  placeholder="Your email address"
                  className="bg-white bg-opacity-10 border-0 text-white placeholder-white-50"
                  style={{ backdropFilter: 'blur(5px)' }}
                />
                <Button variant="warning" className="text-dark fw-bold">
                  <FaPaperPlane />
                </Button>
              </InputGroup>
            </Form>
            <small className="text-white-50" style={{ fontSize: '0.75rem' }}>We respect your privacy. Unsubscribe anytime.</small>
          </Col>
        </Row>

        <hr className="border-secondary opacity-25 my-4" />

       
        <div className="pb-4 d-flex flex-column flex-md-row justify-content-between align-items-center small text-white-50">
          <p className="mb-2 mb-md-0">
            &copy; {new Date().getFullYear()} EliteShop Inc. All Rights Reserved.
          </p>
          <div className="d-flex gap-4">
            <a href="#" className="text-decoration-none text-white-50 hover-text-white">Privacy Policy</a>
            <a href="#" className="text-decoration-none text-white-50 hover-text-white">Terms of Service</a>
            <a href="#" className="text-decoration-none text-white-50 hover-text-white">Cookie Policy</a>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;