import React, { useEffect, useState } from 'react';
import { Row, Col, Container, Carousel, Form, Spinner, Alert, Button, InputGroup } from 'react-bootstrap';
import { FaSearch, FaShippingFast, FaHeadset, FaMoneyBillWave, FaLock } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import api from '../services/api';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // --- UPDATED CATEGORIES LIST ---
  // Matches the new categories we added in seeder.js
  const categories = ['All', 'Electronics', 'Fashion', 'Furniture', 'Books', 'Sports', 'Beauty'];

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/products');
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError('Failed to load products. Please check your internet connection.');
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter products based on Search AND Category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      {/* 1. HERO BANNER */}
      <Carousel className="mb-0" style={{ marginTop: '-15px' }}>
        <Carousel.Item interval={3000}>
          <img
            className="d-block w-100"
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
            alt="First slide"
            style={{ height: '450px', objectFit: 'cover', filter: 'brightness(0.6)' }}
          />
          <Carousel.Caption className="pb-5">
            <h1 className="display-4 fw-bold">Welcome to EliteShop</h1>
            <p className="lead">Discover the best products at unbeatable prices.</p>
            <Button variant="warning" size="lg" className="fw-bold text-white px-4">Shop Now</Button>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item interval={3000}>
          <img
            className="d-block w-100"
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
            alt="Second slide"
            style={{ height: '450px', objectFit: 'cover', filter: 'brightness(0.6)' }}
          />
          <Carousel.Caption className="pb-5">
            <h1 className="display-4 fw-bold">New Arrivals</h1>
            <p className="lead">Upgrade your style with our latest collection.</p>
            <Button variant="warning" size="lg" className="fw-bold text-white px-4">View Collection</Button>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      {/* 2. SERVICE HIGHLIGHTS */}
      <div className="bg-light py-4 shadow-sm mb-5">
        <Container>
            <Row className="text-center">
                <Col md={3} className="d-flex align-items-center justify-content-center gap-2 mb-3 mb-md-0">
                    <FaShippingFast size={30} className="text-warning" />
                    <div className="text-start">
                        <h6 className="mb-0 fw-bold">Free Shipping</h6>
                        <small className="text-muted">On all orders over $50</small>
                    </div>
                </Col>
                <Col md={3} className="d-flex align-items-center justify-content-center gap-2 mb-3 mb-md-0">
                    <FaHeadset size={30} className="text-warning" />
                    <div className="text-start">
                        <h6 className="mb-0 fw-bold">24/7 Support</h6>
                        <small className="text-muted">Get help anytime</small>
                    </div>
                </Col>
                <Col md={3} className="d-flex align-items-center justify-content-center gap-2 mb-3 mb-md-0">
                    <FaMoneyBillWave size={30} className="text-warning" />
                    <div className="text-start">
                        <h6 className="mb-0 fw-bold">Money Back</h6>
                        <small className="text-muted">30 days guarantee</small>
                    </div>
                </Col>
                <Col md={3} className="d-flex align-items-center justify-content-center gap-2">
                    <FaLock size={30} className="text-warning" />
                    <div className="text-start">
                        <h6 className="mb-0 fw-bold">Secure Payment</h6>
                        <small className="text-muted">100% protected</small>
                    </div>
                </Col>
            </Row>
        </Container>
      </div>

      <Container>
        {/* 3. FILTERS & SEARCH */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 gap-3">
          
          {/* Category Buttons */}
          <div className="d-flex gap-2 overflow-auto w-100 w-md-auto pb-2 pb-md-0">
            {categories.map((cat) => (
                <Button 
                    key={cat} 
                    variant={selectedCategory === cat ? "dark" : "outline-secondary"}
                    className="rounded-pill px-3"
                    onClick={() => setSelectedCategory(cat)}
                >
                    {cat}
                </Button>
            ))}
          </div>

          {/* Search Bar with Icon */}
          <InputGroup style={{ maxWidth: '300px' }}>
            <InputGroup.Text className="bg-white border-end-0">
                <FaSearch className="text-muted" />
            </InputGroup.Text>
            <Form.Control 
                type="text" 
                placeholder="Search products..." 
                className="border-start-0"
                style={{ boxShadow: 'none' }}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </div>

        {/* 4. PRODUCTS GRID */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" role="status" variant="warning" style={{width: '3rem', height: '3rem'}}>
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : error ? (
          <Alert variant="danger" className="text-center">{error}</Alert>
        ) : (
          <>
            <Row>
                {filteredProducts.length === 0 ? (
                <Col className="text-center py-5">
                    <h4 className="text-muted">No products found for "{searchTerm}"</h4>
                    <Button variant="link" onClick={() => {setSearchTerm(''); setSelectedCategory('All')}}>Clear Filters</Button>
                </Col>
                ) : (
                filteredProducts.map((product) => (
                    <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                    <ProductCard product={product} />
                    </Col>
                ))
                )}
            </Row>
          </>
        )}
      </Container>
    </div>
  );
};

export default Home;