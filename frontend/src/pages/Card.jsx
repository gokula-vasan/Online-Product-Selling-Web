import React, { useState, useEffect } from 'react';
import { Row, Col, ListGroup, Image, Button, Card, Container, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus, FaArrowLeft, FaShoppingBag, FaLock } from 'react-icons/fa';
import api from '../services/api';

const CardPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cartItems')) || [];
    // Ensure quantity exists
    const itemsWithQty = items.map(item => ({ ...item, qty: item.qty || 1 }));
    setCartItems(itemsWithQty);
  }, []);

  // Helper to update state, local storage, AND notify Navbar
  const updateCart = (newItems) => {
    setCartItems(newItems);
    localStorage.setItem('cartItems', JSON.stringify(newItems));
    
    // This event forces the Navbar to update the red badge instantly
    window.dispatchEvent(new Event("storage"));
  };

  const removeFromCart = (index) => {
    const newItems = cartItems.filter((_, i) => i !== index);
    updateCart(newItems);
  };

  const changeQty = (index, delta) => {
    const newItems = [...cartItems];
    const currentItem = newItems[index];
    const newQty = currentItem.qty + delta;
    
    // Check Stock Limit
    const maxStock = currentItem.countInStock || 10; 

    if (newQty > 0 && newQty <= maxStock) {
        newItems[index].qty = newQty;
        updateCart(newItems);
    } else if (newQty > maxStock) {
        alert(`Sorry, only ${maxStock} items available in stock.`);
    }
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2);
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  // --- UPDATED: REAL CHECKOUT LOGIC WITH FIX ---
  const checkoutHandler = async () => {
    // 1. Get User Info
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    
    // 2. Check if Logged In
    if (!userInfo) {
        alert("Please Sign In to Place an Order");
        navigate('/login?redirect=card');
        return;
    }

    try {
        setLoadingCheckout(true);

        // 3. Prepare API Header with Token
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        // 4. Prepare Order Data (FIX: Map '_id' to 'product')
        // The backend expects the ID to be named 'product'
        const orderItemsToSend = cartItems.map(item => ({
            name: item.name,
            qty: item.qty,
            image: item.image,
            price: item.price,
            product: item._id  // <--- THIS IS THE CRITICAL FIX
        }));

        const orderData = {
            orderItems: orderItemsToSend,
            totalPrice: Number(totalPrice)
        };

        // 5. Send to Backend
        await api.post('/orders', orderData, config);

        alert('Order Placed Successfully!');
        
        // 6. Clear Cart & Redirect
        updateCart([]); 
        navigate('/profile'); 

    } catch (error) {
        console.error("Order Error:", error);
        // Show the actual error message from the backend if available
        const errorMsg = error.response && error.response.data.message 
            ? error.response.data.message 
            : error.message;
        alert(`Failed to place order: ${errorMsg}`);
    } finally {
        setLoadingCheckout(false);
    }
  };

  return (
    <Container className="py-5">
      <h2 className="mb-4 fw-bold">Shopping Cart</h2>
      
      <Row>
        {/* LEFT SIDE: Cart Items */}
        <Col md={8}>
          {cartItems.length === 0 ? (
            <div className="text-center py-5 bg-light rounded shadow-sm border">
                <FaShoppingBag size={60} className="text-secondary mb-3" />
                <h3 className="fw-bold text-dark">Your cart is empty</h3>
                <p className="text-muted">Looks like you haven't added anything yet.</p>
                <Link to="/" className="btn btn-warning text-white px-4 py-2 mt-2 fw-bold">
                    <FaArrowLeft className="me-2" /> Start Shopping
                </Link>
            </div>
          ) : (
            <ListGroup variant="flush">
              {cartItems.map((item, index) => (
                <ListGroup.Item key={index} className="mb-3 shadow-sm rounded border p-3 bg-white">
                  <Row className="align-items-center">
                    {/* Image */}
                    <Col md={2}>
                      <Image 
                        src={item.image} 
                        alt={item.name} 
                        fluid 
                        rounded 
                        style={{ height: '100px', width: '100px', objectFit: 'contain', border: '1px solid #eee' }} 
                      />
                    </Col>
                    
                    {/* Name & Details */}
                    <Col md={4}>
                      <Link to={`/product/${item._id}`} className="text-decoration-none text-dark">
                        <h5 className="fw-bold mb-1">{item.name}</h5>
                      </Link>
                      <p className="text-muted small mb-1">{item.category}</p>
                      {item.countInStock > 0 ? (
                        <span className="text-success small fw-bold">In Stock</span>
                      ) : (
                        <span className="text-danger small fw-bold">Out of Stock</span>
                      )}
                    </Col>
                    
                    {/* Price */}
                    <Col md={2}>
                        <h5 className="mb-0 text-dark fw-bold">${item.price}</h5>
                    </Col>
                    
                    {/* Quantity Controls */}
                    <Col md={3} className="d-flex align-items-center justify-content-between" style={{ maxWidth: '140px'}}>
                        <Button variant="outline-dark" size="sm" className="rounded-circle" onClick={() => changeQty(index, -1)} style={{ width: '32px', height: '32px' }}>
                            <FaMinus size={10} />
                        </Button>
                        <span className="fw-bold mx-2" style={{ fontSize: '1.1rem' }}>{item.qty}</span>
                        <Button variant="outline-dark" size="sm" className="rounded-circle" onClick={() => changeQty(index, 1)} style={{ width: '32px', height: '32px' }}>
                            <FaPlus size={10} />
                        </Button>
                    </Col>

                    {/* Remove Button */}
                    <Col md={1} className="text-end">
                      <Button variant="light" className="text-danger border-0 hover-shadow" onClick={() => removeFromCart(index)}>
                        <FaTrash size={18} />
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>

        {/* RIGHT SIDE: Order Summary */}
        <Col md={4}>
          <Card className="shadow-sm border-0 sticky-top" style={{ top: '100px' }}>
            <Card.Header className="bg-white border-bottom pt-4 pb-3">
                <h4 className="fw-bold mb-0">Order Summary</h4>
            </Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item className="border-0 d-flex justify-content-between align-items-center mt-2">
                 <span className="text-muted">Items ({totalItems})</span>
                 <span className="fw-bold">${totalPrice}</span>
              </ListGroup.Item>
              <ListGroup.Item className="border-0 d-flex justify-content-between align-items-center">
                 <span className="text-muted">Shipping</span>
                 <span className="text-success fw-bold">Free</span>
              </ListGroup.Item>
              <ListGroup.Item className="border-0 d-flex justify-content-between align-items-center">
                 <span className="text-muted">Tax</span>
                 <span className="fw-bold">$0.00</span>
              </ListGroup.Item>
              
              <hr className="mx-3 my-2" />

              <ListGroup.Item className="border-0 d-flex justify-content-between align-items-center">
                 <h5 className="fw-bold">Total Amount</h5>
                 <h4 className="fw-bold text-primary">${totalPrice}</h4>
              </ListGroup.Item>
              
              <ListGroup.Item className="pb-4 border-0">
                <Button 
                    type="button" 
                    className="w-100 btn-warning text-white fw-bold py-3 shadow-sm" 
                    disabled={cartItems.length === 0 || loadingCheckout} 
                    onClick={checkoutHandler}
                    style={{ fontSize: '1.1rem' }}
                >
                  {loadingCheckout ? (
                    <>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                        Processing...
                    </>
                  ) : (
                    <>
                        <FaLock className="me-2" /> Place Order
                    </>
                  )}
                </Button>
                <div className="text-center mt-3 small text-muted">
                    <FaLock className="me-1" /> Secure Checkout
                </div>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CardPage;