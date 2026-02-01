import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-light pt-5 mt-auto">
      <Container>
        <Row className="py-4">
          
          {/* Column 1: Brand & About */}
          <Col md={3} sm={6} className="mb-4">
            <h5 className="text-warning fw-bold mb-3">EliteShop</h5>
            <p className="small text-white-50">
              Your one-stop destination for the best deals on electronics, fashion, and more. 
              Quality products, fast delivery, and premium support.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="text-light hover-warning"><FaFacebookF /></a>
              <a href="#" className="text-light hover-warning"><FaTwitter /></a>
              <a href="#" className="text-light hover-warning"><FaInstagram /></a>
              <a href="#" className="text-light hover-warning"><FaLinkedinIn /></a>
            </div>
          </Col>

          {/* Column 2: Quick Links */}
          <Col md={3} sm={6} className="mb-4">
            <h6 className="text-uppercase fw-bold mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/" className="text-decoration-none text-white-50">Home</Link></li>
              <li className="mb-2"><Link to="/card" className="text-decoration-none text-white-50">Cart</Link></li>
              <li className="mb-2"><Link to="/login" className="text-decoration-none text-white-50">Login</Link></li>
              <li className="mb-2"><Link to="/register" className="text-decoration-none text-white-50">Register</Link></li>
            </ul>
          </Col>

          {/* Column 3: Contact Info */}
          <Col md={3} sm={6} className="mb-4">
            <h6 className="text-uppercase fw-bold mb-3">Contact Us</h6>
            <ul className="list-unstyled text-white-50 small">
              <li className="mb-2 d-flex align-items-center">
                <FaMapMarkerAlt className="me-2 text-warning" /> 123 Market St, San Francisco, CA
              </li>
              <li className="mb-2 d-flex align-items-center">
                <FaEnvelope className="me-2 text-warning" /> support@eliteshop.com
              </li>
              <li className="mb-2 d-flex align-items-center">
                <FaPhone className="me-2 text-warning" /> +1 (555) 123-4567
              </li>
            </ul>
          </Col>

          {/* Column 4: Newsletter */}
          <Col md={3} sm={6} className="mb-4">
            <h6 className="text-uppercase fw-bold mb-3">Newsletter</h6>
            <p className="small text-white-50">Subscribe to get special offers and updates.</p>
            <Form className="d-flex flex-column gap-2">
              <Form.Control type="email" placeholder="Enter your email" size="sm" />
              <Button variant="warning" size="sm" className="fw-bold">Subscribe</Button>
            </Form>
          </Col>
        </Row>

        <hr className="border-secondary my-0" />

        {/* Bottom Bar */}
        <div className="py-3 d-flex flex-column flex-md-row justify-content-between align-items-center">
          <p className="small text-white-50 mb-0">
            &copy; {new Date().getFullYear()} EliteShop. All Rights Reserved.
          </p>
          <div className="small text-white-50">
            <a href="#" className="text-decoration-none text-white-50 me-3">Privacy Policy</a>
            <a href="#" className="text-decoration-none text-white-50">Terms of Service</a>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;