import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
// IMPORT FaRegHeart (Empty Heart) alongside the solid FaHeart
import { FaShoppingCart, FaStar, FaHeart, FaRegHeart } from 'react-icons/fa';
import { formatToINR } from '../utils/currencyUtils'; 

const ProductCard = ({ product }) => {
  // --- 1. NEW WISHLIST STATE ---
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Check if item is already in wishlist when page loads
  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem('wishlistItems')) || [];
    setIsWishlisted(wishlist.some((x) => x._id === product._id));
  }, [product._id]);

  // --- 2. WISHLIST TOGGLE FUNCTION ---
  const toggleWishlistHandler = (e) => {
    e.preventDefault(); // Stops the card from navigating to the product page
    let wishlist = JSON.parse(localStorage.getItem('wishlistItems')) || [];
    
    if (isWishlisted) {
      // Remove from wishlist
      wishlist = wishlist.filter((x) => x._id !== product._id);
    } else {
      // Add to wishlist
      wishlist.push(product);
    }

    localStorage.setItem('wishlistItems', JSON.stringify(wishlist));
    setIsWishlisted(!isWishlisted);
    window.dispatchEvent(new Event("storage")); // Updates other pages instantly
  };

  const addToCartHandler = (e) => {
    e.preventDefault();
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existingItemIndex = cartItems.findIndex((x) => x._id === product._id);

    if (existingItemIndex !== -1) {
      alert('Item is already in your cart!');
      return;
    } else {
      const productToAdd = { ...product, qty: 1 };
      cartItems.push(productToAdd);
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    window.dispatchEvent(new Event("storage"));
    alert(`${product.name} added to cart!`);
  };

  return (
    <Card 
      data-aos="fade-up"
      className="my-3 border-0 shadow-sm rounded-4 h-100 hover-lift overflow-hidden position-relative" 
      style={{ transition: 'all 0.3s ease' }}
    >
      {/* --- 3. UPDATED HEART ICON BUTTON --- */}
      <div className="position-absolute top-0 end-0 p-3" style={{ zIndex: 10 }}>
          <div 
            onClick={toggleWishlistHandler}
            className="bg-white rounded-circle shadow-sm d-flex align-items-center justify-content-center text-muted hover-red" 
            style={{ width: '35px', height: '35px', cursor: 'pointer', transition: '0.2s' }}
          >
              {isWishlisted ? <FaHeart color="red" size={16} className="pulse-soft" /> : <FaRegHeart size={16} />}
          </div>
      </div>

      <Link to={`/product/${product._id}`} className="overflow-hidden bg-light d-flex align-items-center justify-content-center p-4" style={{ height: '220px' }}>
        <Card.Img 
          src={product.image} 
          variant="top" 
          className="product-image-zoom"
          style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} 
        />
      </Link>

      <Card.Body className="d-flex flex-column p-4">
        <div className="mb-2">
            <Badge bg="light" text="secondary" className="border fw-normal px-2 py-1 text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                {product.category || 'General'}
            </Badge>
        </div>

        <Link to={`/product/${product._id}`} className="text-decoration-none text-dark mb-2">
          <Card.Title as="h6" className="fw-bold text-truncate" title={product.name} style={{ lineHeight: '1.4' }}>
            {product.name}
          </Card.Title>
        </Link>

        <div className="mb-3 d-flex align-items-center">
            <div className="d-flex text-warning small me-2" style={{ fontSize: '0.8rem' }}>
                {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < (product.rating || 4) ? "" : "text-muted opacity-25"} />
                ))}
            </div>
            <small className="text-muted" style={{ fontSize: '0.75rem' }}>({product.numReviews || 0} reviews)</small>
        </div>

        <div className="mt-auto d-flex align-items-center justify-content-between">
          <h5 className="mb-0 fw-bold text-primary">{formatToINR(product.price)}</h5>
          
          <Button 
            className="rounded-pill px-3 py-2 custom-btn border-0 shadow-sm d-flex align-items-center justify-content-center" 
            onClick={addToCartHandler}
            disabled={product.countInStock === 0}
            style={{ fontSize: '0.85rem' }}
          >
             {product.countInStock === 0 ? (
                <span className="small">Out of Stock</span>
             ) : (
                <><FaShoppingCart className="me-2"/> Add</>
             )}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;