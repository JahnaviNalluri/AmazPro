const Order = require("../models/Order");
const Product = require("../models/Products"); // make sure filename matches

const createOrder = async (orderData, customerId) => {
    let totalAmount = 0;

    for (const item of orderData.products) {
        const product = await Product.findById(item.productId);

        if (!product) {
            throw new Error("Product not found");
        }

        if (product.stock < item.quantity) {
            throw new Error("Insufficient stock");
        }

        totalAmount += product.price * item.quantity;
        product.stock -= item.quantity;
        await product.save();
    }

    const order = await Order.create({
        products: orderData.products,
        customerId,
        totalAmt: totalAmount,
        shippingAddress: orderData.shippingAddress,
        status: "pending"
    });

    return order;
};

const getOrderById = async (orderId) => {
    const order = await Order.findById(orderId).populate("customerId");

    if (!order) {
        throw new Error("Order not found");
    }

    return order;
};

const getCustomerOrders = async (customerId) => {
    return await Order.find({ customerId });
};

const updateOrderStatus = async (orderId, status) => {
    const order = await Order.findById(orderId);

    if (!order) {
        throw new Error("Order not found");
    }

    order.status = status;
    await order.save();

    return order;
};

const cancelOrder = async (orderId, customerId) => {
    const order = await Order.findById(orderId);

    if (!order) {
        throw new Error("Order not found");
    }

    if (order.customerId.toString() !== customerId.toString()) {
        throw new Error("Unauthorized to cancel this order");
    }

    if (order.status === "delivered") {
        throw new Error("Delivered order cannot be cancelled");
    }

    for (const item of order.products) {
        const product = await Product.findById(item.productId);
        if (product) {
            product.stock += item.quantity;
            await product.save();
        }
    }

    order.status = "cancelled";
    await order.save();

    return order;
};

const getAllOrders = async () => {
    const orders = await Order.find()
        .populate("customerId", "name email")
        .sort({ createdAt: -1 });

    return orders;
};

/* ---------------- VENDOR ORDER UPDATE ---------------- */

const updateOrderStatusByVendor = async (orderId, vendorId, status) => {
    const order = await Order.findById(orderId);

    if (!order) {
        throw new Error("Order not found");
    }

    // Check if order contains vendor's product
    const hasVendorProduct = await Promise.all(
        order.products.map(async (item) => {
            const product = await Product.findById(item.productId);
            return product && product.vendorId.toString() === vendorId.toString();
        })
    );

    if (!hasVendorProduct.includes(true)) {
        throw new Error("Not authorized for this order");
    }

    order.status = status;
    await order.save();

    return order;
};

module.exports = {
    createOrder,
    getOrderById,
    getCustomerOrders,
    updateOrderStatus,
    cancelOrder,
    getAllOrders,
    updateOrderStatusByVendor
};
