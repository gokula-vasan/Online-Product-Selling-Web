import React, { useEffect, useState } from 'react';
import { Table, Button, Container, Row, Col, Card, Modal, Form, Badge, Tabs, Tab, Pagination, InputGroup } from 'react-bootstrap';
import { FaPlus, FaTrash, FaEdit, FaBoxOpen, FaDollarSign, FaShoppingCart, FaSearch, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { formatToINR } from '../utils/currencyUtils';

const AdminDashboard = () => {
  const [key, setKey] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '', price: '', category: '', image: '', description: '', countInStock: 0
  });

  const navigate = useNavigate();

  useEffect(() => {
     fetchProducts();
     fetchOrders();
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
      const { data } = await api.get('/orders', config);
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders", error);
    }
  };

  const markAsDelivered = async (id) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
      await api.put(`/orders/${id}/deliver`, {}, config);
      fetchOrders();
      alert('Order Marked as Delivered!');
    } catch (error) {
      alert('Failed to update order status');
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        setProducts(products.filter(p => p._id !== id));
      } catch (error) {
        alert('Error deleting product.');
      }
    }
  };

  const handleShowModal = (product = null) => {
    if (product) {
      setIsEditing(true);
      setCurrentProductId(product._id);
      setProductForm(product);
    } else {
      setIsEditing(false);
      setProductForm({ name: '', price: '', category: '', image: '', description: '', countInStock: 0 });
    }
    setShowModal(true);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/products/${currentProductId}`, productForm);
        alert('Product Updated Successfully!');
      } else {
        await api.post('/products', productForm);
        alert('Product Created Successfully');
      }
      fetchProducts();
      setShowModal(false);
    } catch (error) {
      alert('Operation Failed');
    }
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="auth-wrapper" style={{ alignItems: 'flex-start', paddingTop: '6rem', paddingBottom: '4rem', height: 'auto', minHeight: '100vh' }}>
      <Container className="fade-in pb-5">
        
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div className="text-white">
            <h2 className="fw-bold mb-0">Admin Dashboard</h2>
            <p className="opacity-75 mb-0">Overview of store performance and management</p>
          </div>
          <Badge bg="white" text="dark" className="px-3 py-2 rounded-pill shadow-sm fw-bold">Admin Mode</Badge>
        </div>
        
        <Row className="mb-5 g-4">
          <Col md={4}>
            <Card className="border-0 shadow-lg text-white hover-lift h-100" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '15px' }}>
              <Card.Body className="p-4 d-flex align-items-center">
                <div className="p-3 bg-white bg-opacity-25 rounded-circle me-3">
                  <FaBoxOpen size={30} />
                </div>
                <div>
                  <h6 className="mb-0 opacity-75">Total Products</h6>
                  <h2 className="mb-0 fw-bold">{products.length}</h2>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0 shadow-lg text-white hover-lift h-100" style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', borderRadius: '15px' }}>
              <Card.Body className="p-4 d-flex align-items-center">
                <div className="p-3 bg-white bg-opacity-25 rounded-circle me-3">
                  <FaDollarSign size={30} />
                </div>
                <div>
                  <h6 className="mb-0 opacity-75">Total Revenue</h6>
                  <h2 className="mb-0 fw-bold">
                    {formatToINR(products.reduce((acc, item) => acc + Number(item.price), 0))}
                  </h2>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0 shadow-lg text-white hover-lift h-100" style={{ background: 'linear-gradient(135deg, #FF9966 0%, #FF5E62 100%)', borderRadius: '15px' }}>
              <Card.Body className="p-4 d-flex align-items-center">
                <div className="p-3 bg-white bg-opacity-25 rounded-circle me-3">
                  <FaShoppingCart size={30} />
                </div>
                <div>
                  <h6 className="mb-0 opacity-75">Active Orders</h6>
                  <h2 className="mb-0 fw-bold">{orders.length}</h2>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Card className="shadow-lg border-0" style={{ borderRadius: '20px', overflow: 'hidden' }}>
          <Card.Body className="p-4 bg-white">
            <Tabs
              id="admin-tabs"
              activeKey={key}
              onSelect={(k) => setKey(k)}
              className="mb-4 custom-tabs border-bottom-0 gap-3"
            >
              <Tab eventKey="products" title={<span className="fw-bold"><FaBoxOpen className="me-2"/>Products</span>}>
                
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4 p-3 bg-light rounded-3">
                    <InputGroup style={{ maxWidth: '350px' }} className="shadow-sm rounded-pill overflow-hidden bg-white">
                        <InputGroup.Text className="bg-white border-0 ps-3"><FaSearch className="text-muted"/></InputGroup.Text>
                        <Form.Control 
                            placeholder="Search by product name..." 
                            className="border-0 shadow-none bg-white"
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        />
                    </InputGroup>

                    <Button variant="primary" className="px-4 py-2 rounded-pill fw-bold shadow-sm custom-btn border-0" onClick={() => handleShowModal()}>
                        <FaPlus className="me-2" /> Add Product
                    </Button>
                </div>

                <div className="table-responsive">
                    <Table hover className="align-middle mb-0">
                    <thead className="bg-light text-secondary small text-uppercase">
                        <tr>
                        <th className="ps-4 border-0 py-3">Product</th>
                        <th className="border-0 py-3">Category</th>
                        <th className="border-0 py-3">Price</th>
                        <th className="border-0 py-3">Stock</th>
                        <th className="border-0 py-3 text-end pe-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProducts.map((product) => (
                        <tr key={product._id} className="border-bottom">
                            <td className="ps-4 py-3">
                            <div className="d-flex align-items-center">
                                <div className="rounded bg-white p-1 me-3 border shadow-sm" style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <img src={product.image} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                </div>
                                <span className="fw-bold text-dark">{product.name}</span>
                            </div>
                            </td>
                            <td><Badge bg="light" text="dark" className="border fw-normal px-2 py-1">{product.category}</Badge></td>
                            <td className="fw-bold text-primary">{formatToINR(product.price)}</td>
                            <td>
                            {product.countInStock > 0 ? 
                                <Badge bg="success" className="bg-opacity-10 text-success px-2 py-1 fw-normal border border-success">In Stock ({product.countInStock})</Badge> : 
                                <Badge bg="danger" className="bg-opacity-10 text-danger px-2 py-1 fw-normal border border-danger">Out of Stock</Badge>
                            }
                            </td>
                            <td className="text-end pe-4">
                            <Button variant="light" size="sm" className="me-2 text-primary shadow-sm rounded-circle p-2 border" onClick={() => handleShowModal(product)}>
                                <FaEdit />
                            </Button>
                            <Button variant="light" size="sm" className="text-danger shadow-sm rounded-circle p-2 border" onClick={() => deleteHandler(product._id)}>
                                <FaTrash />
                            </Button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </Table>
                </div>

                {totalPages > 1 && (
                    <div className="d-flex justify-content-center pt-4">
                        <Pagination className="mb-0 shadow-sm rounded-pill overflow-hidden">
                            <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="border-0" />
                            {[...Array(totalPages)].map((_, i) => (
                                <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => paginate(i + 1)} className="border-0">
                                    {i + 1}
                                </Pagination.Item>
                            ))}
                            <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="border-0" />
                        </Pagination>
                    </div>
                )}
              </Tab>

              <Tab eventKey="orders" title={<span className="fw-bold"><FaShoppingCart className="me-2"/>Orders</span>}>
                <div className="table-responsive">
                    <Table hover className="align-middle mb-0">
                    <thead className="bg-light text-secondary small text-uppercase">
                        <tr>
                        <th className="ps-4 border-0 py-3">Order ID</th>
                        <th className="border-0 py-3">User</th>
                        <th className="border-0 py-3">Total</th>
                        <th className="border-0 py-3 text-center">Payment</th>
                        <th className="border-0 py-3 text-center">Delivery</th>
                        <th className="border-0 py-3 text-end pe-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                        <tr key={order._id} className="border-bottom">
                            <td className="ps-4 fw-bold text-primary">#{order._id.substring(0, 8)}</td>
                            <td>
                                <div className="d-flex flex-column">
                                    <span className="fw-bold text-dark">{order.user ? order.user.name : 'Guest'}</span>
                                    <small className="text-muted">{order.createdAt.substring(0, 10)}</small>
                                </div>
                            </td>
                            <td className="fw-bold text-dark">{formatToINR(order.totalPrice)}</td>
                            <td className="text-center">
                            {order.isPaid ? 
                                <Badge bg="success" className="bg-opacity-10 text-success px-3 py-1 rounded-pill fw-normal border border-success"><FaCheckCircle className="me-1"/> Paid</Badge> : 
                                <Badge bg="warning" className="bg-opacity-10 text-warning px-3 py-1 rounded-pill fw-normal border border-warning"><FaTimesCircle className="me-1"/> Pending</Badge>
                            }
                            </td>
                            <td className="text-center">
                            {order.isDelivered ? 
                                <Badge bg="primary" className="bg-opacity-10 text-primary px-3 py-1 rounded-pill fw-normal border border-primary">Delivered</Badge> : 
                                <Badge bg="secondary" className="bg-opacity-10 text-dark px-3 py-1 rounded-pill fw-normal border border-secondary">Processing</Badge>
                            }
                            </td>
                            <td className="text-end pe-4">
                            {!order.isDelivered ? (
                                <Button variant="outline-success" size="sm" className="rounded-pill px-3 fw-bold" onClick={() => markAsDelivered(order._id)}>
                                    Mark Delivered
                                </Button>
                            ) : (
                                <span className="text-muted small fw-bold"><FaCheckCircle className="text-success me-1"/> Completed</span>
                            )}
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </Table>
                </div>
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>

        <Modal show={showModal} onHide={() => setShowModal(false)} centered backdrop="static" size="lg">
          <Modal.Header closeButton className="border-0 pb-0">
            <Modal.Title className="fw-bold">{isEditing ? 'Edit Product' : 'Add New Product'}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
            <Form onSubmit={submitHandler}>
              <Row>
                  <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="small fw-bold text-uppercase text-muted">Product Name</Form.Label>
                        <Form.Control type="text" value={productForm.name} onChange={(e) => setProductForm({...productForm, name: e.target.value})} className="bg-light border-0" required />
                      </Form.Group>
                  </Col>
                  <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="small fw-bold text-uppercase text-muted">Category</Form.Label>
                        <Form.Control type="text" value={productForm.category} onChange={(e) => setProductForm({...productForm, category: e.target.value})} className="bg-light border-0" required />
                      </Form.Group>
                  </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    {/* CHANGED LABEL TO INR */}
                    <Form.Label className="small fw-bold text-uppercase text-muted">Price (₹)</Form.Label>
                    <Form.Control type="number" value={productForm.price} onChange={(e) => setProductForm({...productForm, price: e.target.value})} className="bg-light border-0" required />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold text-uppercase text-muted">Stock Count</Form.Label>
                    <Form.Control type="number" value={productForm.countInStock} onChange={(e) => setProductForm({...productForm, countInStock: e.target.value})} className="bg-light border-0" required />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold text-uppercase text-muted">Image URL</Form.Label>
                <Form.Control type="text" value={productForm.image} onChange={(e) => setProductForm({...productForm, image: e.target.value})} className="bg-light border-0" required />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="small fw-bold text-uppercase text-muted">Description</Form.Label>
                <Form.Control as="textarea" rows={3} value={productForm.description} onChange={(e) => setProductForm({...productForm, description: e.target.value})} className="bg-light border-0" required />
              </Form.Group>

              <div className="d-flex justify-content-end gap-2">
                  <Button variant="light" onClick={() => setShowModal(false)}>Cancel</Button>
                  <Button variant="primary" type="submit" className="px-4 fw-bold custom-btn border-0">
                    {isEditing ? 'Save Changes' : 'Create Product'}
                  </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>

      </Container>
    </div>
  );
};

export default AdminDashboard;