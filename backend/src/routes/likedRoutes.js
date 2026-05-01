const express = require("express");
const {
  getLikedItems,
  addItem,
  removeItem,
  clearAll,
} = require("../controllers/likedController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getLikedItems);
router.post("/add", protect, addItem);
router.delete("/remove/:productId", protect, removeItem);
router.delete("/clear", protect, clearAll);

module.exports = router;