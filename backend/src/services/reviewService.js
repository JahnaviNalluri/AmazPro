const Review = require("../models/Review");

const createReview = async (reviewData, customerId) => {
    const existingReview = await Review.findOne({
        customerId,
        productId: reviewData.productId
    });

    if (existingReview) {
        throw new Error("You have already reviewed this product");
    }

    const review = await Review.create({
        ...reviewData,
        customerId
    });

    return review;
};

const getProductReviews = async (productId) => {
    return await Review.find({ productId });
};

const getReviewById = async (reviewId) => {
    const review = await Review.findById(reviewId);

    if (!review) {
        throw new Error("Review not found");
    }

    return review;
};

const updateReview = async (reviewId, updateData, customerId) => {
    const review = await Review.findById(reviewId);

    if (!review) {
        throw new Error("Review not found");
    }

    if (review.customerId.toString() !== customerId.toString()) {
        throw new Error("Unauthorized to update this review");
    }

    const updatedReview = await Review.findByIdAndUpdate(
        reviewId,
        updateData,
        { new: true, runValidators: true }
    );

    return updatedReview;
};

const deleteReview = async (reviewId, customerId) => {
    const review = await Review.findById(reviewId);

    if (!review) {
        throw new Error("Review not found");
    }

    if (review.customerId.toString() !== customerId.toString()) {
        throw new Error("Unauthorized to delete this review");
    }

    await review.deleteOne();

    return { message: "Review deleted successfully" };
};

module.exports = {
    createReview,
    getProductReviews,
    getReviewById,
    updateReview,
    deleteReview
};
