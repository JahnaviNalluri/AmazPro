const cartService = require("../services/cartService");

const getCart = async (req, res) => {
    try {
        const cart = await cartService.getCart(req.user.id);
        res.status(200).json(cart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const cart = await cartService.addToCart(
            req.user.id,
            productId,
            quantity
        );
        res.status(200).json(cart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateCartItem = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const customerId = req.user.id;

        const cart = await cartService.updateCartItem(
            customerId,
            productId,
            Number(quantity)
        );

        res.json(cart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


const removeFromCart = async (req, res) => {
    try {
        const cart = await cartService.removeFromCart(
            req.user.id,
            req.params.productId
        );
        res.status(200).json(cart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const clearCart = async (req, res) => {
    try {
        const cart = await cartService.clearCart(req.user.id);
        res.status(200).json(cart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
};
