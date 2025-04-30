const Order = require('../models/Order');

// Create a new order
exports.createOrder = async (req, res) => {
    try {
        console.log('Received order data:', req.body);
        const { userId, userName, items, billAmount } = req.body;
        
        // Validate required fields
        if (!userId || !userName || !items || !billAmount) {
            console.log('Missing required fields:', { userId, userName, items, billAmount });
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields',
                receivedData: { userId, userName, items, billAmount }
            });
        }

        // Validate items array
        if (!Array.isArray(items) || items.length === 0) {
            console.log('Invalid items array:', items);
            return res.status(400).json({
                success: false,
                message: 'Items must be a non-empty array'
            });
        }

        // Validate each item
        for (const item of items) {
            if (!item.name || typeof item.quantity !== 'number') {
                console.log('Invalid item:', item);
                return res.status(400).json({
                    success: false,
                    message: 'Each item must have a name and quantity'
                });
            }
        }

        // Generate order ID using timestamp
        const orderId = `ORD${Date.now()}`;
        
        const order = new Order({
            userId,
            userName,
            orderId,
            items,
            billAmount
        });

        console.log('Attempting to save order:', order);
        const savedOrder = await order.save();
        console.log('Order saved successfully:', savedOrder);
        
        res.status(201).json({ success: true, order: savedOrder });
    } catch (error) {
        console.error('Error creating order:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ 
            success: false, 
            message: error.message,
            stack: error.stack
        });
    }
};

// Get all orders for a user
exports.getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log('Fetching orders for user:', userId);
        
        const orders = await Order.find({ userId }).sort({ createdAt: -1 });
        console.log('Found orders:', orders);
        
        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message,
            stack: error.stack
        });
    }
};

// Get a single order
exports.getOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        console.log('Fetching order:', orderId);
        
        const order = await Order.findOne({ orderId });
        console.log('Found order:', order);
        
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        
        res.status(200).json({ success: true, order });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message,
            stack: error.stack
        });
    }
}; 