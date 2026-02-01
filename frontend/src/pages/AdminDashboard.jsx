import React, { useEffect, useState } from 'react';
import { Table, Button, Container, Row, Col, Card, Modal, Form, Badge, Tabs, Tab, Pagination, InputGroup } from 'react-bootstrap';
import { FaPlus, FaTrash, FaEdit, FaBoxOpen, FaDollarSign, FaShoppingCart, FaSearch } from 'react-icons/fa';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [key, setKey] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  
  // Search & Pagination State
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '', price: '', category: '', image: '', description: '', countInStock: 0
  });

  const navigate = useNavigate();

  useEffect(() => {
    // --- SECURITY BYPASS ENABLED (For Testing) ---
    // In production, uncomment the lines below to secure this page
    // const user = getUserDetails();
    // if (!user || !user.isAdmin) {
    //   navigate('/'); 
    // } else {
      fetchProducts();
      fetchOrders();
    // }
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
      
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };

      const { data } = await api.get('/orders', config);
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders", error);
    }
  };

  // --- NEW: MARK ORDER AS DELIVERED ---
  const markAsDelivered = async (id) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };

      // Call the backend API we just created
      await api.put(`/orders/${id}/deliver`, {}, config);
      
      // Refresh the orders list to update the UI
      fetchOrders();
      alert('Order Marked as Delivered!');
    } catch (error) {
      console.error("Error updating order", error);
      alert('Failed to update order status');
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        setProducts(products.filter(p => p._id !== id));
        alert('Product Deleted Successfully');
      } catch (error) {
        console.error("Delete Error:", error);
        alert('Error deleting product. Make sure backend is running.');
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
        fetchProducts();
        alert('Product Updated Successfully!');
      } else {
        await api.post('/products', productForm);
        fetchProducts();
        alert('Product Created Successfully');
      }
      setShowModal(false);
    } catch (error) {
      alert('Operation Failed');
    }
  };

  // --- Logic for Search & Pagination ---
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark">Admin Dashboard</h2>
        <Badge bg="dark" className="p-2">Admin Mode (Bypassed)</Badge>
      </div>
      
      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="shadow border-0 p-3 mb-3 text-white" style={{ background: 'linear-gradient(45deg, #4b6cb7, #182848)' }}>
            <div className="d-flex align-items-center">
              <FaBoxOpen size={40} className="me-3 opacity-50" />
              <div>
                <h5 className="mb-0">Total Products</h5>
                <h3>{products.length}</h3>
              </div>
            </div>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow border-0 p-3 mb-3 text-white" style={{ background: 'linear-gradient(45deg, #11998e, #38ef7d)' }}>
            <div className="d-flex align-items-center">
              <FaDollarSign size={40} className="me-3 opacity-50" />
              <div>
                <h5 className="mb-0">Total Revenue</h5>
                <h3>${products.reduce((acc, item) => acc + Number(item.price), 0).toLocaleString()}</h3>
              </div>
            </div>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow border-0 p-3 mb-3 text-white" style={{ background: 'linear-gradient(45deg, #f7971e, #ffd200)' }}>
            <div className="d-flex align-items-center">
              <FaShoppingCart size={40} className="me-3 opacity-50" />
              <div>
                <h5 className="mb-0">Active Orders</h5>
                <h3>{orders.length}</h3>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Tabs
        id="admin-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-4 custom-tabs border-bottom-0"
      >
        {/* TAB 1: PRODUCT MANAGEMENT */}
        <Tab eventKey="products" title="Manage Products">
          
          <Card className="shadow-lg border-0 rounded-3">
            <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                    {/* Search Bar */}
                    <InputGroup style={{ maxWidth: '300px' }}>
                        <InputGroup.Text className="bg-white border-end-0"><FaSearch className="text-muted"/></InputGroup.Text>
                        <Form.Control 
                            placeholder="Search products..." 
                            className="border-start-0 ps-0"
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        />
                    </InputGroup>

                    <Button variant="success" className="px-4 fw-bold" onClick={() => handleShowModal()}>
                    <FaPlus className="me-2" /> Add Product
                    </Button>
                </div>

                <Table responsive hover className="align-middle mb-0">
                <thead className="bg-light">
                    <tr>
                    <th className="border-0">Product</th>
                    <th className="border-0">Category</th>
                    <th className="border-0">Price</th>
                    <th className="border-0">Stock</th>
                    <th className="border-0 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentProducts.map((product) => (
                    <tr key={product._id}>
                        <td>
                        <div className="d-flex align-items-center">
                            <img 
                                src={product.image} 
                                alt={product.name} 
                                className="rounded shadow-sm me-3"
                                style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                            />
                            <span className="fw-bold text-dark">{product.name}</span>
                        </div>
                        </td>
                        <td><Badge bg="light" text="dark" className="border">{product.category}</Badge></td>
                        <td className="fw-bold text-success">${product.price}</td>
                        <td>
                        {product.countInStock > 0 ? 
                            <Badge bg="success" className="px-2 py-1">In Stock ({product.countInStock})</Badge> : 
                            <Badge bg="danger" className="px-2 py-1">Out of Stock</Badge>
                        }
                        </td>
                        <td className="text-center">
                        <Button variant="light" size="sm" className="me-2 text-primary hover-shadow" onClick={() => handleShowModal(product)}>
                            <FaEdit />
                        </Button>
                        <Button variant="light" size="sm" className="text-danger hover-shadow" onClick={() => deleteHandler(product._id)}>
                            <FaTrash />
                        </Button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </Table>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="d-flex justify-content-center mt-4">
                        <Pagination>
                            <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
                            {[...Array(totalPages)].map((_, i) => (
                                <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => paginate(i + 1)}>
                                    {i + 1}
                                </Pagination.Item>
                            ))}
                            <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} />
                        </Pagination>
                    </div>
                )}
            </Card.Body>
          </Card>
        </Tab>

        {/* TAB 2: ORDER MANAGEMENT */}
        <Tab eventKey="orders" title="Manage Orders">
          <Card className="shadow-lg border-0 rounded-3">
            <Card.Body>
                <Table responsive hover className="align-middle mb-0">
                <thead className="bg-light">
                    <tr>
                    <th className="border-0">Order ID</th>
                    <th className="border-0">User</th>
                    <th className="border-0">Date</th>
                    <th className="border-0">Total</th>
                    <th className="border-0">Paid</th>
                    <th className="border-0">Delivered</th>
                    <th className="border-0">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                    <tr key={order._id}>
                        <td className="fw-bold">#{order._id.substring(0, 8)}...</td>
                        <td>{order.user ? order.user.name : 'Unknown User'}</td>
                        <td className="text-muted small">{order.createdAt ? order.createdAt.substring(0, 10) : 'N/A'}</td>
                        <td className="fw-bold">${order.totalPrice}</td>
                        <td>
                        {order.isPaid ? <Badge bg="success">Paid</Badge> : <Badge bg="warning" text="dark">Pending</Badge>}
                        </td>
                        
                        {/* DELIVERED STATUS BADGE */}
                        <td>
                        {order.isDelivered ? 
                            <Badge bg="success">Delivered</Badge> : 
                            <Badge bg="secondary">Processing</Badge>
                        }
                        </td>

                        {/* ACTION BUTTONS */}
                        <td>
                        {!order.isDelivered ? (
                            <Button 
                                variant="outline-success" 
                                size="sm" 
                                className="fw-bold"
                                onClick={() => markAsDelivered(order._id)}
                            >
                                Mark Delivered
                            </Button>
                        ) : (
                            <span className="text-muted small fw-bold">Completed</span>
                        )}
                        </td>
                    </tr>
                    ))}
                </tbody>
                </Table>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {/* Add/Edit Product Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered backdrop="static">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">{isEditing ? 'Edit Product' : 'Add New Product'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={submitHandler}>
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control type="text" value={productForm.name} required 
                onChange={(e) => setProductForm({...productForm, name: e.target.value})} />
            </Form.Group>
            
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Price ($)</Form.Label>
                  <Form.Control type="number" value={productForm.price} required 
                    onChange={(e) => setProductForm({...productForm, price: e.target.value})} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Stock Count</Form.Label>
                  <Form.Control type="number" value={productForm.countInStock} required 
                    onChange={(e) => setProductForm({...productForm, countInStock: e.target.value})} />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control type="text" value={productForm.category} required 
                onChange={(e) => setProductForm({...productForm, category: e.target.value})} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control type="text" value={productForm.image} required 
                onChange={(e) => setProductForm({...productForm, image: e.target.value})} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} value={productForm.description} required 
                onChange={(e) => setProductForm({...productForm, description: e.target.value})} />
            </Form.Group>

            <Button variant={isEditing ? "warning" : "primary"} type="submit" className="w-100 fw-bold shadow-sm">
              {isEditing ? 'Update Product' : 'Create Product'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

    </Container>
  );
};

export default AdminDashboard;