import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table, Badge, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const ProfilePage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [orders, setOrders] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    if (!userInfo) {
      navigate('/login');
    } else {
      setName(userInfo.name);
      setEmail(userInfo.email);
      fetchMyOrders(userInfo);
    }
  }, [navigate]);

  // --- 1. FETCH REAL ORDERS FROM DATABASE ---
  const fetchMyOrders = async (userInfo) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await api.get('/orders/myorders', config);
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // --- 2. UPDATE PROFILE HANDLER ---
  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else {
        // Placeholder for future Profile Update logic
        alert("Profile Update feature coming soon!");
    }
  };

  return (
    <Container className="py-5">
      <Row>
        {/* LEFT SIDE: User Details */}
        <Col md={4} className="mb-4">
          <h2 className="mb-3 fw-bold">User Profile</h2>
          {message && <Alert variant="danger">{message}</Alert>}
          <Card className="p-4 shadow-sm border-0">
            <Form onSubmit={submitHandler}>
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  disabled // Email usually cannot be changed easily
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="password">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="confirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Form.Group>

              <Button type="submit" variant="primary" className="w-100 fw-bold">
                Update Profile
              </Button>
            </Form>
          </Card>
        </Col>

        {/* RIGHT SIDE: Real Order History */}
        <Col md={8}>
          <h2 className="mb-3 fw-bold">My Orders</h2>
          {orders.length === 0 ? (
            <Alert variant="info">You haven't placed any orders yet.</Alert>
          ) : (
            <Table striped bordered hover responsive className="shadow-sm">
              <thead className="bg-light">
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Paid</th>
                  <th>Delivered</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>#{order._id.substring(0, 8)}...</td>
                    <td>{order.createdAt.substring(0, 10)}</td>
                    <td className="fw-bold">${order.totalPrice}</td>
                    <td>
                      {order.isPaid ? (
                        <Badge bg="success">Paid</Badge>
                      ) : (
                        <Badge bg="danger">Unpaid</Badge>
                      )}
                    </td>
                    <td>
                      {order.isDelivered ? (
                        <Badge bg="success">Delivered</Badge>
                      ) : (
                        <Badge bg="warning" text="dark">Processing</Badge>
                      )}
                    </td>
                    <td>
                      <Button variant="light" size="sm" className="border">
                        Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;