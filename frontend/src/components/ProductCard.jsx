import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';

const ProductCard = ({ product }) => {
  
  // --- THE MISSING LOGIC ---
  const addToCartHandler = () => {
    // 1. Get existing cart from local storage (or empty array)
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    // 2. Check if product already exists to avoid duplicates (Optional logic)
    const existItem = cartItems.find((x) => x._id === product._id);

    if (existItem) {
      alert('Item is already in your cart!');
      return;
    }

    // 3. Add new product with default quantity of 1
    const productToAdd = { ...product, qty: 1 };
    cartItems.push(productToAdd);

    // 4. Save back to local storage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    // 5. Success Feedback
    alert(`${product.name} added to cart successfully!`);
    
    // Optional: Refresh page to update Navbar count immediately
    // window.location.reload(); 
  };
  // -------------------------

  return (
    <Card className="my-3 p-3 rounded shadow-sm border-0 h-100">
      <Link to={`/product/${product._id}`}>
        <Card.Img 
          src={product.image} 
          variant="top" 
          style={{ height: '200px', objectFit: 'contain', padding: '10px' }} 
        />
      </Link>

      <Card.Body className="d-flex flex-column">
        <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: '#333' }}>
          <Card.Title as="div" style={{ fontSize: '1rem', fontWeight: 'bold' }}>
            {product.name}
          </Card.Title>
        </Link>

        <Card.Text as="div" className="my-2">
           <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>${product.price}</span>
        </Card.Text>

        {/* --- ATTACHED THE CLICK HANDLER HERE --- */}
        <Button 
            variant="warning" 
            className="mt-auto w-100 text-white d-flex align-items-center justify-content-center" 
            style={{ fontWeight: 'bold' }}
            onClick={addToCartHandler} 
        >
          <FaShoppingCart className="me-2"/> Add to Cart
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;