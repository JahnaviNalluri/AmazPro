const reviewService = require("../services/reviewService");

const createReview = async (req, res) => {
    try {
        const review = await reviewService.createReview(req.body, req.user.id);
        res.status(201).json(review);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getProductReviews = async (req, res) => {
    try {
        const reviews = await reviewService.getProductReviews(req.params.productId);
        res.status(200).json(reviews);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateReview = async (req, res) => {
    try {
        const review = await reviewService.updateReview(
            req.params.id,
            req.body,
            req.user.id
        );
        res.status(200).json(review);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteReview = async (req, res) => {
    try {
        const result = await reviewService.deleteReview(
            req.params.id,
            req.user.id
        );
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createReview,
    getProductReviews,
    updateReview,
    deleteReview
};
