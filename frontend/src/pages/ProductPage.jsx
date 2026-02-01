import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Card, Button, Form, Container, Badge, Spinner, Alert } from 'react-bootstrap';
import api from '../services/api';
import { FaShoppingCart, FaArrowLeft, FaStar, FaCheck, FaTimes } from 'react-icons/fa';

const ProductPage = () => {
  const { id } = useParams(); 
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
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
    <Container className="text-center py-5">
       <Spinner animation="border" variant="primary" style={{ width: '4rem', height: '4rem' }} />
    </Container>
  );

  if (error) return (
    <Container className="py-5">
      <Alert variant="danger">{error}</Alert>
      <Link className="btn btn-secondary" to="/">Go Back</Link>
    </Container>
  );

  return (
    <Container className="py-5">
      <Link className="btn btn-outline-dark my-3 rounded-pill px-4" to="/">
        <FaArrowLeft className="me-2" /> Go Back
      </Link>

      <Row>
        {/* PRODUCT IMAGE */}
        <Col md={6} className="mb-4">
          <Image src={product.image} alt={product.name} fluid rounded className="shadow-sm border" />
        </Col>

        {/* PRODUCT DETAILS */}
        <Col md={3} className="mb-4">
          <ListGroup variant="flush">
            <ListGroup.Item className="border-0 px-0">
              <h3 className="fw-bold">{product.name}</h3>
            </ListGroup.Item>
            <ListGroup.Item className="border-0 px-0">
              <span className="text-warning">
                  <FaStar /><FaStar /><FaStar /><FaStar /><FaStar /> 
              </span>
              <span className="ms-2 text-muted">({product.numReviews || 0} reviews)</span>
            </ListGroup.Item>
            <ListGroup.Item className="border-0 px-0 fw-bold fs-4">
              Price: ${product.price}
            </ListGroup.Item>
            <ListGroup.Item className="border-0 px-0 text-muted">
              {product.description}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        {/* ADD TO CART CARD */}
        <Col md={3}>
          <Card className="shadow-sm border-0">
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col>Price:</Col>
                  <Col><strong>${product.price}</strong></Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Status:</Col>
                  <Col>
                    {product.countInStock > 0 ? (
                      <Badge bg="success"><FaCheck className="me-1"/> In Stock</Badge>
                    ) : (
                      <Badge bg="danger"><FaTimes className="me-1"/> Out of Stock</Badge>
                    )}
                  </Col>
                </Row>
              </ListGroup.Item>

              {product.countInStock > 0 && (
                <ListGroup.Item>
                  <Row>
                    <Col>Qty:</Col>
                    <Col>
                      <Form.Control 
                        as="select" 
                        value={qty} 
                        onChange={(e) => setQty(e.target.value)}
                        className="form-select-sm"
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

              <ListGroup.Item className="pb-3">
                <Button
                  onClick={addToCartHandler}
                  className="w-100 btn-warning text-white fw-bold"
                  type="button"
                  disabled={product.countInStock === 0}
                >
                  <FaShoppingCart className="me-2" /> Add to Cart
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductPage;