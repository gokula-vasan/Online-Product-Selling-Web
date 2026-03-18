import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Card, Button, Form, Container, Badge, Spinner, Alert } from 'react-bootstrap';
import api from '../services/api';
import { FaShoppingCart, FaArrowLeft, FaStar, FaTruck, FaShieldAlt, FaLightbulb } from 'react-icons/fa'; // Added FaLightbulb
import { formatToINR } from '../utils/currencyUtils';

const ProductPage = () => {
  const { id } = useParams(); 
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // --- DATA SCIENCE ADDED: State for recommendations ---
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Fetch Main Product
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
        
        // --- DATA SCIENCE ADDED: Fetch Recommendations ---
        try {
          const { data: recData } = await api.get(`/products/${id}/recommendations`);
          setRecommendations(recData);
        } catch (recErr) {
          console.error("Could not fetch recommendations");
        }

        setLoading(false);
      } catch (err) {
        setError('Product not found or server error');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCartHandler = () => {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existingItem = cartItems.find((x) => x._id === product._id);

    if (existingItem) {
      cartItems = cartItems.map((x) => 
        x._id === existingItem._id ? { ...product, qty: Number(qty) } : x
      );
    } else {
      cartItems.push({ ...product, qty: Number(qty) });
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    window.dispatchEvent(new Event("storage"));
    alert('Added to Cart Successfully!');
  };

  if (loading) return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh', marginTop: '80px' }}>
       <Spinner animation="grow" variant="primary" style={{ width: '4rem', height: '4rem' }} />
    </Container>
  );

  if (error) return (
    <Container className="text-center" style={{ marginTop: '120px' }}>
      <Alert variant="danger" className="shadow-sm">{error}</Alert>
      <Link className="btn btn-dark rounded-pill px-4" to="/">Back to Home</Link>
    </Container>
  );

  return (
    <Container className="fade-in" style={{ marginTop: '100px', marginBottom: '50px' }}>
      
      <div className="mb-4">
        <Link to="/" className="text-decoration-none d-inline-block">
          <Button variant="dark" className="rounded-pill px-4 py-2 fw-bold shadow d-flex align-items-center hover-lift">
            <FaArrowLeft className="me-2" /> Back to Products
          </Button>
        </Link>
      </div>

      <Row className="g-5">
        
        {/* LEFT COLUMN: Product Image */}
        <Col md={6} className="mb-4">
          <div className="p-4 bg-white rounded-4 shadow-sm hover-lift position-relative" style={{ overflow: 'hidden' }}>
            <Image 
              src={product.image} 
              alt={product.name} 
              fluid 
              className="product-image-zoom" 
              style={{ transition: 'transform 0.5s ease', cursor: 'pointer', width: '100%', borderRadius: '15px' }}
            />
          </div>
        </Col>

        {/* MIDDLE COLUMN: Product Info */}
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item className="border-0 px-0 bg-transparent">
              <h2 className="fw-bold text-dark display-6">{product.name}</h2>
              <div className="mb-2 d-flex align-items-center">
                 <span className="text-warning fs-6 me-2">
                   {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < (product.rating || 4) ? "text-warning" : "text-muted opacity-25"} />
                   ))}
                 </span>
                 <span className="text-muted small">({product.numReviews || 0} reviews)</span>
              </div>
            </ListGroup.Item>

            <ListGroup.Item className="border-0 px-0 bg-transparent py-2">
              <h3 className="fw-bold text-primary display-5">{formatToINR(product.price)}</h3>
            </ListGroup.Item>

            <ListGroup.Item className="border-0 px-0 bg-transparent text-muted" style={{ lineHeight: '1.8' }}>
              {product.description}
            </ListGroup.Item>

            <ListGroup.Item className="border-0 px-0 bg-transparent mt-3">
               <div className="d-flex flex-column gap-2 text-muted small">
                  <div className="d-flex align-items-center"><FaTruck className="me-2 text-primary"/> Free Delivery on orders over {formatToINR(500)}</div>
                  <div className="d-flex align-items-center"><FaShieldAlt className="me-2 text-primary"/> 2 Year Extended Warranty</div>
               </div>
            </ListGroup.Item>
          </ListGroup>
        </Col>

        {/* RIGHT COLUMN: Action Card */}
        <Col md={3}>
          <Card className="shadow border-0 rounded-4 sticky-top" style={{ top: '100px' }}>
            <Card.Body className="p-4">
              <ListGroup variant="flush">
                <ListGroup.Item className="border-0 px-0 pb-2">
                  <Row>
                    <Col className="text-muted">Price:</Col>
                    <Col className="text-end"><strong>{formatToINR(product.price)}</strong></Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item className="border-0 px-0 pb-3">
                  <Row>
                    <Col className="text-muted">Status:</Col>
                    <Col className="text-end">
                      {product.countInStock > 0 ? (
                        <Badge bg="success" className="px-2 py-1 fw-normal">In Stock</Badge>
                      ) : (
                        <Badge bg="danger" className="px-2 py-1 fw-normal">Out of Stock</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>

                {product.countInStock > 0 && (
                  <ListGroup.Item className="border-0 px-0 pb-3">
                    <Row className="align-items-center">
                      <Col className="text-muted">Qty:</Col>
                      <Col>
                        <Form.Control 
                          as="select" 
                          value={qty} 
                          onChange={(e) => setQty(e.target.value)}
                          className="form-select-sm shadow-none border-secondary text-center"
                        >
                          {[...Array(product.countInStock > 10 ? 10 : product.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}

                <ListGroup.Item className="border-0 px-0 pt-3">
                  <Button
                    onClick={addToCartHandler}
                    className="w-100 custom-btn text-white fw-bold py-2 shadow-sm"
                    type="button"
                    disabled={product.countInStock === 0}
                    style={{ background: 'linear-gradient(to right, #1e3c72, #2a5298)', border: 'none' }}
                  >
                    <FaShoppingCart className="me-2" /> Add to Cart
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* --- DATA SCIENCE ADDED: "Frequently Bought Together" UI --- */}
      {recommendations.length > 0 && (
        <div className="mt-5 pt-5 border-top">
          <h4 className="fw-bold mb-4 text-dark">
            <FaLightbulb className="text-warning me-2" /> Frequently Bought Together
          </h4>
          <Row className="g-4">
            {recommendations.map((rec) => (
              <Col key={rec._id} xs={6} md={4} lg={3}>
                <Card className="h-100 border-0 shadow-sm rounded-4 hover-lift p-2">
                  <Link to={`/product/${rec._id}`} className="text-decoration-none text-dark">
                    <div className="text-center p-3">
                      <Image src={rec.image} alt={rec.name} fluid style={{ maxHeight: '150px', objectFit: 'contain' }} />
                    </div>
                    <Card.Body className="text-center">
                      <h6 className="fw-bold text-truncate mb-2">{rec.name}</h6>
                      <h5 className="text-primary fw-bold mb-0">{formatToINR(rec.price)}</h5>
                    </Card.Body>
                  </Link>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}
      {/* --- END OF DATA SCIENCE UI --- */}

    </Container>
  );
};

export default ProductPage;