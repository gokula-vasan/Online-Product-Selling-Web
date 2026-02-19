import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container, Badge, NavDropdown, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
// IMPORTED FaHeart HERE
import { FaShoppingCart, FaUser, FaStore, FaUserShield, FaSignOutAlt, FaBars, FaHeart } from 'react-icons/fa';

const Navigation = () => {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0); // NEW: Wishlist count state
  const [userInfo, setUserInfo] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  // Scroll effect for Navbar styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update counts from localStorage
  useEffect(() => {
    const updateState = () => {
      const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      const wishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || []; // Read wishlist
      const user = JSON.parse(localStorage.getItem('userInfo'));
      
      const cCount = cartItems.reduce((acc, item) => acc + Number(item.qty), 0);
      
      setCartCount(cCount);
      setWishlistCount(wishlistItems.length); // Update wishlist count
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
    <Navbar 
      expand="lg" 
      fixed="top"
      className={`py-1 transition-all ${scrolled ? 'shadow-lg' : ''}`}
      style={{ 
        background: scrolled ? 'rgba(15, 32, 39, 0.95)' : 'rgba(15, 32, 39, 0.9)', 
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}
      variant="dark"
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center fw-bold fs-5">
          <div className="bg-white rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '32px', height: '32px' }}>
             <FaStore className="text-primary" size={16} />
          </div>
          <span className="text-white">EliteShop</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 text-white shadow-none">
            <FaBars size={20} />
        </Navbar.Toggle>

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center gap-3">
            
            {userInfo && (
              <Nav.Link as={Link} to="/admin" className="text-decoration-none">
                 <Button variant="outline-danger" size="sm" className="d-flex align-items-center fw-bold rounded-pill px-3 py-1" style={{ fontSize: '0.8rem' }}>
                    <FaUserShield className="me-2" /> Admin
                 </Button>
              </Nav.Link>
            )}

            {/* --- NEW: WISHLIST ICON --- */}
            <Nav.Link as={Link} to="/wishlist" className="position-relative text-white opacity-75 hover-opacity-100">
              <FaHeart size={20} className={wishlistCount > 0 ? "text-danger pulse-soft" : ""} />
              {wishlistCount > 0 && (
                <Badge 
                  bg="danger" 
                  text="white" 
                  className="position-absolute top-0 start-100 translate-middle rounded-circle border border-dark d-flex align-items-center justify-content-center shadow-sm"
                  style={{ width: '18px', height: '18px', fontSize: '0.7rem' }}
                >
                  {wishlistCount}
                </Badge>
              )}
            </Nav.Link>

            {/* --- CART ICON --- */}
            <Nav.Link as={Link} to="/card" className="position-relative text-white opacity-75 hover-opacity-100">
              <FaShoppingCart size={20} />
              {cartCount > 0 && (
                <Badge 
                  bg="warning" 
                  text="dark" 
                  className="position-absolute top-0 start-100 translate-middle rounded-circle border border-dark d-flex align-items-center justify-content-center shadow-sm"
                  style={{ width: '18px', height: '18px', fontSize: '0.7rem' }}
                >
                  {cartCount}
                </Badge>
              )}
            </Nav.Link>

            {/* --- USER PROFILE DROPDOWN --- */}
            {userInfo ? (
              <NavDropdown 
                title={
                  <div className="d-flex align-items-center text-white">
                    <div className="border border-secondary rounded-circle p-1 me-2 d-flex align-items-center justify-content-center" style={{ width: '30px', height: '30px' }}>
                        <FaUser size={14} />
                    </div>
                    <span className="fw-semibold small">{userInfo.name.split(' ')[0]}</span>
                  </div>
                } 
                id="username"
                align="end"
              >
                <NavDropdown.Item as={Link} to="/profile" className="small">User Profile</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={logoutHandler} className="text-danger small fw-bold">Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Link to="/login">
                <Button variant="primary" size="sm" className="fw-bold px-4 rounded-pill custom-btn border-0 shadow-sm">Sign In</Button>
              </Link>
            )}

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;