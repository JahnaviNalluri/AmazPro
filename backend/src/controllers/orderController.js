const orderService = require("../services/orderService");

const createOrder = async (req, res) => {
    try {
        const order = await orderService.createOrder(req.body, req.user._id);
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getOrder = async (req, res) => {
    try {
        const order = await orderService.getOrderById(req.params.id);
        res.status(200).json(order);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const orders = await orderService.getCustomerOrders(req.user.id);
        res.status(200).json(orders);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const order = await orderService.updateOrderStatus(
            req.params.id,
            req.body.status
        );
        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const cancelOrder = async (req, res) => {
    try {
        const order = await orderService.cancelOrder(
            req.params.id,
            req.user.id
        );
        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await orderService.getAllOrders();
        res.status(200).json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Failed to fetch orders"
        });
    }
};

/* ---------------- VENDOR ORDER UPDATE ---------------- */

const updateOrderStatusByVendor = async (req, res) => {
    try {
        const order = await orderService.updateOrderStatusByVendor(
            req.params.id,
            req.user._id,   // make sure vendor id exists in req.user
            req.body.status
        );

        res.status(200).json({
            message: "Order updated successfully",
            order
        });

    } catch (err) {
        res.status(400).json({
            message: err.message
        });
    }
};

module.exports = {
    createOrder,
    getOrder,
    getMyOrders,
    updateOrderStatus,
    cancelOrder,
    getAllOrders,
    updateOrderStatusByVendor
};
