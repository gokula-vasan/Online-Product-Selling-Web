import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container, Badge, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaStore, FaUserShield } from 'react-icons/fa'; // Added FaUserShield

const Navigation = () => {
  const [cartCount, setCartCount] = useState(0);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const updateState = () => {
      const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      const user = JSON.parse(localStorage.getItem('userInfo'));
      const count = cartItems.reduce((acc, item) => acc + Number(item.qty), 0);
      
      setCartCount(count);
      setUserInfo(user);
    };

    updateState();
    window.addEventListener('storage', updateState);
    return () => window.removeEventListener('storage', updateState);
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    window.dispatchEvent(new Event("storage"));
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect className="py-3 sticky-top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold d-flex align-items-center">
          <FaStore className="me-2 text-warning" size={24} />
          <span>EliteShop</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            
            {/* 1. CART LINK */}
            <Nav.Link as={Link} to="/card" className="me-3 position-relative">
              <FaShoppingCart size={20} /> Cart
              {cartCount > 0 && (
                <Badge bg="warning" text="dark" className="position-absolute top-0 start-100 translate-middle rounded-circle">
                  {cartCount}
                </Badge>
              )}
            </Nav.Link>

            {/* 2. ADMIN LINK (Now visible directly on the Navbar) */}
            {/* We show this if the user is logged in. 
                (In a real app, you'd check userInfo.isAdmin) */}
            {userInfo && (
              <Nav.Link 
                as={Link} 
                to="/admin" 
                className="me-3 fw-bold text-danger d-flex align-items-center"
              >
                <FaUserShield className="me-1" size={18} /> Admin
              </Nav.Link>
            )}

            {/* 3. USER DROPDOWN */}
            {userInfo ? (
              <NavDropdown title={<><FaUser className="me-1"/> {userInfo.name}</>} id="username">
                <NavDropdown.Item as={Link} to="/profile">
                  User Profile
                </NavDropdown.Item>

                <NavDropdown.Divider />
                
                <NavDropdown.Item onClick={logoutHandler} className="text-danger">
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link as={Link} to="/login">
                <FaUser className="me-1" /> Sign In
              </Nav.Link>
            )}

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;