const {
  getLiked,
  addToLiked,
  removeFromLiked,
  clearLiked,
} = require("../services/likedService");

// Get liked
const getLikedItems = async (req, res) => {
  try {
    const liked = await getLiked(req.user.id);
    res.json(liked);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add item
const addItem = async (req, res) => {
  try {
    const { productId } = req.body;

    const liked = await addToLiked(req.user.id, productId);
    res.json(liked);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove item
const removeItem = async (req, res) => {
  try {
    const { productId } = req.params;

    const liked = await removeFromLiked(req.user.id, productId);
    res.json(liked);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Clear all
const clearAll = async (req, res) => {
  try {
    const liked = await clearLiked(req.user.id);
    res.json(liked);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getLikedItems,
  addItem,
  removeItem,
  clearAll,
};