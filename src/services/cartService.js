const Cart = require("../models/Cart");
const Product = require("../models/Products");

const getCart = async (customerId) => {
    let cart = await Cart.findOne({ customerId });

    if (!cart) {
        cart = await Cart.create({ customerId, items: [] });
    }

    return cart;
};

const addToCart = async (customerId, productId, quantity = 1) => {
    const product = await Product.findById(productId);

    if (!product) {
        throw new Error("Product not found");
    }

    if (product.stock < quantity) {
        throw new Error("Insufficient stock");
    }

    let cart = await Cart.findOne({ customerId });

    if (!cart) {
        cart = await Cart.create({ customerId, items: [] });
    }

    const existingItem = cart.items.find(
        item => item.productId.toString() === productId.toString()
    );

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.items.push({
            productId,
            quantity,
            price: product.price
        });
    }

    await cart.save();

    return cart;
};

const updateCartItem = async (customerId, productId, quantity) => {
    const cart = await Cart.findOne({ customerId });

    if (!cart) {
        throw new Error("Cart not found");
    }

    const item = cart.items.find(
        item => item.productId.toString() === productId.toString()
    );

    if (!item) {
        throw new Error("Item not found in cart");
    }

    if (quantity <= 0) {
        cart.items = cart.items.filter(
            item => item.productId.toString() !== productId.toString()
        );
    } else {
        item.quantity = quantity;
    }

    await cart.save();

    return cart;
};

const removeFromCart = async (customerId, productId) => {
    const cart = await Cart.findOne({ customerId });

    if (!cart) {
        throw new Error("Cart not found");
    }

    cart.items = cart.items.filter(
        item => item.productId.toString() !== productId.toString()
    );

    await cart.save();

    return cart;
};

const clearCart = async (customerId) => {
    const cart = await Cart.findOne({ customerId });

    if (!cart) {
        throw new Error("Cart not found");
    }

    cart.items = [];
    await cart.save();

    return cart;
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
};
