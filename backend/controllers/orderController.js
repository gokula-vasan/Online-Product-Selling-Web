const Order = require('../models/Order');


const addOrderItems = async (req, res) => {
    const { orderItems, totalPrice } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400).json({ message: 'No order items' });
        return;
    } else {
        const order = new Order({
            user: req.user._id,
            orderItems,
            totalPrice,
            isPaid: true, 
            paidAt: Date.now(),
            paymentMethod: 'Card' 
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    }
};


const getOrders = async (req, res) => {
    try {
      
        const orders = await Order.find({}).populate('user', 'id name');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching orders' });
    }
};


const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching my orders' });
    }
};


const updateOrderToDelivered = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.isDelivered = true;
            order.deliveredAt = Date.now();

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error updating order' });
    }
};

module.exports = { 
    addOrderItems, 
    getOrders, 
    getMyOrders, 
    updateOrderToDelivered 
};